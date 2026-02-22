import { createContext, useContext, useEffect, useState } from "react";
import { useGeneralContext } from "../contexts/GeneralContext";
import {
  addFavoriteAPI,
  getDestinationsAPI,
  getFavoriteDestinationsAPI,
  removeFavoriteAPI,
  getFeaturedDestinationAPI
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

  //featured section 
  const [featuredData, setFeaturedData] = useState(null);
const [featuredDestination, setFeaturedDestination] = useState(null);

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
    imageUrl: d.image_url || d.imageUrl || d.image || "https://via.placeholder.com/150",
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
// const fetchDestinations = async () => {
//   const gate = tokenGate();
//   if (gate) return;

//   setLoadingDestinations(true);
//   try {
//     // 1. Fetch All Destinations
//     const destData = await getDestinationsAPI(accessToken, onUnauthorized);
//     const destList = Array.isArray(destData) ? destData : destData?.results || [];
//     const mappedDestinations = destList.map(toUiDestination);
    
//     // Set destinations first
//     setDestinations(mappedDestinations);

//     // 2. Fetch Favorites
//     const favData = await getFavoriteDestinationsAPI(accessToken, onUnauthorized);
//     const favIdList = Array.isArray(favData) ? favData : favData?.results || [];
    
//     // Extract IDs from backend format: [{"destination_id": 4}, ...]
//     const favIds = favIdList.map(item => String(item.destination_id));

//     // 3. Match them against the NEWLY mapped destinations
//     // We use mappedDestinations here instead of the state 'destinations' 
//     // because state hasn't updated yet in this render cycle.
//     const fullFavObjects = mappedDestinations.filter(d => 
//       favIds.includes(String(d.id))
//     );

//     setFavorites(fullFavObjects);
//   } catch (e) {
//     setDestinationsError(e.message);
//   } finally {
//     setLoadingDestinations(false);
//   }
// };
const fetchDestinations = async () => {
  const gate = tokenGate();
  if (gate) {
    setDestinationsError(gate.message);
    return gate;
  }

  setLoadingDestinations(true);
  try {
    // 1. Fetch All Destinations
    const destData = await getDestinationsAPI(accessToken, onUnauthorized);
    const destList = Array.isArray(destData) ? destData : destData?.results || [];
    const mappedDestinations = destList.map(toUiDestination);
    
    // Set main list immediately
    setDestinations(mappedDestinations);

    // 2. Fetch Featured Data
    const fData = await getFeaturedDestinationAPI(accessToken, onUnauthorized);
    
    if (fData) {
      // If the API returns an array, take the first item
      const actualFeaturedData = Array.isArray(fData) ? fData[0] : fData;
      setFeaturedData(actualFeaturedData);

      // CRITICAL: Robust ID matching (String to String)
      const targetId = String(actualFeaturedData.destination_id);
      const found = mappedDestinations.find(d => String(d.id) === targetId);

      if (found) {
        setFeaturedDestination(found);
        console.log("✅ Featured Destination Matched:", found.name);
      } else {
        console.warn("⚠️ Featured ID not found in destination list. ID:", targetId);
      }
    }

    // 3. Fetch Favorites
    const favData = await getFavoriteDestinationsAPI(accessToken, onUnauthorized);
    const favIdList = Array.isArray(favData) ? favData : favData?.results || [];
    
    // Extract IDs from backend format: [{"destination_id": 4}, ...]
    const favIds = favIdList.map(item => String(item.destination_id));

    // Match them against our mapped list
    const fullFavs = mappedDestinations.filter(d => favIds.includes(String(d.id)));
    setFavorites(fullFavs);

  } catch (e) {
    console.error("❌ Fetch Error:", e.message);
    setDestinationsError(e.message);
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
    const data = await getFavoriteDestinationsAPI(accessToken, onUnauthorized);
    const favIdList = Array.isArray(data) ? data : data?.results || [];

    // CRITICAL: Extract the IDs correctly from your API response format
    const favIds = favIdList.map(item => String(item.destination_id));

    // Map those IDs back to the full destination objects already in state
    const fullFavObjects = destinations.filter(d => 
      favIds.includes(String(d.id))
    );

    setFavorites(fullFavObjects); 
  } catch (e) {
    console.log("Error fetching favorites:", e.message);
  }
};


const addToFavorites = async (destination) => {
  const gate = tokenGate();
  if (gate) return gate;
  try {
    const destId = String(destination.id);
    await addFavoriteAPI(destId, accessToken, onUnauthorized);
    // Add the ID to state
    setFavorites((prev) => [...prev, destId]);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e.message };
  }
};

const removeFromFavorites = async (destination) => {
  const destId = String(destination.id);

  // 1. Update UI Instantly
  setFavorites((prev) => prev.filter((f) => String(f.id) !== destId));

  try {
    // 2. Run API in background
    await removeFavoriteAPI(destId, accessToken, onUnauthorized);
  } catch (e) {
    console.log("Delete failed, rolling back...");
    // 3. Optional: Rollback only if API fails
    fetchFavorites(); 
  }
};

const isFavorite = (id) => {
  return favorites.some((f) => String(f.id) === String(id));
};

const toggleFavorite = async (destination) => {
  const currentlyFav = isFavorite(destination.id);

  if (currentlyFav) {
    // Optimistic UI update: Remove immediately
    setFavorites((prev) => prev.filter((f) => String(f.id) !== String(destination.id)));
    
    const res = await removeFavoriteAPI(destination.id, accessToken, onUnauthorized);
    if (!res.ok) fetchFavorites(); // Rollback if API fails
  } else {
    // Optimistic UI update: Add immediately
    setFavorites((prev) => [...prev, destination]);
    
    const res = await addFavoriteAPI(destination.id, accessToken, onUnauthorized);
    if (!res.ok) fetchFavorites(); // Rollback if API fails
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

    featuredDestination, 
  featuredData,
  };

  return (
    <destinationContext.Provider value={value}>
      {children}
    </destinationContext.Provider>
  );
};

export default DestinationContext;
