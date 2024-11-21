export const config = {
  env: import.meta.env.VITE_NODE_ENV,
  server: {
    url: import.meta.env.VITE_REACT_SERVER_URL,
  },
  google: {
    recaptcha: {
      siteKey: import.meta.env.VITE_REACT_GOOGLE_RECAPTCHA_SITE_KEY,
      secretKey: import.meta.env.VITE_REACT_GOOGLE_RECAPTCHA_SECRET_KEY,
    },
  },
}
