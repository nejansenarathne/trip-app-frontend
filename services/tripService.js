import { TRIPS_API } from "./api";
import { apiRequest } from "./apiClient";

export const createTripAPI = (payload, token, onUnauthorized) =>
  apiRequest(TRIPS_API.trips, {
    method: "POST",
    token,
    onUnauthorized,
    body: JSON.stringify(payload),
  });

export const getTripsAPI = (token, onUnauthorized) =>
  apiRequest(TRIPS_API.trips, {
    method: "GET",
    token,
    onUnauthorized,
  });

export const updateTripAPI = (tripId, payload, token, onUnauthorized) =>
  apiRequest(`${TRIPS_API.trips}${tripId}/`, {
    method: "PATCH",
    token,
    onUnauthorized,
    body: JSON.stringify(payload),
  });

export const deleteTripAPI = (tripId, token, onUnauthorized) =>
  apiRequest(`${TRIPS_API.trips}${tripId}/`, {
    method: "DELETE",
    token,
    onUnauthorized,
  });
