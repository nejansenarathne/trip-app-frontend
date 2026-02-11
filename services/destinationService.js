import { DESTINATIONS_API } from "./api";
import { apiRequest } from "./apiClient";

export const getDestinationsAPI = (token, onUnauthorized) =>
  apiRequest(DESTINATIONS_API.destinations, {
    method: "GET",
    token,
    onUnauthorized,
  });
