export const SERVER_URL = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_URL
  : window.location.protocol + '//' + window.location.host;
