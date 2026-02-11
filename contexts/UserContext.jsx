import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getProfileAPI,
  googleLoginAPI,
  loginAPI,
  refreshTokenAPI,
  registerAPI,
  resetPasswordAPI,
  updateProfileAPI,
} from "../services/authService";

export const userContext = createContext();
export const useUserContext = () => useContext(userContext);

const UserContext = ({ children }) => {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ACCESS_KEY = "access_token";
  const REFRESH_KEY = "refresh_token";

  // ✅ Load saved login on app start
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const savedAccess = await SecureStore.getItemAsync(ACCESS_KEY);
        const savedRefresh = await SecureStore.getItemAsync(REFRESH_KEY);

        if (savedAccess) setAccessToken(savedAccess);

        if (savedAccess && savedRefresh) {
          await loadProfile(); // will refresh token if needed
        }
      } catch (err) {
        console.log("SecureStore error:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // ✅ Save tokens (used after login/register)
  const saveTokens = async (access, refresh) => {
    await SecureStore.setItemAsync(ACCESS_KEY, access);
    await SecureStore.setItemAsync(REFRESH_KEY, refresh);
    setAccessToken(access);
  };

  // ✅ Refresh access token
  const refreshAccess = async () => {
    const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
    if (!refresh) return null;

    const data = await refreshTokenAPI(refresh); // { access: "..." }
    if (!data?.access) return null;

    await SecureStore.setItemAsync(ACCESS_KEY, data.access);
    setAccessToken(data.access);

    return data.access;
  };

  // ✅ Load user profile (auto refresh on 401)
  const loadProfile = async () => {
    let access = await SecureStore.getItemAsync(ACCESS_KEY);

    if (!access) {
      console.log("Access token not found");
      setUser(null);
      return null;
    }

    try {
      const profile = await getProfileAPI(access);
      setUser(profile);
      return profile;
    } catch (err) {
      const msg = String(err?.message || "");
      console.log("Profile error:", msg);

      // only refresh when it actually looks like auth expired
      if (
        msg.toLowerCase().includes("401") ||
        msg.toLowerCase().includes("unauthorized") ||
        msg.toLowerCase().includes("token")
      ) {
        const newAccess = await refreshAccess();
        if (!newAccess) {
          setUser(null);
          return null;
        }

        try {
          const profile2 = await getProfileAPI(newAccess);
          setUser(profile2);
          return profile2;
        } catch (e2) {
          console.log("Profile retry failed:", e2?.message || e2);
          setUser(null);
          return null;
        }
      }

      setUser(null);
      return null;
    }
  };

  // ✅ Login action (UI calls this)
  const authLogin = async (email, password) => {
    try {
      const data = await loginAPI(email, password);

      const access = data?.access;
      const refresh = data?.refresh;

      if (!access || !refresh) {
        return { ok: false, message: data?.message || "Login failed ❌" };
      }

      await saveTokens(access, refresh);
      await loadProfile();

      return { ok: true };
    } catch (err) {
      const msg = err?.message || "Login failed ❌";
      // your backend sometimes sends "Invalid credentials"
      if (msg.toLowerCase().includes("invalid")) {
        return { ok: false, message: "Invalid credentials." };
      }
      return { ok: false, message: msg };
    }
  };

  // ✅ Register action (UI calls this)
  const authRegister = async (fullName, email, password) => {
    try {
      const data = await registerAPI(fullName, email, password);

      const access = data?.access;
      const refresh = data?.refresh;

      if (!access || !refresh) {
        return {
          ok: false,
          message: data?.message || "Registration failed ❌",
        };
      }

      await saveTokens(access, refresh);
      await loadProfile();

      return { ok: true };
    } catch (err) {
      const msg = err?.message || "Registration failed ❌";
      if (msg.toLowerCase().includes("already")) {
        return { ok: false, message: "Email already exists. Log in instead." };
      }
      return { ok: false, message: msg };
    }
  };

  // ✅ Reset password action (UI calls this)
  const authResetPassword = async (email) => {
    try {
      await resetPasswordAPI(email);
      return { ok: true, message: "Email sent successfully!" };
    } catch (err) {
      return { ok: false, message: err?.message || "Something went wrong" };
    }
  };

  // ✅ Logout
  const logout = async () => {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    setAccessToken(null);
    setUser(null);
    router.replace("/(auth)/loginPage");
  };

  // ✅ Update profile
  const updateProfile = async (updates) => {
    const access = await SecureStore.getItemAsync(ACCESS_KEY);
    if (!access) return { ok: false, message: "Not logged in" };

    const current = user || {};

    // ✅ FULL payload (many DRF PUT endpoints expect full object)
    const payload = {
      id: updates.id ?? current.id ?? null,
      user: updates.user ?? current.user ?? null,

      // backend now returns email, so include it
      email: updates.email ?? current.email ?? "",

      full_name: updates.full_name ?? current.full_name ?? "",
      phone: updates.phone ?? current.phone ?? null,
      bio: updates.bio ?? current.bio ?? null,
      profile_picture:
        updates.profile_picture ?? current.profile_picture ?? null,
    };

    try {
      const updated = await updateProfileAPI(access, payload);
      setUser(updated); // ✅ trust server
      return { ok: true, data: updated };
    } catch (err) {
      const msg = err?.message || "Update failed";
      console.log("updateProfile error:", msg);
      return { ok: false, message: msg };
    }
  };

  //for google login
  const authGoogle = async (googleToken) => {
    try {
      const data = await googleLoginAPI(googleToken);

      const access = data?.access;
      const refresh = data?.refresh;

      if (!access || !refresh) {
        return {
          ok: false,
          message: data?.message || "Google login failed ❌",
        };
      }

      await saveTokens(access, refresh);
      await loadProfile();

      return { ok: true };
    } catch (err) {
      return { ok: false, message: err?.message || "Google login failed ❌" };
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    authLogin,
    authRegister,
    authResetPassword,
    logout,
    refreshAccess,
    loadProfile,
    updateProfile,
    authGoogle,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export default UserContext;
