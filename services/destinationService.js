import { DESTINATIONS_API } from "./api";
import { apiRequest } from "./apiClient";

//---getting destinations
export const getDestinationsAPI = (token, onUnauthorized) =>
  apiRequest(DESTINATIONS_API.destinations, {
    method: "GET",
    token,
    onUnauthorized,
  });


//---for favorite destinations
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

  
//---foe getting featured destination
export const getFeaturedDestinationAPI = (token, onUnauthorized) =>
  apiRequest(DESTINATIONS_API.destinationFeatured, {
    method: "GET",
    token,
    onUnauthorized,
    headers: {
      "Content-Type": "application/json",
    },
  });