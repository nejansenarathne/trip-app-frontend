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

  // Parsing data from DetailsPage params
  const userLocation = params.userLocation
    ? JSON.parse(params.userLocation)
    : null;
  const destination = params.destinationLocation
    ? JSON.parse(params.destinationLocation)
    : null;
  const userLocationPermission = params.userLocationPermission === "true";

  // Destination Coords
  const destLat = Number(destination?.location?.latitude);
  const destLng = Number(destination?.location?.longitude);

  // User Coords
  const userLat = Number(userLocation?.latitude);
  const userLng = Number(userLocation?.longitude);

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

    // Proper Google Maps universal link
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
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
          latitude: destLat || 0,
          longitude: destLng || 0,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker coordinate={{ latitude: destLat, longitude: destLng }} />
      </MapView>

      <BackButton light />

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

// [Styles remain identical to your provided styles]

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
