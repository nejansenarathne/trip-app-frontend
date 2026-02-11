// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams } from "expo-router";
// import { useRef } from "react";
// import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// const MapPage = () => {
//   const params = useLocalSearchParams();

//   // Safely parse params (expo-router params can be string | string[])
//   const rawUserLocation = Array.isArray(params.userLocation)
//     ? params.userLocation[0]
//     : params.userLocation;

//   const rawDestination = Array.isArray(params.destinationLocation)
//     ? params.destinationLocation[0]
//     : params.destinationLocation;

//   const userLocation = rawUserLocation ? JSON.parse(rawUserLocation) : null;
//   const destination = rawDestination ? JSON.parse(rawDestination) : null;

//   const userLocationPermission =
//     (Array.isArray(params.userLocationPermission)
//       ? params.userLocationPermission[0]
//       : params.userLocationPermission) === "true";

//   // Normalize coordinates (handles: destination.location.{lat,lng} OR destination.{lat,lng})
//   const destLat = Number(destination?.location?.latitude ?? destination?.latitude);
//   const destLng = Number(destination?.location?.longitude ?? destination?.longitude);

//   const userLat = Number(userLocation?.latitude ?? userLocation?.coords?.latitude);
//   const userLng = Number(userLocation?.longitude ?? userLocation?.coords?.longitude);

//   const mapRef = useRef(null);

// //   function for coming back to the marked point in the map
//   const focusDestination = () => {
//     if (!destLat || !destLng) {
//       Alert.alert("Destination missing", "Destination coordinates not found.");
//       return;
//     }

//     mapRef.current?.animateToRegion(
//       {
//         latitude: destLat,
//         longitude: destLng,
//         latitudeDelta: 0.02,
//         longitudeDelta: 0.02,
//       },
//       700
//     );
//   };

// //   function for navigating using google maps(open google maps)
//   const navigateGoogleMaps = () => {
//     if (!userLocationPermission || !userLat || !userLng) {
//       Alert.alert(
//         "Location not available",
//         "Please allow location permission to start navigation."
//       );
//       return;
//     }

//     if (!destLat || !destLng) {
//       Alert.alert("Destination missing", "Destination coordinates not found.");
//       return;
//     }

//     const origin = `${userLat},${userLng}`;
//     const dest = `${destLat},${destLng}`;

//     // Most reliable on both Android + iOS:
//     const webUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
//       origin
//     )}&destination=${encodeURIComponent(dest)}&travelmode=driving`;

//     // Android can use native navigation intent if available:
//     const androidNavUrl = `google.navigation:q=${encodeURIComponent(dest)}&mode=d`;

//     Alert.alert(
//       "Open Google Maps?",
//       "Start navigation to this destination",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Open",
//           onPress: async () => {
//             try {
//               if (Platform.OS === "android") {
//                 const canOpen = await Linking.canOpenURL(androidNavUrl);
//                 if (canOpen) {
//                   await Linking.openURL(androidNavUrl);
//                   return;
//                 }
//               }
//               await Linking.openURL(webUrl);
//             } catch (e) {
//               Alert.alert("Error", "Could not open Google Maps.");
//             }
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         provider={PROVIDER_GOOGLE}
//         showsUserLocation={userLocationPermission}
//         showsMyLocationButton={userLocationPermission} // Android only
//         initialRegion={{
//           latitude: destLat || 6.9271, // fallback Colombo
//           longitude: destLng || 79.8612,
//           latitudeDelta: 0.02,
//           longitudeDelta: 0.02,
//         }}
//       >
//         {!!destLat && !!destLng && (
//         <Marker
//             coordinate={{ latitude: destLat, longitude: destLng }}    // lift it up a bit so it doesn't cut
//         />)}
//       </MapView>

//       {/* Floating buttons on top of the map */}
//       <View style={styles.fabWrap}>
//         <TouchableOpacity style={styles.fab} onPress={focusDestination}>
//           <Text style={styles.fabText}>Focus <Ionicons name="location" size={16} color="white" /> </Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.fab} onPress={navigateGoogleMaps}>
//           <Text style={styles.fabText}>Navigate <Ionicons name="navigate" size={16} color="white" /> </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

// };

// export default MapPage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, // ✅ makes the map visible
//   },
//   map: {
//     flex: 1, // ✅ map fills screen
//   },
//   fabWrap: {
//     position: "absolute",
//     right: 12,
//     bottom: 12,
//     gap: 10,
//   },
//   fab: {
//     backgroundColor: "black",
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 999,
//   },
//   fabText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   markerWrap: {
//   alignItems: "center",
// },

// popup: {
//   backgroundColor: "white",
//   paddingHorizontal: 10,
//   paddingVertical: 5,
//   borderRadius: 12,
//   marginBottom: 6,
//   elevation: 4,
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.25,
//   shadowRadius: 3,
// },

// popupText: {
//   fontSize: 12,
//   fontWeight: "600",
//   color: "#000",
// },

// pin: {
//   width: 14,
//   height: 14,
//   backgroundColor: "red",
//   borderRadius: 7,
//   borderWidth: 2,
//   borderColor: "white",
// },

// });

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import BackButton from "../../components/BackButton";

const MapPage = () => {
  const params = useLocalSearchParams();

  const rawUserLocation = Array.isArray(params.userLocation)
    ? params.userLocation[0]
    : params.userLocation;

  const rawDestination = Array.isArray(params.destinationLocation)
    ? params.destinationLocation[0]
    : params.destinationLocation;

  const userLocation = rawUserLocation ? JSON.parse(rawUserLocation) : null;
  const destination = rawDestination ? JSON.parse(rawDestination) : null;

  const userLocationPermission =
    (Array.isArray(params.userLocationPermission)
      ? params.userLocationPermission[0]
      : params.userLocationPermission) === "true";

  const destLat = Number(
    destination?.location?.latitude ?? destination?.latitude,
  );
  const destLng = Number(
    destination?.location?.longitude ?? destination?.longitude,
  );

  const userLat = Number(
    userLocation?.latitude ?? userLocation?.coords?.latitude,
  );
  const userLng = Number(
    userLocation?.longitude ?? userLocation?.coords?.longitude,
  );

  const mapRef = useRef(null);

  const focusDestination = () => {
    if (!destLat || !destLng) return;

    mapRef.current?.animateToRegion(
      {
        latitude: destLat,
        longitude: destLng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      700,
    );
  };

  const navigateGoogleMaps = () => {
    if (!userLocationPermission || !userLat || !userLng) {
      Alert.alert(
        "Location not available",
        "Please allow location permission.",
      );
      return;
    }

    const origin = `${userLat},${userLng}`;
    const dest = `${destLat},${destLng}`;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;

    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={userLocationPermission}
        initialRegion={{
          latitude: destLat || 6.9271,
          longitude: destLng || 79.8612,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {!!destLat && !!destLng && (
          <Marker coordinate={{ latitude: destLat, longitude: destLng }} />
        )}
      </MapView>

      {/* BACK BUTTON */}
      <BackButton light />

      {/* FLOATING CONTROL CARD */}
      <View style={styles.controlCard}>
        <Text style={styles.placeName}>
          {destination?.name ?? "Destination"}
        </Text>

        <Text style={styles.subText}>View location and directions</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={focusDestination}
          >
            <Ionicons name="locate-outline" size={18} color="#0F766E" />
            <Text style={styles.secondaryText}>Focus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={navigateGoogleMaps}
          >
            <Ionicons name="navigate-outline" size={18} color="white" />
            <Text style={styles.primaryText}>Navigate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 999,
  },

  controlCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  placeName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },

  subText: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },

  buttonRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },

  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#0F766E",
    borderRadius: 14,
    paddingVertical: 12,
  },

  secondaryText: {
    color: "#0F766E",
    fontWeight: "800",
  },

  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0F766E",
    borderRadius: 14,
    paddingVertical: 12,
  },

  primaryText: {
    color: "white",
    fontWeight: "800",
  },
});
