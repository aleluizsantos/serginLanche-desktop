const base_url =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_HOST_URL_DEVELOPMENT
    : process.env.REACT_APP_HOST_URL;

export const url = base_url;
