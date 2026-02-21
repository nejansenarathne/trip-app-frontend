import { DESTINATIONS_API } from "./api";
import { apiRequest } from "./apiClient";

export const getDestinationsAPI = (token, onUnauthorized) =>
  apiRequest(DESTINATIONS_API.destinations, {
    method: "GET",
    token,
    onUnauthorized,
  });

// Add this to your destinationService.js

export const getFavoriteDestinationsAPI = (token, onUnauthorized) =>
  apiRequest(DESTINATIONS_API.destinationsFav, {
    method: "GET",
    token,
    onUnauthorized,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const addFavoriteAPI = (destinationId, token, onUnauthorized) =>
  apiRequest(DESTINATIONS_API.destinationsFav, {
    method: "POST",
    token,
    onUnauthorized,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      destination_id: String(destinationId), // backend expects string (IMPORTANT)
    }),
  });

export const removeFavoriteAPI = (destinationId, token, onUnauthorized) =>
  apiRequest(DESTINATIONS_API.destinationsFav, {
    method: "DELETE",
    token,
    onUnauthorized,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      destination_id: String(destinationId),
    }),
  });
