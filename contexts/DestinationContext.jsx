import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getDestinationsAPI } from "../services/destinationService"; // <-- adjust path
import { useUserContext } from "./UserContext"; // <-- adjust path to your auth/user context

export const destinationContext = createContext();
export const useDestinationContext = () => useContext(destinationContext);

const DestinationContext = ({ children }) => {
  // ---- AUTH (needs accessToken + onUnauthorized refresh function) ----
  const { accessToken, onUnauthorized } = useUserContext();

  // ---- STATE ----
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [destinationsError, setDestinationsError] = useState("");

  // favorites
  const [favorites, setFavorites] = useState([]);

  // categories + filtering
  const categories = useMemo(
    () => [
      { id: 0, name: "All" },
      { id: 1, name: "Beaches" },
      { id: 2, name: "Hills" },
      { id: 3, name: "Cultural" },
      { id: 4, name: "Wildlife" },
      { id: 5, name: "Historical" },
    ],
    [],
  );

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
    // IMPORTANT: your filter expects lowercase category values like "beaches"
    category: (d.category ?? "").toString().toLowerCase(),
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
      const data = await getDestinationsAPI(accessToken, onUnauthorized);

      // supports list OR paginated
      const list = Array.isArray(data) ? data : data?.results || [];
      const mapped = list.map(toUiDestination);

      setDestinations(mapped);
      return { ok: true, count: mapped.length };
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
        destinations.filter((d) => d.category === selectCategory.toLowerCase()),
      );
    }
  }, [destinations, selectCategory]);

  // ---- FAVORITES ----
  const addToFavorites = (destination) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === destination.id) ? prev : [...prev, destination],
    );
  };

  const removeFromFavorites = (destination) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== destination.id));
  };

  const isFavorite = (destination) => {
    return favorites.some((fav) => fav.id === destination.id);
  };

  // OPTIONAL: auto fetch when token becomes available
  useEffect(() => {
    if (accessToken) fetchDestinations();
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

    categories,
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
