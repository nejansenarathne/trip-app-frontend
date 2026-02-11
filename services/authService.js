import { USER_API } from "./api";
import { apiRequest } from "./apiClient";

export const loginAPI = (email, password) => {
  return apiRequest(USER_API.login, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const registerAPI = (full_name, email, password) => {
  return apiRequest(USER_API.register, {
    method: "POST",
    body: JSON.stringify({ full_name, email, password }),
  });
};

export const resetPasswordAPI = (email) => {
  return apiRequest(USER_API.resetPassword, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const refreshTokenAPI = (refresh) => {
  return apiRequest(USER_API.refresh, {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
};

export const getProfileAPI = (token) => {
  return apiRequest(USER_API.profile, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfileAPI = (token, payload) => {
  return apiRequest(USER_API.profile, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const googleLoginAPI = (token) => {
  return apiRequest(USER_API.google, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
};
