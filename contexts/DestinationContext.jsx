import { createContext, useContext, useEffect, useState } from "react";
import { useGeneralContext } from "../contexts/GeneralContext";
import {
  addFavoriteAPI,
  getDestinationsAPI,
  getFavoriteDestinationsAPI,
  removeFavoriteAPI,
} from "../services/destinationService";

import { useUserContext } from "./UserContext";

export const destinationContext = createContext();
export const useDestinationContext = () => useContext(destinationContext);

const DestinationContext = ({ children }) => {
  // ---- AUTH (needs accessToken + onUnauthorized refresh function) ----
  const { accessToken, onUnauthorized } = useUserContext();
  const { categories } = useGeneralContext();

  // ---- STATE ----
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [destinationsError, setDestinationsError] = useState("");

  // favorites
  const [favorites, setFavorites] = useState([]);

  const [selectCategory, setSelectCategory] = useState("All");
  const [filteredDestinations, setFilteredDestinations] = useState([]);

  // ---- helpers ----
  const tokenGate = () => {
    if (!accessToken) {
      return {
        ok: false,
        message: "Missing access token (user not logged in?)",
      };
    }
    return null;
  };

  // Map API -> UI shape (adjust field names to match your backend response)
  // DestinationContext.js

  // Inside your toUiDestination function
  const toUiDestination = (d) => ({
    id: d.id,
    name: d.name ?? d.title ?? "Unknown",
    shortDescription: d.shortDescription ?? d.short_description ?? "",
    longDescription: d.longDescription ?? d.long_description ?? "",
    imageUrl: d.imageUrl ?? d.image_url ?? d.image ?? "",
    rating: typeof d.rating === "number" ? d.rating : Number(d.rating || 0),
    location: {
      latitude: Number(d.latitude ?? d.location?.latitude ?? 0),
      longitude: Number(d.longitude ?? d.location?.longitude ?? 0),
    },
    category: (d.category ?? "").toString().toLowerCase(),
    // ✅ FIX: Include these so they aren't lost
    image_array: d.image_array ?? [],
    things_to_do: d.things_to_do ?? [],
  });

  // ---- FETCH from API ----
  const fetchDestinations = async () => {
    const gate = tokenGate();
    if (gate) {
      setDestinationsError(gate.message);
      return gate;
    }

    setLoadingDestinations(true);
    setDestinationsError("");

    try {
      // 1. Fetch all destinations
      const destData = await getDestinationsAPI(accessToken, onUnauthorized);
      const destList = Array.isArray(destData)
        ? destData
        : destData?.results || [];
      const mappedDestinations = destList.map(toUiDestination);
      setDestinations(mappedDestinations);

      // 2. ✅ CRITICAL FIX: Fetch favorites from the separate API
      const favData = await getFavoriteDestinationsAPI(
        accessToken,
        onUnauthorized,
      );
      const favList = Array.isArray(favData) ? favData : favData?.results || [];

      // Map these favorites so they match the structure of our destinations
      const mappedFavs = favList.map(toUiDestination);
      setFavorites(mappedFavs);
    } catch (e) {
      setDestinationsError(e.message || "Failed to fetch destinations");
      return { ok: false, message: e.message };
    } finally {
      setLoadingDestinations(false);
    }
  };

  // ---- FILTERING ----
  const destinationByCategory = (category) => {
    setSelectCategory(category);
  };

  // keep filtered list updated when category or destinations change
  useEffect(() => {
    if (selectCategory === "All") {
      setFilteredDestinations(destinations);
    } else {
      setFilteredDestinations(
        destinations.filter(
          (d) => d.category.toLowerCase() === selectCategory.toLowerCase(),
        ),
      );
    }
  }, [destinations, selectCategory]);

  // ---- FAVORITES ----

  const fetchFavorites = async () => {
    const gate = tokenGate();
    if (gate) return;

    try {
      const data = await getFavoriteDestinationsAPI(
        accessToken,
        onUnauthorized,
      );
      // Support both array or paginated response
      const list = Array.isArray(data) ? data : data?.results || [];

      // Map them to your UI shape so the ID comparison works
      const mappedFavs = list.map(toUiDestination);
      setFavorites(mappedFavs);
    } catch (e) {
      console.log("Error fetching favorites:", e.message);
    }
  };

  // ADD
  const addToFavorites = async (destination) => {
    const gate = tokenGate();
    if (gate) return gate;
    try {
      // Backend call
      await addFavoriteAPI(destination.id, accessToken, onUnauthorized);
      // Local state update
      setFavorites((prev) => [...prev, destination]);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  const removeFromFavorites = async (destination) => {
    const gate = tokenGate();
    if (gate) return gate;
    try {
      // Backend call
      await removeFavoriteAPI(destination.id, accessToken, onUnauthorized);
      // Local state update
      setFavorites((prev) =>
        prev.filter((f) => String(f.id) !== String(destination.id)),
      );
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  const isFavorite = (id) => {
    // Ensure both are compared as strings to avoid "4" vs 4 mismatch
    return favorites.some((f) => String(f.id) === String(id));
  };

  const toggleFavorite = async (destination) => {
    const currentlyFav = isFavorite(destination.id);

    if (currentlyFav) {
      // If it IS a favorite, call REMOVE (DELETE API)
      setFavorites((prev) =>
        prev.filter((f) => String(f.id) !== String(destination.id)),
      );
      const res = await removeFavoriteAPI(
        destination.id,
        accessToken,
        onUnauthorized,
      );
      if (!res.ok) fetchDestinations(); // Rollback on failure
    } else {
      // If it IS NOT a favorite, call ADD (POST API)
      setFavorites((prev) => [...prev, destination]);
      const res = await addFavoriteAPI(
        destination.id,
        accessToken,
        onUnauthorized,
      );
      if (!res.ok) fetchDestinations(); // Rollback on failure
    }
  };
  // OPTIONAL: auto fetch when token becomes available
  useEffect(() => {
    if (accessToken) {
      fetchDestinations();
      fetchFavorites();
    }
  }, [accessToken]);

  const value = {
    destinations,
    setDestinations,
    loadingDestinations,
    destinationsError,
    fetchDestinations,

    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,

    destinationByCategory,
    filteredDestinations,
    selectCategory,
  };

  return (
    <destinationContext.Provider value={value}>
      {children}
    </destinationContext.Provider>
  );
};

export default DestinationContext;
