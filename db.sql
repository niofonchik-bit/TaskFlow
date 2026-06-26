-- =====================================================================
-- TaskFlow v1 — pure SQL bootstrap (PostgreSQL / Railway).
-- НЕ выполнять автоматически. Секция 1 УДАЛЯЕТ ДАННЫЕ — сначала бэкап.
-- =====================================================================

-- ===== 0. EXTENSIONS =================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;     -- регистронезависимые email/slug

-- ===== 1. CLEANUP  (⚠️ УДАЛЯЕТ ДАННЫЕ) ==============================
DROP TABLE IF EXISTS
  notifications, audit_log,
  comment_mentions, comment_reactions, comments,
  task_events, checklist_items, checklists, attachments,
  task_links, task_tags, task_watchers, task_assignees, tasks,
  columns, board_user_preferences, board_favorites,
  board_group_access, board_team_access, board_members, boards,
  tags, priorities, task_categories, task_types,
  invitations, role_permissions, roles, permissions,
  group_members, groups, team_members, teams,
  organization_members, organizations, color_presets,
  password_reset_tokens, email_verification_tokens, sessions, users,
  test_records
  CASCADE;

DROP TYPE IF EXISTS
  notification_type, task_link_type, attachment_kind, board_view_type,
  access_level, board_role, board_privacy_mode,
  invitation_status, member_status, user_status CASCADE;

DROP FUNCTION IF EXISTS fn_set_updated_at() CASCADE;

-- ===== 2. ENUM TYPES =================================================
CREATE TYPE user_status        AS ENUM ('active','blocked');
CREATE TYPE member_status      AS ENUM ('active','blocked');
CREATE TYPE invitation_status  AS ENUM ('pending','accepted','revoked','expired');
CREATE TYPE board_privacy_mode AS ENUM ('PRIVATE','ORGANIZATION','TEAM','CUSTOM');
CREATE TYPE board_role         AS ENUM ('admin','editor','viewer');
CREATE TYPE access_level       AS ENUM ('view','edit');
CREATE TYPE board_view_type    AS ENUM ('kanban','table','calendar','timeline');
CREATE TYPE attachment_kind    AS ENUM ('file','image','external_link');
CREATE TYPE task_link_type     AS ENUM ('relates_to','blocks','blocked_by','duplicate_of','derived_from','parent_of','child_of');
CREATE TYPE notification_type  AS ENUM ('assigned','mentioned','comment','due_soon','overdue','privacy_changed','board_added','related_completed','watched_changed');

-- ===== 3. updated_at FUNCTION =======================================
CREATE OR REPLACE FUNCTION fn_set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- ===== 4. TABLES ====================================================

-- 4.1 users
CREATE TABLE users (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email              citext NOT NULL,
  password_hash      text   NOT NULL,                 -- Argon2id PHC-строка
  display_name       text   NOT NULL,
  avatar_file_key    text,
  status             user_status NOT NULL DEFAULT 'active',
  email_verified_at  timestamptz,
  last_login_at      timestamptz,
  failed_login_count int NOT NULL DEFAULT 0,
  locked_until       timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  archived_at        timestamptz,
  archived_by_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  version            int  NOT NULL DEFAULT 1
);

-- 4.2 color_presets (FK на organizations добавляется после её создания)
CREATE TABLE color_presets (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid,
  key              text NOT NULL,
  name             text NOT NULL,
  background_color text NOT NULL,
  foreground_color text NOT NULL,
  border_color     text,
  is_system        boolean NOT NULL DEFAULT false,
  is_active        boolean NOT NULL DEFAULT true,
  sort_order       int     NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_color_presets__bg_hex CHECK (background_color ~ '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT ck_color_presets__fg_hex CHECK (foreground_color ~ '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT ck_color_presets__bd_hex CHECK (border_color IS NULL OR border_color ~ '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT uq_color_presets__org_key UNIQUE (organization_id, key)
);

-- 4.3 organizations
CREATE TABLE organizations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text   NOT NULL,
  slug            citext NOT NULL UNIQUE,
  description     text,
  logo_file_key   text,
  color_preset_id uuid REFERENCES color_presets(id) ON DELETE SET NULL,
  owner_user_id   uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  settings        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by_id   uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_by_id   uuid REFERENCES users(id) ON DELETE SET NULL,
  archived_at     timestamptz,
  archived_by_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  version         int  NOT NULL DEFAULT 1
);
ALTER TABLE color_presets
  ADD CONSTRAINT fk_color_presets__org
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- 4.4 permissions
CREATE TABLE permissions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL UNIQUE,
  description text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 4.5 roles
CREATE TABLE roles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,  -- NULL = системная роль-шаблон
  key             text NOT NULL,
  name            text NOT NULL,
  is_system       boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_roles__org_key UNIQUE (organization_id, key)
);

-- 4.6 role_permissions
CREATE TABLE role_permissions (
  role_id       uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 4.7 organization_members
CREATE TABLE organization_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id         uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  status          member_status NOT NULL DEFAULT 'active',
  joined_at       timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz,
  archived_by_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  version         int  NOT NULL DEFAULT 1
);

-- 4.8 teams / team_members
CREATE TABLE teams (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  color_preset_id uuid REFERENCES color_presets(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz,
  archived_by_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  version         int  NOT NULL DEFAULT 1
);
CREATE TABLE team_members (
  team_id  uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- 4.9 groups / group_members
CREATE TABLE groups (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  color_preset_id uuid REFERENCES color_presets(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz,
  archived_by_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  version         int  NOT NULL DEFAULT 1
);
CREATE TABLE group_members (
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- 4.10 invitations
CREATE TABLE invitations (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email            citext NOT NULL,
  role_id          uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  token_hash       bytea NOT NULL UNIQUE,
  status           invitation_status NOT NULL DEFAULT 'pending',
  invited_by_id    uuid REFERENCES users(id) ON DELETE SET NULL,
  expires_at       timestamptz NOT NULL,
  accepted_at      timestamptz,
  accepted_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- 4.11 task_types / task_categories / priorities
CREATE TABLE task_types (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,  -- NULL = системный
  key             text NOT NULL,
  name            text NOT NULL,
  description     text,
  icon            text,
  color_preset_id uuid REFERENCES color_presets(id) ON DELETE SET NULL,
  is_system       boolean NOT NULL DEFAULT false,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz
);
CREATE TABLE task_categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            text NOT NULL,
  color_preset_id uuid REFERENCES color_presets(id) ON DELETE SET NULL,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz
);
CREATE TABLE priorities (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,  -- NULL = системный
  key             text NOT NULL,
  name            text NOT NULL,
  color_preset_id uuid REFERENCES color_presets(id) ON DELETE SET NULL,
  level           int NOT NULL DEFAULT 0,
  is_system       boolean NOT NULL DEFAULT false,
  is_active       boolean NOT NULL DEFAULT true,
  sort_order      int NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz
);

-- 4.12 boards
CREATE TABLE boards (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name                text NOT NULL,
  description         text,
  color_preset_id     uuid REFERENCES color_presets(id) ON DELETE SET NULL,
  cover_file_key      text,
  privacy_mode        board_privacy_mode NOT NULL DEFAULT 'ORGANIZATION',
  owner_user_id       uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  responsible_team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  position            numeric(20,10) NOT NULL DEFAULT 0,
  is_template         boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  created_by_id       uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_by_id       uuid REFERENCES users(id) ON DELETE SET NULL,
  archived_at         timestamptz,
  archived_by_id      uuid REFERENCES users(id) ON DELETE SET NULL,
  version             int  NOT NULL DEFAULT 1
);

-- 4.13 tags
CREATE TABLE tags (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  board_id        uuid REFERENCES boards(id) ON DELETE CASCADE,  -- NULL = тег уровня организации
  name            text NOT NULL,
  description     text,
  color_preset_id uuid REFERENCES color_presets(id) ON DELETE SET NULL,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz,
  version         int  NOT NULL DEFAULT 1
);

-- 4.14 board access
CREATE TABLE board_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id   uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  board_role board_role NOT NULL DEFAULT 'editor',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_board_members__board_user UNIQUE (board_id, user_id)
);
CREATE TABLE board_team_access (
  board_id     uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  team_id      uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  access_level access_level NOT NULL DEFAULT 'view',
  PRIMARY KEY (board_id, team_id)
);
CREATE TABLE board_group_access (
  board_id     uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  group_id     uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  access_level access_level NOT NULL DEFAULT 'view',
  PRIMARY KEY (board_id, group_id)
);
CREATE TABLE board_favorites (
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  board_id   uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, board_id)
);
CREATE TABLE board_user_preferences (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  board_id          uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  view_type         board_view_type NOT NULL DEFAULT 'kanban',
  filters           jsonb NOT NULL DEFAULT '{}'::jsonb,
  sorting           jsonb NOT NULL DEFAULT '{}'::jsonb,
  grouping          jsonb NOT NULL DEFAULT '{}'::jsonb,
  table_columns     jsonb NOT NULL DEFAULT '[]'::jsonb,
  collapsed_columns jsonb NOT NULL DEFAULT '[]'::jsonb,
  density           text  NOT NULL DEFAULT 'normal',
  zoom              text,
  show_completed    boolean NOT NULL DEFAULT true,
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_board_prefs__user_board UNIQUE (user_id, board_id)
);

-- 4.15 columns
CREATE TABLE columns (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id        uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  color_preset_id uuid REFERENCES color_presets(id) ON DELETE SET NULL,
  position        numeric(20,10) NOT NULL,
  task_limit      int,
  is_done_column  boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz,
  archived_by_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  version         int  NOT NULL DEFAULT 1,
  CONSTRAINT ck_columns__task_limit CHECK (task_limit IS NULL OR task_limit > 0)
);

-- 4.16 tasks (search_vector — GENERATED; cover FK добавляется после attachments)
CREATE TABLE tasks (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  board_id            uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  column_id           uuid NOT NULL REFERENCES columns(id) ON DELETE RESTRICT,
  title               text NOT NULL,
  description         text,
  search_vector       tsvector GENERATED ALWAYS AS
    (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,''))) STORED,
  type_id             uuid REFERENCES task_types(id) ON DELETE SET NULL,
  category_id         uuid REFERENCES task_categories(id) ON DELETE SET NULL,
  priority_id         uuid REFERENCES priorities(id) ON DELETE SET NULL,
  responsible_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  start_date          timestamptz,
  due_date            timestamptz,
  completed_at        timestamptz,
  position            numeric(20,10) NOT NULL,
  cover_attachment_id uuid,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  created_by_id       uuid REFERENCES users(id) ON DELETE SET NULL,   -- автор
  updated_by_id       uuid REFERENCES users(id) ON DELETE SET NULL,
  archived_at         timestamptz,
  archived_by_id      uuid REFERENCES users(id) ON DELETE SET NULL,
  version             int  NOT NULL DEFAULT 1,
  CONSTRAINT ck_tasks__title_len  CHECK (char_length(title) BETWEEN 1 AND 500),
  CONSTRAINT ck_tasks__date_order CHECK (start_date IS NULL OR due_date IS NULL OR start_date <= due_date)
);

-- 4.17 attachments + отложенный FK tasks.cover_attachment_id
CREATE TABLE attachments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  task_id         uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  kind            attachment_kind NOT NULL,
  file_key        text UNIQUE,
  file_name       text,
  mime_type       text,
  file_size       bigint,
  external_url    text,
  uploaded_by_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz,
  archived_by_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  version         int  NOT NULL DEFAULT 1,
  CONSTRAINT ck_attachments__size CHECK (file_size IS NULL OR file_size >= 0),
  CONSTRAINT ck_attachments__file_or_link CHECK (
    (kind IN ('file','image') AND file_key IS NOT NULL AND file_name IS NOT NULL AND external_url IS NULL)
    OR (kind = 'external_link' AND external_url IS NOT NULL AND file_key IS NULL)
  )
);
ALTER TABLE tasks
  ADD CONSTRAINT fk_tasks__cover
  FOREIGN KEY (cover_attachment_id) REFERENCES attachments(id) ON DELETE SET NULL;

-- 4.18 task join-tables
CREATE TABLE task_assignees (
  task_id        uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at    timestamptz NOT NULL DEFAULT now(),
  assigned_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (task_id, user_id)
);
CREATE TABLE task_watchers (
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);
CREATE TABLE task_tags (
  task_id  uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id   uuid NOT NULL REFERENCES tags(id) ON DELETE RESTRICT,  -- теги архивируются, не удаляются
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (task_id, tag_id)
);
CREATE TABLE task_links (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  target_task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  link_type      task_link_type NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  created_by_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT ck_task_links__no_self CHECK (source_task_id <> target_task_id),
  CONSTRAINT uq_task_links__triple  UNIQUE (source_task_id, target_task_id, link_type)
);

-- 4.19 comments + reactions/mentions
CREATE TABLE comments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  task_id           uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id         uuid REFERENCES users(id) ON DELETE SET NULL,
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  body              text NOT NULL,
  search_vector     tsvector GENERATED ALWAYS AS (to_tsvector('simple', coalesce(body,''))) STORED,
  edited_at         timestamptz,
  deleted_at        timestamptz,                  -- мягкое удаление
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  version           int NOT NULL DEFAULT 1
);
CREATE TABLE comment_reactions (
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comment_id, user_id, emoji)
);
CREATE TABLE comment_mentions (
  comment_id        uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  mentioned_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (comment_id, mentioned_user_id)
);

-- 4.20 task_events (история, неизменяемая)
CREATE TABLE task_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  task_id         uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  actor_user_id   uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type      text NOT NULL,
  field           text,
  old_value       jsonb,
  new_value       jsonb,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 4.21 checklists / items
CREATE TABLE checklists (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  task_id         uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title           text NOT NULL,
  position        numeric(20,10) NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  archived_at     timestamptz,
  version         int NOT NULL DEFAULT 1
);
CREATE TABLE checklist_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id     uuid NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
  content          text NOT NULL,
  is_completed     boolean NOT NULL DEFAULT false,
  completed_at     timestamptz,
  completed_by_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  assignee_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  due_date         timestamptz,
  position         numeric(20,10) NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  version          int NOT NULL DEFAULT 1,
  CONSTRAINT ck_checklist_items__completed CHECK (
    (is_completed = false AND completed_at IS NULL) OR
    (is_completed = true  AND completed_at IS NOT NULL)
  )
);

-- 4.22 notifications
CREATE TABLE notifications (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  recipient_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type              notification_type NOT NULL,
  entity_type       text NOT NULL,
  entity_id         uuid,
  actor_user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  payload           jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at           timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- 4.23 audit_log (неизменяемый)
CREATE TABLE audit_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  actor_user_id   uuid REFERENCES users(id) ON DELETE SET NULL,
  action          text NOT NULL,
  entity_type     text NOT NULL,
  entity_id       uuid,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address      inet,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 4.24 sessions + token tables (хранится только хеш токена)
CREATE TABLE sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash     bytea NOT NULL UNIQUE,
  created_at     timestamptz NOT NULL DEFAULT now(),
  expires_at     timestamptz NOT NULL,
  last_active_at timestamptz NOT NULL DEFAULT now(),
  ip_address     inet,
  user_agent     text,
  device_label   text,
  revoked_at     timestamptz
);
CREATE TABLE email_verification_tokens (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash   bytea NOT NULL UNIQUE,
  email        citext NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  consumed_at  timestamptz,
  requested_ip inet
);
CREATE TABLE password_reset_tokens (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash   bytea NOT NULL UNIQUE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  consumed_at  timestamptz,
  requested_ip inet
);

-- ===== 5. INDEXES ===================================================
CREATE UNIQUE INDEX ux_users__email_active            ON users (email)                                  WHERE archived_at IS NULL;
CREATE INDEX        ix_sessions__user_id              ON sessions (user_id);
CREATE INDEX        ix_sessions__expires_at           ON sessions (expires_at);
CREATE INDEX        ix_pwd_reset__active              ON password_reset_tokens (user_id)                WHERE consumed_at IS NULL;
CREATE INDEX        ix_email_verif__active            ON email_verification_tokens (user_id)            WHERE consumed_at IS NULL;
CREATE UNIQUE INDEX ux_org_members__org_user_active   ON organization_members (organization_id,user_id) WHERE archived_at IS NULL;
CREATE INDEX        ix_org_members__user              ON organization_members (user_id);
CREATE UNIQUE INDEX ux_roles__system_key              ON roles (key)                                    WHERE organization_id IS NULL;
CREATE UNIQUE INDEX ux_invitations__org_email_pending ON invitations (organization_id,email)            WHERE status = 'pending';
CREATE INDEX        ix_invitations__org               ON invitations (organization_id);
CREATE UNIQUE INDEX ux_teams__org_name_active         ON teams (organization_id,name)                   WHERE archived_at IS NULL;
CREATE INDEX        ix_team_members__user             ON team_members (user_id);
CREATE UNIQUE INDEX ux_groups__org_name_active        ON groups (organization_id,name)                  WHERE archived_at IS NULL;
CREATE INDEX        ix_group_members__user            ON group_members (user_id);
CREATE UNIQUE INDEX ux_tags__org_name_active          ON tags (organization_id,name)                    WHERE archived_at IS NULL AND board_id IS NULL;
CREATE UNIQUE INDEX ux_tags__board_name_active        ON tags (board_id,name)                           WHERE archived_at IS NULL AND board_id IS NOT NULL;
CREATE INDEX        ix_boards__org_active             ON boards (organization_id)                       WHERE archived_at IS NULL;
CREATE INDEX        ix_boards__org_position           ON boards (organization_id, position);
CREATE INDEX        ix_board_members__user            ON board_members (user_id);
CREATE INDEX        ix_columns__board_position        ON columns (board_id, position)                   WHERE archived_at IS NULL;
CREATE INDEX        ix_tasks__board_column_position   ON tasks (board_id, column_id, position)          WHERE archived_at IS NULL;
CREATE INDEX        ix_tasks__org_active              ON tasks (organization_id)                        WHERE archived_at IS NULL;
CREATE INDEX        ix_tasks__due_date                ON tasks (due_date)                               WHERE archived_at IS NULL AND due_date IS NOT NULL;
CREATE INDEX        ix_tasks__responsible             ON tasks (responsible_user_id);
CREATE INDEX        ix_tasks__archived                ON tasks (organization_id, archived_at)           WHERE archived_at IS NOT NULL;
CREATE INDEX        ix_tasks__search                  ON tasks USING GIN (search_vector);
CREATE INDEX        ix_task_assignees__user           ON task_assignees (user_id);
CREATE INDEX        ix_task_watchers__user            ON task_watchers (user_id);
CREATE INDEX        ix_task_tags__tag                 ON task_tags (tag_id);
CREATE INDEX        ix_task_links__target             ON task_links (target_task_id);
CREATE INDEX        ix_comments__task_created         ON comments (task_id, created_at)                 WHERE deleted_at IS NULL;
CREATE INDEX        ix_comments__search               ON comments USING GIN (search_vector);
CREATE INDEX        ix_task_events__task_created      ON task_events (task_id, created_at);
CREATE INDEX        ix_checklists__task               ON checklists (task_id);
CREATE INDEX        ix_checklist_items__checklist_pos ON checklist_items (checklist_id, position);
CREATE INDEX        ix_attachments__task              ON attachments (task_id)                          WHERE archived_at IS NULL;
CREATE INDEX        ix_notifications__recipient_unread ON notifications (recipient_user_id, created_at) WHERE read_at IS NULL;
CREATE INDEX        ix_audit_log__org_created         ON audit_log (organization_id, created_at);

-- ===== 6. AUTH BOOTSTRAP DATA =======================================
INSERT INTO roles (organization_id, key, name, is_system)
SELECT NULL, 'owner', 'Владелец', true
WHERE NOT EXISTS (
  SELECT 1 FROM roles WHERE organization_id IS NULL AND key = 'owner'
);

INSERT INTO roles (organization_id, key, name, is_system)
SELECT NULL, 'admin', 'Администратор', true
WHERE NOT EXISTS (
  SELECT 1 FROM roles WHERE organization_id IS NULL AND key = 'admin'
);

INSERT INTO roles (organization_id, key, name, is_system)
SELECT NULL, 'member', 'Участник', true
WHERE NOT EXISTS (
  SELECT 1 FROM roles WHERE organization_id IS NULL AND key = 'member'
);

-- ===== 6. updated_at TRIGGERS =======================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users','organizations','organization_members','roles','color_presets',
    'teams','groups','invitations','task_types','task_categories','priorities',
    'tags','boards','columns','tasks','comments','checklists','checklist_items',
    'attachments','board_user_preferences'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER tg_%1$s__set_updated_at BEFORE UPDATE ON %1$s
       FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();', t);
  END LOOP;
END $$;

-- ===== 7. IMMUTABILITY (history / audit) ============================
REVOKE UPDATE, DELETE ON task_events FROM PUBLIC;
REVOKE UPDATE, DELETE ON audit_log   FROM PUBLIC;
-- ВАЖНO: продублируйте REVOKE для роли, под которой подключается API:
-- REVOKE UPDATE, DELETE ON task_events, audit_log FROM <app_role>;

-- ===== 8. COMMENTS ==================================================
COMMENT ON COLUMN sessions.token_hash IS 'SHA-256 от opaque-токена из HttpOnly cookie; сырой токен в БД не хранится';
COMMENT ON COLUMN tasks.search_vector IS 'GENERATED tsvector (title+description), конфигурация simple; GIN ix_tasks__search';
COMMENT ON COLUMN tasks.position       IS 'Дробный rank внутри колонки; ребаланс только при исчерпании точности';
COMMENT ON COLUMN tasks.version        IS 'Optimistic locking: UPDATE ... WHERE version=:expected; 0 строк => 409';
COMMENT ON TABLE  task_events IS 'Неизменяемая история задачи (append-only); UPDATE/DELETE отозваны';
COMMENT ON TABLE  audit_log   IS 'Аудит критических действий организации (роли, права, приватность, передача владения)';
COMMENT ON CONSTRAINT ck_attachments__file_or_link ON attachments IS 'file/image => file_key+file_name; external_link => external_url';
COMMENT ON INDEX ux_users__email_active IS 'Уникальность email только среди не-архивных => повторная регистрация после архивации';