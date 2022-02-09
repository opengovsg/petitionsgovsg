export const SGID_REDIRECT_URI =
  process.env.NODE_ENV === 'production'
    ? `${process.env.PUBLIC_URL}/api/v1/auth/sgid/login`
    : 'http://localhost:6174/api/v1/auth/sgid/login'
