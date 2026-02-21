import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import BackButton from "../../components/BackButton";
import { useDestinationContext } from "../../contexts/DestinationContext";

const { width, height } = Dimensions.get("window");

const DetailsPage = () => {
  const { id } = useLocalSearchParams();
  const { destinations } = useDestinationContext();
  const destination = destinations.find((d) => String(d.id) === String(id));

  // --- STATE ---
  const [sheet, setSheet] = useState(null); // 'weather' | 'todo'
  const [selectedPopup, setSelectedPopup] = useState(null); // { images: [], index: 0 }
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // --- REFS & ANIMATION ---
  const mapRef = useRef(null);
  const panY = useRef(new Animated.Value(height)).current;

  // --- BOTTOM SHEET DRAG LOGIC ---
  useEffect(() => {
    if (sheet) {
      Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
    }
  }, [sheet]);

  const closeSheet = () => {
    Animated.timing(panY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSheet(null));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) panY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 150 || gesture.vy > 0.5) closeSheet();
        else
          Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
      },
    }),
  ).current;

  // --- LOCATION LOGIC ---
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

  if (!destination)
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );

  const images = destination.image_array || [];

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <BackButton light />

        {/* HERO IMAGE SLIDER */}
        <View>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item.url }} style={styles.heroImage} />
            )}
          />
          <TouchableOpacity
            style={styles.galleryBtn}
            onPress={() =>
              router.push({
                pathname: "/dashboard/GalleryPage",
                params: { images: JSON.stringify(images) },
              })
            }
          >
            <Ionicons name="images-outline" size={18} color="#fff" />
            <Text style={styles.galleryText}>View gallery</Text>
          </TouchableOpacity>
        </View>

        {/* DETAILS SECTION */}
        <View style={styles.content}>
          <Text style={styles.title}>{destination.name}</Text>
          <Text style={styles.desc}>
            {destination.long_description || destination.longDescription}
          </Text>

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

        {/* MAP SECTION */}
        <View style={styles.mapWrap}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
            initialRegion={{
              ...destination.location,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker coordinate={destination.location} />
          </MapView>
          <TouchableOpacity
            style={styles.focusBtn}
            onPress={() =>
              mapRef.current?.animateToRegion(
                {
                  ...destination.location,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                900,
              )
            }
          >
            <Ionicons name="locate" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.openMapBtnPremium}
            onPress={() =>
              router.push({
                pathname: "/dashboard/MapPage",
                params: {
                  userLocation: JSON.stringify(userLocation),
                  destinationLocation: JSON.stringify(destination),
                  userLocationPermission: String(permissionGranted),
                },
              })
            }
          >
            <Ionicons name="map-outline" size={20} color="#fff" />
            <Text style={styles.openMapText}>View on Map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM SHEET MODAL */}
      {/* BOTTOM SHEET MODAL */}
      <Modal visible={!!sheet} transparent animationType="none">
        <View style={styles.overlay}>
          {/* Tapping this area closes the sheet */}
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeSheet}
          />

          <Animated.View
            style={[styles.sheet, { transform: [{ translateY: panY }] }]}
            {...panResponder.panHandlers}
          >
            {/* The handle also acts as a touch target for dragging */}
            <View style={styles.dragHandle} />

            {/* Use a ScrollView inside the Animated View for long content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 60 }}
              // This prop allows the ScrollView to work nicely with PanResponder
              bounces={true}
            >
              {sheet === "weather" && (
                <View style={styles.weatherContainer}>
                  <Text style={styles.sheetTitle}>Weather overview</Text>
                  <Ionicons
                    name="sunny"
                    size={80}
                    color="#F59E0B"
                    style={{ marginVertical: 20 }}
                  />
                  <Text style={styles.temp}>27°C</Text>
                  <Text style={styles.weatherNote}>Warm and sunny</Text>

                  {/* Added more content to test scrolling */}
                  <View style={styles.weatherDetailsRow}>
                    <Text style={styles.weatherDetailText}>Humidity: 65%</Text>
                    <Text style={styles.weatherDetailText}>Wind: 12km/h</Text>
                  </View>
                </View>
              )}

              {sheet === "todo" && (
                <View onStartShouldSetResponder={() => true}>
                  <Text style={styles.sheetTitle}>Things to do</Text>
                  {destination.things_to_do?.map((activity) => (
                    <View key={activity.id} style={styles.todoItem}>
                      <Text style={styles.todoItemTitle}>
                        ✨ {activity.topic}
                      </Text>
                      <Text style={styles.todoItemDesc}>
                        {activity.description}
                      </Text>

                      <FlatList
                        data={activity.image_array}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(img) => img.id.toString()}
                        contentContainerStyle={{ gap: 10, marginTop: 12 }}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={() =>
                              setSelectedPopup({
                                images: activity.image_array,
                                index,
                              })
                            }
                          >
                            <Image
                              source={{ uri: item.url }}
                              style={styles.todoThumb}
                            />
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* FULL SCREEN IMAGE POPUP */}
      <Modal visible={!!selectedPopup} transparent animationType="fade">
        <View style={styles.popupContainer}>
          <TouchableOpacity
            style={styles.closePopup}
            onPress={() => setSelectedPopup(null)}
          >
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>

          <FlatList
            data={selectedPopup?.images}
            horizontal
            pagingEnabled
            initialScrollIndex={selectedPopup?.index}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.popupImageWrapper}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  heroImage: { width: width, height: 350 },
  galleryBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  galleryText: { color: "#fff", fontWeight: "700" },
  content: { padding: 18, gap: 10 },
  title: { fontSize: 26, fontWeight: "900", color: "#0F172A" },
  desc: { fontSize: 15, color: "#475569", lineHeight: 22, fontWeight: "500" },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 10 },
  actionCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  actionText: { marginTop: 6, fontWeight: "700", color: "#0F172A" },
  mapWrap: {
    height: 250,
    margin: 18,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  focusBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#0F766E",
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 23,
    elevation: 5,
    zIndex: 10,
  },
  openMapBtnPremium: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#0F766E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    elevation: 6,
  },
  openMapText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: height * 0.75,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 20,
  },
  todoItem: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 20,
  },
  todoItemTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  todoItemDesc: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  todoThumb: {
    width: 130,
    height: 170,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  weatherContainer: { alignItems: "center", paddingTop: 20 },
  temp: { fontSize: 64, fontWeight: "900", color: "#0F172A" },
  weatherNote: { fontSize: 18, color: "#64748B", fontWeight: "600" },
  popupContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)" },
  closePopup: { position: "absolute", top: 50, right: 20, zIndex: 100 },
  popupImageWrapper: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: width * 0.95, height: height * 0.7 },
});

export default DetailsPage;
