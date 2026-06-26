import { randomBytes } from 'node:crypto';

/** создает slug организации с коротким случайным суффиксом */
export function createOrganizationSlug(
  organizationName: string,
  email: string,
): string {
  const fallbackName = email.split('@')[0] || 'organization';
  const normalizedName = organizationName || fallbackName;
  const baseSlug = normalizedName
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const safeBaseSlug = baseSlug || 'organization';
  const suffix = randomBytes(4).toString('hex');

  return `${safeBaseSlug}-${suffix}`;
}
