import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
    getAvatarsAPI,
    getDestinationCategoriesAPI,
} from "../services/generalService";
import { useUserContext } from "./UserContext";

export const generalContext = createContext();
export const useGeneralContext = () => useContext(generalContext);

const GeneralContext = ({ children }) => {
  const { accessToken, loading: authLoading, refreshAccess } = useUserContext();

  /* ---------------- TOKEN GUARD ---------------- */

  const tokenGate = () => {
    if (authLoading) {
      console.log("Gate: Auth is still loading");
      return { ok: false, message: "Auth still loading..." };
    }
    if (!accessToken) {
      console.log("Gate: No Access Token found");
      return { ok: false, message: "Login required." };
    }
    return null;
  };

  const onUnauthorized = async () => {
    const newToken = await refreshAccess();
    return newToken;
  };

  /* ================================
        AVATARS
  =================================*/

  const [avatars, setAvatars] = useState([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false);

  const fetchAvatars = async () => {
    const gate = tokenGate();
    if (gate) return gate;

    setLoadingAvatars(true);

    try {
      const data = await getAvatarsAPI(accessToken, onUnauthorized);
      const list = Array.isArray(data) ? data : data?.results || [];

      const mapped = list.map((a) => ({
        id: String(a.id),
        // Map 'image_url' from backend to 'url' for your UI
        url: a.image_url || a.url || "",
      }));

      setAvatars(mapped);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  /* ================================
        CATEGORIES
  =================================*/

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchCategories = async () => {
    const gate = tokenGate();
    if (gate) {
      console.log("CAT_FETCH: Blocked by gate", gate.message);
      return gate;
    }

    setLoadingCategories(true);

    try {
      console.log("CAT_FETCH: Starting API call...");
      const data = await getDestinationCategoriesAPI(
        accessToken,
        onUnauthorized,
      );

      // ✅ ADD THIS LOG HERE
      console.log(
        "CAT_FETCH: Raw Data from API:",
        JSON.stringify(data, null, 2),
      );

      const list = Array.isArray(data) ? data : data?.results || [];

      const mapped = [
        { id: 0, name: "All" },
        ...list.map((c) => ({
          id: c.id,
          name: c.name ?? c.title ?? "Unknown",
        })),
      ];

      console.log("CAT_FETCH: Mapped List:", mapped);
      setCategories(mapped);

      return { ok: true };
    } catch (e) {
      console.error("CAT_FETCH: Error", e.message);
      return { ok: false, message: e.message };
    } finally {
      setLoadingCategories(false);
    }
  };

  /* ================================
      AUTO LOAD WHEN LOGIN READY
  =================================*/

  useEffect(() => {
    if (accessToken && !authLoading) {
      // Added !authLoading check
      console.log("GENERAL_CONTEXT_EFFECT: Running fetch...");
      fetchAvatars();
      fetchCategories();
    }
  }, [accessToken, authLoading]); // Added authLoading to dependencies

  /* ================================
      CONTEXT VALUE
  =================================*/

  const value = useMemo(
    () => ({
      avatars,
      categories,

      loadingAvatars,
      loadingCategories,

      fetchAvatars,
      fetchCategories,

      setAvatars,
      setCategories,
    }),
    [avatars, categories, loadingAvatars, loadingCategories],
  );

  return (
    <generalContext.Provider value={value}>{children}</generalContext.Provider>
  );
};

export default GeneralContext;
