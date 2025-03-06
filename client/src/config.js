export const config = {
  env: import.meta.env.VITE_NODE_ENV,
  appVersion: import.meta.env.VITE_APP_VERSION || '0.0.0',
  server: {
    url: import.meta.env.VITE_REACT_SERVER_URL,
    apiKey: import.meta.env.VITE_REACT_SERVER_API_MASTER_KEY,
  },
  google: {
    recaptcha: {
      siteKey: import.meta.env.VITE_REACT_GOOGLE_RECAPTCHA_SITE_KEY,
      secretKey: import.meta.env.VITE_REACT_GOOGLE_RECAPTCHA_SECRET_KEY,
    },
  },
}