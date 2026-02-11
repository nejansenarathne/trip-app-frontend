import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import googleIcon from "../../assets/images/google.png";
import { useUserContext } from "../../contexts/UserContext";
import { useGoogleAuth } from "../../services/googleAuth";

const RegisterPage = () => {
  /* ---------------- STATE ---------------- */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- CONTEXT ---------------- */
  const { authRegister, authGoogle } = useUserContext();

  /* ---------------- GOOGLE ---------------- */
  const { request, response, promptAsync, getGoogleTokenFromResponse } =
    useGoogleAuth();

  useEffect(() => {
    if (response?.type !== "success") return;

    const run = async () => {
      try {
        setLoading(true);
        setError("");

        if (!authGoogle) {
          setError("Auth provider not ready.");
          return;
        }

        const token = getGoogleTokenFromResponse();
        if (!token) {
          setError("Google token not received.");
          return;
        }

        const res = await authGoogle(token);
        if (!res?.ok) {
          setError(res?.message || "Google login failed");
          return;
        }

        router.replace("/tabs/Destinations");
      } catch (e) {
        setError(e?.message || "Google login failed");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [response]);

  /* ---------------- REGISTER ---------------- */
  const registerSubmit = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    // ✅ Validation
    if (
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirm.trim()
    ) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await authRegister(fullName.trim(), email.trim(), password);

      if (!res.ok) {
        setError(res.message);
        return;
      }

      router.replace("/tabs/Destinations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Top */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="sparkles-outline" size={14} color="#0F766E" />
          <Text style={styles.badgeText}>Create account</Text>
        </View>

        <Text style={styles.title}>Join WonderLand</Text>
        <Text style={styles.subtitle}>Save places and plan trips faster</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        {/* Full name */}
        <View style={styles.inputWrap}>
          <Ionicons name="id-card-outline" size={18} color="#64748B" />
          <TextInput
            placeholder="Full name"
            placeholderTextColor="#94A3B8"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            returnKeyType="next"
          />
        </View>

        {/* Email */}
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={18} color="#64748B" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={18} color="#64748B" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!showPw}
            returnKeyType="next"
          />
          <TouchableOpacity
            onPress={() => setShowPw((s) => !s)}
            style={styles.eyeBtn}
            activeOpacity={0.8}
          >
            <Ionicons
              name={showPw ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm */}
        <View style={styles.inputWrap}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#64748B" />
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor="#94A3B8"
            value={confirm}
            onChangeText={setConfirm}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!showConfirm}
            returnKeyType="done"
            onSubmitEditing={registerSubmit}
          />
          <TouchableOpacity
            onPress={() => setShowConfirm((s) => !s)}
            style={styles.eyeBtn}
            activeOpacity={0.8}
          >
            <Ionicons
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        {/* Error */}
        {!!error && <Text style={styles.error}>{error}</Text>}

        {/* Submit */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
          onPress={registerSubmit}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? "Creating..." : "Create account"}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerWrap}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.line} />
        </View>

        {/* Google */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.googleBtn, (!request || loading) && { opacity: 0.6 }]}
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          <Image source={googleIcon} style={styles.googleIcon} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Switch */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(auth)/loginPage")}
          style={styles.switchBtn}
        >
          <Text style={styles.switchText}>
            Already have an account?{" "}
            <Text style={styles.switchStrong}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  header: {
    marginBottom: 18,
    alignItems: "center",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    marginBottom: 12,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F766E",
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    padding: 0,
  },

  eyeBtn: {
    padding: 6,
  },

  error: {
    color: "#EF4444",
    fontWeight: "700",
    marginBottom: 10,
    marginTop: -2,
  },

  primaryBtn: {
    backgroundColor: "#0F766E",
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  switchBtn: {
    marginTop: 14,
    alignItems: "center",
  },

  switchText: {
    color: "#64748B",
    fontWeight: "700",
  },

  switchStrong: {
    color: "#0F766E",
    fontWeight: "900",
  },

  dividerWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  googleIcon: {
    width: 20,
    height: 20,
  },

  googleText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
});
