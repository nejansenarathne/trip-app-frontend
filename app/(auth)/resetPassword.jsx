import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserContext } from "../../contexts/UserContext";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { authResetPassword } = useUserContext();

  const handleSubmit = async () => {
    if (loading) return;
    setError("");
    setMessage("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    try {
      const res = await authResetPassword(email.trim());

      if (!res.ok) {
        setError(res.message);
        return;
      }

      setMessage(res.message); // "Email sent successfully!"
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
          <Ionicons name="help-circle-outline" size={14} color="#0F766E" />
          <Text style={styles.badgeText}>Reset password</Text>
        </View>

        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>
          Enter your email and we’ll send instructions
        </Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
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
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}
        {!!message && <Text style={styles.success}>{message}</Text>}

        {/* Submit */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? "Sending..." : "Send instructions"}
          </Text>
        </TouchableOpacity>

        {/* Back to login */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          style={styles.switchBtn}
        >
          <Text style={styles.switchText}>
            Remembered it?{" "}
            <Text style={styles.switchStrong}>Back to login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordPage;

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

  error: {
    color: "#EF4444",
    fontWeight: "700",
    marginBottom: 10,
    marginTop: -2,
  },

  success: {
    color: "#0F766E",
    fontWeight: "800",
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
  primaryBtn: {
    backgroundColor: "#0F766E",
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    // ⭐ add this
    elevation: 3, // Android
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
});
