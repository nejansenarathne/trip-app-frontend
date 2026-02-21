import { GENEGRAL_API } from "./api";
import { apiRequest } from "./apiClient";

//gettings the categories list from api
export const getDestinationCategoriesAPI = (token, onUnauthorized) =>
  apiRequest(GENEGRAL_API.categories, {
    method: "GET",
    token,
    onUnauthorized,
  });

//gettings the avatars list from api
export const getAvatarsAPI = (token, onUnauthorized) =>
  apiRequest(GENEGRAL_API.avatars, {
    method: "GET",
    token,
    onUnauthorized,
  });
