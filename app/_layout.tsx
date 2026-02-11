import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  Platform,
  StatusBar as RNStatusBar,
  useColorScheme,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DestinationContext from "../contexts/DestinationContext";
import TripContext from "../contexts/TripContext";
import UserContext from "../contexts/UserContext";

export default function RootLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  useEffect(() => {
    // ✅ Force it visible + correct icon color (especially on Android)
    RNStatusBar.setHidden(false);
    RNStatusBar.setBarStyle(isDark ? "light-content" : "dark-content");

    if (Platform.OS === "android") {
      RNStatusBar.setTranslucent(false);
      RNStatusBar.setBackgroundColor(isDark ? "#000000" : "#ffffff");
    }
  }, [isDark]);

  return (
    <SafeAreaProvider>
      {/* expo-status-bar controls iOS nicely + keeps things consistent */}
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ✅ Give SafeArea a background so the status bar area isn't white-on-white */}
      <SafeAreaView
        style={{ flex: 1, backgroundColor: isDark ? "#000" : "#fff" }}
      >
        <UserContext>
          <TripContext>
            <DestinationContext>
              <Stack screenOptions={{ headerShown: false }} />
            </DestinationContext>
          </TripContext>
        </UserContext>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
