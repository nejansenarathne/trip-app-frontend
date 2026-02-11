import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WLlogo from "../assets/images/WLlogo.png";
import { useUserContext } from "../contexts/UserContext";

export default function Index() {
  const { loading, accessToken } = useUserContext();

  useEffect(() => {
    if (loading) return;

    if (accessToken) {
      router.replace("/tabs/Destinations");
    }
  }, [accessToken, loading]);

  return (
    <View style={styles.container}>
      {/* HERO */}
      <ImageBackground
        // ✅ calmer photo (less busy)
        source={{ uri: "https://picsum.photos/900/1400?blur=2&random=3456" }}
        style={styles.hero}
        resizeMode="cover"
      >
        {/* light overlay to keep text readable (NOT behind logo) */}
        <View style={styles.overlay} />

        {/* Top brand name */}
        <View style={styles.topBar}>
          <Text style={styles.brand}>Loopout</Text>
        </View>

        {/* Center text */}
        <View style={styles.heroText}>
          <Text style={styles.slogan}>Escape the loop</Text>
          <Text style={styles.sub}>
            Discover new places. Save favorites. Build your trip your way.
          </Text>
        </View>
      </ImageBackground>

      {/* BOTTOM */}
      <View style={styles.bottom}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.primaryBtn}
          onPress={() => router.push("/tabs/Destinations")}
        >
          <Text style={styles.primaryText}>Start exploring</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Auth */}
        <View style={styles.authRow}>
          <TouchableOpacity onPress={() => router.replace("/(auth)/loginPage")}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.dot}>•</Text>

          <TouchableOpacity
            onPress={() => router.replace("/(auth)/registerPage")}
          >
            <Text style={styles.link}>Create account</Text>
          </TouchableOpacity>
        </View>

        {/* Logo moved here (clean, no box, no glow) */}
        <Image source={WLlogo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.footer}>Minimal • Clean • Travel</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  hero: {
    flex: 1.25,
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 64,
    paddingBottom: 28,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  topBar: {
    alignItems: "center",
  },

  brand: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  heroText: {
    alignItems: "center",
    paddingHorizontal: 10,
  },

  slogan: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },

  sub: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 340,
  },

  bottom: {
    flex: 0.85,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 18,
    marginTop: -22,
    alignItems: "center",
  },

  logo: {
    width: 260,
    height: 110,
    marginBottom: 14,
  },

  primaryBtn: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#0F766E",
    paddingVertical: 15,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  authRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },

  link: {
    color: "#0F766E",
    fontWeight: "900",
    fontSize: 14,
  },

  dot: {
    color: "#CBD5E1",
    fontSize: 18,
  },

  footer: {
    marginTop: 14,
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "700",
    letterSpacing: 1,
  },
});
