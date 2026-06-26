/** имя cookie сессии для локальной разработки */
export const AUTH_SESSION_COOKIE_DEFAULT = 'taskflow_session';

/** срок жизни сессии по умолчанию в днях */
export const AUTH_SESSION_TTL_DAYS_DEFAULT = 30;

/** количество неудачных попыток до временной блокировки */
export const AUTH_LOGIN_LOCK_LIMIT = 5;

/** длительность временной блокировки входа в минутах */
export const AUTH_LOCK_MINUTES = 15;

/** срок жизни токена подтверждения почты в часах */
export const AUTH_EMAIL_TOKEN_TTL_HOURS = 24;
