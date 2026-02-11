import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import BackButton from "../../components/BackButton";

const { width } = Dimensions.get("window");

const DetailsPage = () => {
  const params = useLocalSearchParams();
  const destination = JSON.parse(params.destination);

  // ✅ WORKING IMAGES
  const images = [
    { id: "1", uri: "https://picsum.photos/900/600?random=1" },
    { id: "2", uri: "https://picsum.photos/900/600?random=2" },
    { id: "3", uri: "https://picsum.photos/900/600?random=3" },
    { id: "4", uri: "https://picsum.photos/900/600?random=4" },
    { id: "5", uri: "https://picsum.photos/900/600?random=5" },
    { id: "6", uri: "https://picsum.photos/900/600?random=6" },
    { id: "7", uri: "https://picsum.photos/900/600?random=7" },
    { id: "8", uri: "https://picsum.photos/900/600?random=8" },
    { id: "9", uri: "https://picsum.photos/900/600?random=9" },
    { id: "10", uri: "https://picsum.photos/900/600?random=10" },
  ];

  const routeToGallery = () => {
    router.push({
      pathname: "/dashboard/GalleryPage",
      params: { images: JSON.stringify(images) },
    });
  };

  const [sheet, setSheet] = useState(null); // weather | todo
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setPermissionGranted(true);
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    })();
  }, []);

  const focusOnDestination = () => {
    mapRef.current?.animateToRegion(
      {
        latitude: destination.location.latitude,
        longitude: destination.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      900,
    );
  };

  const openInMap = () => {
    router.push({
      pathname: "/dashboard/MapPage",
      params: {
        userLocation: JSON.stringify(userLocation),
        destinationLocation: JSON.stringify(destination),
        userLocationPermission: permissionGranted,
      },
    });
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <BackButton light />
        {/* IMAGE SLIDER */}
        <View>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Image source={{ uri: item.uri }} style={styles.image} />
            )}
          />

          <TouchableOpacity style={styles.galleryBtn} onPress={routeToGallery}>
            <Ionicons name="images-outline" size={18} color="#fff" />
            <Text style={styles.galleryText}>View gallery</Text>
          </TouchableOpacity>
        </View>

        {/* DETAILS */}
        <View style={styles.content}>
          <Text style={styles.title}>{destination.name}</Text>

          <Text style={styles.desc}>{destination.longDescription}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setSheet("weather")}
            >
              <Ionicons name="partly-sunny-outline" size={22} color="#0F766E" />
              <Text style={styles.actionText}>Weather</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setSheet("todo")}
            >
              <Ionicons name="walk-outline" size={22} color="#0F766E" />
              <Text style={styles.actionText}>Things to do</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MAP */}
        <View style={styles.mapWrap}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            showsUserLocation={permissionGranted}
            initialRegion={{
              latitude: destination.location.latitude,
              longitude: destination.location.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker
              coordinate={{
                latitude: destination.location.latitude,
                longitude: destination.location.longitude,
              }}
            />
          </MapView>

          <TouchableOpacity
            style={styles.focusBtn}
            onPress={focusOnDestination}
          >
            <Ionicons name="locate-outline" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.openMapBtn} onPress={openInMap}>
            <Ionicons name="map-outline" size={18} color="#fff" />
            <Text style={styles.openMapText}>Open in map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM SHEET */}
      <Modal visible={!!sheet} transparent animationType="slide">
        <View style={styles.overlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setSheet(null)}
          />
        </View>

        <View style={styles.sheet}>
          <View style={styles.drag} />

          {sheet === "weather" && (
            <>
              <Text style={styles.sheetTitle}>Weather overview</Text>

              <View style={styles.weatherBig}>
                <Text style={styles.temp}>27°C</Text>
                <Text style={styles.weatherNote}>
                  Warm and sunny throughout the day
                </Text>
              </View>

              <Text style={styles.sectionText}>
                Expect clear skies during mornings and slightly cooler evenings.
                Light winds may occur near elevated areas.
              </Text>

              <View style={styles.weatherRow}>
                <Text>Humidity</Text>
                <Text>65%</Text>
              </View>

              <View style={styles.weatherRow}>
                <Text>Wind speed</Text>
                <Text>12 km/h</Text>
              </View>

              <View style={styles.weatherRow}>
                <Text>Rain chance</Text>
                <Text>10%</Text>
              </View>

              <View style={styles.tipBox}>
                <Text style={styles.tipTitle}>Travel tip</Text>
                <Text style={styles.tipText}>
                  Carry a light jacket for evening hours and start hikes early
                  morning to avoid midday heat.
                </Text>
              </View>
            </>
          )}

          {sheet === "todo" && (
            <>
              <Text style={styles.sheetTitle}>Things to do</Text>

              <Text style={styles.sectionText}>
                This area offers a mix of nature, adventure, and relaxing
                experiences suitable for all travelers.
              </Text>

              <View style={styles.todoItem}>
                <Text style={styles.todoTitle}>🥾 Hiking trails</Text>
                <Text style={styles.todoText}>
                  Explore scenic trails with panoramic mountain views and fresh
                  air.
                </Text>
              </View>

              <View style={styles.todoItem}>
                <Text style={styles.todoTitle}>📸 Photography</Text>
                <Text style={styles.todoText}>
                  Ideal for sunrise, fog landscapes, and wide-angle shots.
                </Text>
              </View>

              <View style={styles.todoItem}>
                <Text style={styles.todoTitle}>🌄 Viewpoints</Text>
                <Text style={styles.todoText}>
                  Visit famous viewpoints located within short travel distance.
                </Text>
              </View>

              <View style={styles.todoItem}>
                <Text style={styles.todoTitle}>🍵 Cafés & local food</Text>
                <Text style={styles.todoText}>
                  Enjoy local tea, snacks, and peaceful hillside cafés.
                </Text>
              </View>
            </>
          )}
        </View>
      </Modal>
    </>
  );
};

export default DetailsPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  image: {
    width: width,
    height: 300,
  },

  galleryBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  galleryText: { color: "#fff", fontWeight: "700" },

  content: {
    padding: 18,
    gap: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
  },

  desc: {
    fontSize: 14.5,
    color: "#475569",
    lineHeight: 22,
    fontWeight: "600",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
  },

  actionCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  actionText: { marginTop: 6, fontWeight: "700" },

  mapWrap: {
    height: 280,
    margin: 18,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  focusBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#0F766E",
    padding: 10,
    borderRadius: 999,
  },

  openMapBtn: {
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
    backgroundColor: "#0F766E",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  openMapText: { color: "#fff", fontWeight: "700" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    height: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
  },

  drag: {
    width: 40,
    height: 4,
    backgroundColor: "#CBD5E1",
    borderRadius: 999,
    alignSelf: "center",
    marginBottom: 14,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },

  weatherBig: {
    alignItems: "center",
    marginBottom: 14,
  },

  temp: {
    fontSize: 42,
    fontWeight: "900",
  },

  weatherNote: {
    color: "#64748B",
  },

  sectionText: {
    color: "#475569",
    lineHeight: 20,
    marginBottom: 12,
  },

  weatherRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  tipBox: {
    marginTop: 16,
    backgroundColor: "#ECFDF5",
    padding: 14,
    borderRadius: 14,
  },

  tipTitle: {
    fontWeight: "800",
    marginBottom: 4,
  },

  tipText: {
    color: "#065F46",
  },

  todoItem: {
    marginBottom: 16,
  },

  todoTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },

  todoText: {
    color: "#475569",
    lineHeight: 20,
  },
});
