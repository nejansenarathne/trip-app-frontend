const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const GENEGRAL_API = {
  categories: `${BASE_URL}/api/categories/`,
  avatars: `${BASE_URL}/api/avatar-suggestions/`,
};

export const USER_API = {
  login: `${BASE_URL}/api/auth/login/`,
  register: `${BASE_URL}/api/auth/register/`,
  refresh: `${BASE_URL}/api/auth/refresh/`,
  profile: `${BASE_URL}/api/auth/profile/`,
  resetPassword: `${BASE_URL}/api/auth/password-reset/`,
  google: `${BASE_URL}/api/auth/google/`,
};

export const DESTINATIONS_API = {
  destinations: `${BASE_URL}/api/destinations/`,
  destinationsFav: `${BASE_URL}/api/auth/favourite-destinations/`,
};

export const TRIPS_API = {
  trips: `${BASE_URL}/api/trips/`,
};
