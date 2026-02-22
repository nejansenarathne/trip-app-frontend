// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useEffect } from "react";
// import {
//   Image,
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import WLlogo from "../assets/images/WLlogo.png";
// import { useUserContext } from "../contexts/UserContext";

// export default function Index() {
//   const { loading, accessToken } = useUserContext();

//   useEffect(() => {
//     if (loading) return;

//     if (accessToken) {
//       router.replace("/tabs/Destinations");
//     }
//   }, [accessToken, loading]);

//   return (
//     <View style={styles.container}>
//       {/* HERO */}
//       <ImageBackground
//         // ✅ calmer photo (less busy)
//         source={{ uri: "https://picsum.photos/900/1400?blur=2&random=3456" }}
//         style={styles.hero}
//         resizeMode="cover"
//       >
//         {/* light overlay to keep text readable (NOT behind logo) */}
//         <View style={styles.overlay} />

//         {/* Top brand name */}
//         <View style={styles.topBar}>
//           <Text style={styles.brand}>Loopout</Text>
//         </View>

//         {/* Center text */}
//         <View style={styles.heroText}>
//           <Text style={styles.slogan}>Escape the loop</Text>
//           <Text style={styles.sub}>
//             Discover new places. Save favorites. Build your trip your way.
//           </Text>
//         </View>
//       </ImageBackground>

//       {/* BOTTOM */}
//       <View style={styles.bottom}>
//         <TouchableOpacity
//           activeOpacity={0.9}
//           style={styles.primaryBtn}
//           onPress={() => router.push("/tabs/Destinations")}
//         >
//           <Text style={styles.primaryText}>Start exploring</Text>
//           <Ionicons name="arrow-forward" size={18} color="#fff" />
//         </TouchableOpacity>

//         {/* Auth */}
//         <View style={styles.authRow}>
//           <TouchableOpacity onPress={() => router.replace("/(auth)/loginPage")}>
//             <Text style={styles.link}>Login</Text>
//           </TouchableOpacity>

//           <Text style={styles.dot}>•</Text>

//           <TouchableOpacity
//             onPress={() => router.replace("/(auth)/registerPage")}
//           >
//             <Text style={styles.link}>Create account</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Logo moved here (clean, no box, no glow) */}
//         <Image source={WLlogo} style={styles.logo} resizeMode="contain" />

//         <Text style={styles.footer}>Minimal • Clean • Travel</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFFFFF" },

//   hero: {
//     flex: 1.25,
//     justifyContent: "space-between",
//     paddingHorizontal: 18,
//     paddingTop: 64,
//     paddingBottom: 28,
//   },

//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.28)",
//   },

//   topBar: {
//     alignItems: "center",
//   },

//   brand: {
//     fontSize: 16,
//     fontWeight: "900",
//     color: "#FFFFFF",
//     letterSpacing: 2,
//     textTransform: "uppercase",
//   },

//   heroText: {
//     alignItems: "center",
//     paddingHorizontal: 10,
//   },

//   slogan: {
//     fontSize: 30,
//     fontWeight: "900",
//     color: "#FFFFFF",
//     letterSpacing: 0.6,
//   },

//   sub: {
//     marginTop: 10,
//     fontSize: 14,
//     fontWeight: "600",
//     color: "rgba(255,255,255,0.9)",
//     textAlign: "center",
//     lineHeight: 22,
//     maxWidth: 340,
//   },

//   bottom: {
//     flex: 0.85,
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 26,
//     borderTopRightRadius: 26,
//     paddingHorizontal: 20,
//     paddingTop: 18,
//     marginTop: -22,
//     alignItems: "center",
//   },

//   logo: {
//     width: 260,
//     height: 110,
//     marginBottom: 14,
//   },

//   primaryBtn: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: "#0F766E",
//     paddingVertical: 15,
//     borderRadius: 18,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 10,
//     marginTop: 6,
//   },

//   primaryText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "900",
//   },

//   authRow: {
//     marginTop: 16,
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 12,
//   },

//   link: {
//     color: "#0F766E",
//     fontWeight: "900",
//     fontSize: 14,
//   },

//   dot: {
//     color: "#CBD5E1",
//     fontSize: 18,
//   },

//   footer: {
//     marginTop: 14,
//     fontSize: 12,
//     color: "#94A3B8",
//     fontWeight: "700",
//     letterSpacing: 1,
//   },
// });


import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated, // Added for the blinking effect
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useUserContext } from "../contexts/UserContext";

// import darkLogoNBG from "../assets/images/animated_deer_gif.gif";
import darkLogoNBG from "../assets/images/light_logo_nobg.png";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Stop scrolling,\nstart travelling.",
    description: "We find the places others miss.",
    cta: "Swipe to begin",
  },
  {
    id: "2",
    title: "Escape\nthe loop.",
    description: "Your journey, redefined.",
    showAuth: true,
  },
];

export default function WelcomeScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { loading, accessToken } = useUserContext();
  
  // Animation value for blinking
  const blinkAnim = useRef(new Animated.Value(0.3)).current;

  /* ---------------- BLINKING LOGO ANIMATION ---------------- */
  useEffect(() => {
    if (loading || accessToken) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loading, accessToken]);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (!loading && accessToken) {
      router.replace("/tabs/Destinations");
    }
  }, [accessToken, loading]);

  /* ---------------- CUSTOM LOGO LOADER ---------------- */
  if (loading || accessToken) {
    return (
      <View style={styles.loaderContainer}>
        <Animated.Image 
          source={darkLogoNBG} 
          style={[styles.loadingLogo]} 
          resizeMode="contain" 
        />
      </View>
    );
  }

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtext}>{item.description}</Text>
      </View>

      {item.showAuth ? (
        <View style={styles.authContainer}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={() => router.replace("/(auth)/registerPage")}
          >
            <Text style={styles.btnTextLight}>JOIN MyTrips</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryBtn}
            activeOpacity={0.7}
            onPress={() => router.replace("/(auth)/loginPage")}
          >
            <Text style={styles.btnTextDark}>Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>{item.cta} →</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.fixedHeader}>
        <Image source={darkLogoNBG} style={styles.logo} resizeMode="contain" />
      </SafeAreaView>

      <FlatList
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const offset = e.nativeEvent.contentOffset.x;
          setActiveSlide(Math.round(offset / width));
        }}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.indicatorContainer}>
        {SLIDES.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.line, 
              { backgroundColor: activeSlide === i ? "#064E3B" : "#E5E7EB" }
            ]} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  
  /* LOADING SCREEN STYLES */
  loaderContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    width: 200,
    height: 200,
    tintColor: "#064E3B",
  },

  fixedHeader: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 120, 
    height: 120,
    tintColor: "#064E3B", 
  },
  slide: {
    width,
    paddingHorizontal: 40,
    justifyContent: "center",
  },
  textWrapper: {
    marginTop: 100,
  },
  title: {
    fontSize: 46,
    fontWeight: "900",
    color: "#064E3B", 
    lineHeight: 52,
    letterSpacing: -1.5,
  },
  subtext: {
    fontSize: 19,
    color: "#374151", 
    marginTop: 20,
    lineHeight: 28,
    fontWeight: "500",
  },
  authContainer: {
    marginTop: 60,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: "#064E3B", 
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    paddingVertical: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#064E3B",
    alignItems: "center",
  },
  btnTextLight: { 
    color: "#FFFFFF", 
    fontWeight: "800", 
    fontSize: 16,
    letterSpacing: 1.2,
  },
  btnTextDark: { 
    color: "#064E3B", 
    fontWeight: "800", 
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  hintContainer: {
    marginTop: 40,
  },
  hintText: {
    color: "#064E3B",
    fontWeight: "800",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 60,
    left: 40,
    flexDirection: "row",
    gap: 12,
  },
  line: {
    height: 4,
    width: 45,
    borderRadius: 2,
  },
});