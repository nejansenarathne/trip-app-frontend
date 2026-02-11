import { createContext, useContext, useMemo, useState } from "react";
import {
  createTripAPI,
  deleteTripAPI,
  getTripsAPI,
  updateTripAPI,
} from "../services/tripService";
import { useUserContext } from "./UserContext";

export const tripContext = createContext();
export const useTripContext = () => useContext(tripContext);

/* ------------------ UI -> API mapper ------------------ */
const toApiTrip = (uiTrip) => ({
  name: uiTrip.name,
  start_date: uiTrip.startDate,
  end_date: uiTrip.endDate,
  days: (uiTrip.days || []).map((d) => ({
    day_index: d.dayIndex,
    date: d.date,
    stops: (d.stops || []).map((s, idx) => ({
      order: idx + 1,
      destination_id: s.placeId,
    })),
  })),
});

/* ------------------ API -> UI mapper ------------------ */
const toUiTrip = (apiTrip) => ({
  id: String(apiTrip.id),
  name: apiTrip.name,
  startDate: apiTrip.start_date,
  endDate: apiTrip.end_date,
  days: (apiTrip.days || []).map((d) => ({
    dayIndex: d.day_index,
    date: d.date,
    stops: (d.stops || []).map((s) => ({
      // local id for UI remove buttons (backend id not required for this)
      id: `stop_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      placeId: s.destination.id,
    })),
  })),
});

const TripContext = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);

  const { accessToken, loading: authLoading, refreshAccess } = useUserContext();

  // ✅ guard: prevent calling API before auth loaded or without token
  const tokenGate = () => {
    if (authLoading) return { ok: false, message: "Auth is still loading..." };
    if (!accessToken) return { ok: false, message: "Please log in again." };
    return null;
  };

  const onUnauthorized = async () => {
    const newToken = await refreshAccess();
    return newToken; // apiClient will retry once using this
  };

  const fetchTrips = async () => {
    const gate = tokenGate();
    if (gate) return gate;

    setLoadingTrips(true);

    try {
      const response = await getTripsAPI(accessToken, onUnauthorized);

      console.log("GET TRIPS RESPONSE:", JSON.stringify(response, null, 2));

      // supports list OR paginated
      const list = Array.isArray(response) ? response : response?.results || [];

      setTrips(list.map(toUiTrip));

      return { ok: true };
    } catch (e) {
      console.log("FETCH TRIPS ERROR:", e.message);
      return { ok: false, message: e.message };
    } finally {
      setLoadingTrips(false);
    }
  };

  const createTrip = async (uiTrip) => {
    const gate = tokenGate();
    if (gate) return gate;

    try {
      const payload = toApiTrip(uiTrip);
      console.log("SENDING PAYLOAD:", payload);

      const created = await createTripAPI(payload, accessToken, onUnauthorized);

      const createdUi = toUiTrip(created);
      setTrips((prev) => [createdUi, ...prev]);

      return { ok: true, trip: createdUi };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  const updateTrip = async (tripId, updates) => {
    const gate = tokenGate();
    if (gate) return gate;

    try {
      // merge existing trip + updates
      const current = trips.find((t) => String(t.id) === String(tripId));
      const merged = { ...(current || {}), ...updates };

      const payload = toApiTrip(merged);

      const updated = await updateTripAPI(
        tripId,
        payload,
        accessToken,
        onUnauthorized,
      );

      const updatedUi = toUiTrip(updated);
      setTrips((prev) =>
        prev.map((t) => (String(t.id) === String(tripId) ? updatedUi : t)),
      );

      return { ok: true, trip: updatedUi };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  const deleteTrip = async (tripId) => {
    const gate = tokenGate();
    if (gate) return gate;

    try {
      await deleteTripAPI(tripId, accessToken, onUnauthorized);
      setTrips((prev) => prev.filter((t) => String(t.id) !== String(tripId)));
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  const getTripById = (tripId) =>
    trips.find((t) => String(t.id) === String(tripId));

  const value = useMemo(
    () => ({
      trips,
      loadingTrips,
      fetchTrips,
      createTrip,
      updateTrip,
      deleteTrip,
      getTripById,
      setTrips, // optional
    }),
    [trips, loadingTrips, authLoading, accessToken],
  );

  return <tripContext.Provider value={value}>{children}</tripContext.Provider>;
};

export default TripContext;
