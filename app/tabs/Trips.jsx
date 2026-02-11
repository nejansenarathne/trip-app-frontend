import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TripCard from "../../components/TripCard";
import { useDestinationContext } from "../../contexts/DestinationContext";
import { useTripContext } from "../../contexts/TripContext";

const Trips = () => {
  const { trips, fetchTrips } = useTripContext();
  const { destinations } = useDestinationContext();

  useEffect(() => {
    fetchTrips();
  }, []);

  const getCover = (trip) => {
    // try first added place image
    for (const day of trip.days || []) {
      const firstStop = day.stops?.[0];
      if (firstStop) {
        const place = destinations.find((d) => d.id === firstStop.placeId);
        if (place?.imageUrl) return place.imageUrl;
      }
    }
    // fallback
    return (
      destinations?.[0]?.imageUrl || "https://picsum.photos/900/600?random=99"
    );
  };

  const openTrip = (tripId) => {
    router.push({
      pathname: "/dashboard/TripDetailsPage",
      params: { tripId: String(tripId) },
    });
  };

  const goCreate = () => router.push("/dashboard/CreateTripPage");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Trips</Text>
          <Text style={styles.subtitle}>
            {trips.length} trip{trips.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* List */}
      {trips.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="briefcase-outline" size={70} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No trips yet</Text>
          <Text style={styles.emptyText}>
            Tap the + button to create your first trip
          </Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 14 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              coverImage={getCover(item)}
              onPress={() => openTrip(item.id)}
            />
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={goCreate}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Trips;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },

  title: { fontSize: 26, fontWeight: "900", color: "#0F172A" },
  subtitle: { marginTop: 4, fontSize: 13, fontWeight: "700", color: "#64748B" },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  emptyText: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
    lineHeight: 20,
  },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: "#0F766E",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
