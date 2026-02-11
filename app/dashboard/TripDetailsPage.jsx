import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FavoriteCard from "../../components/FavoriteCard";
import { useDestinationContext } from "../../contexts/DestinationContext";
import { useTripContext } from "../../contexts/TripContext";

const formatRange = (startISO, endISO) => {
  if (!startISO || !endISO) return "Dates not set";

  const s = new Date(startISO + "T00:00:00");
  const e = new Date(endISO + "T00:00:00");

  const startText = s.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endText = e.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${startText} – ${endText}`;
};

const TripDetailsPage = () => {
  const { tripId } = useLocalSearchParams();
  const { getTripById, deleteTrip } = useTripContext();
  const { destinations } = useDestinationContext();

  const trip = getTripById(String(tripId));
  console.log("TRIPS FROM:", trip);

  if (!trip) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ fontWeight: "900", fontSize: 16 }}>Trip not found</Text>
        <Pressable style={{ marginTop: 12 }} onPress={() => router.back()}>
          <Text style={{ color: "#0F766E", fontWeight: "900" }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  // cover image = first stop image or fallback
  const coverImage = (() => {
    for (const day of trip.days || []) {
      const firstStop = day.stops?.[0];
      if (firstStop) {
        const place = destinations.find((d) => d.id === firstStop.placeId);
        if (place?.imageUrl) return place.imageUrl;
      }
    }
    return (
      destinations?.[0]?.imageUrl || "https://picsum.photos/900/600?random=101"
    );
  })();

  const handleDelete = () => {
    deleteTrip(trip.id);
    router.back();
  };

  const getPlace = (placeId) => destinations.find((d) => d.id === placeId);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cover */}
      <View style={styles.coverWrap}>
        <Image source={{ uri: coverImage }} style={styles.cover} />

        {/* Back (local to this page) */}
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <View style={styles.coverOverlay} />
        <View style={styles.coverTextWrap}>
          <Text style={styles.tripTitle}>{trip.name}</Text>
          <Text style={styles.tripSub}>
            {formatRange(trip.startDate, trip.endDate)}
          </Text>
        </View>
      </View>

      {/* Days */}
      <View style={{ padding: 16, paddingBottom: 30 }}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Trip Plan</Text>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            {/* Simple delete for now (we add edit next) */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/dashboard/EditTripPage",
                  params: { tripId: String(trip.id) },
                })
              }
              style={styles.editBtn}
            >
              <Ionicons name="create-outline" size={16} color="#0F766E" />
              <Text style={styles.editText}>Edit</Text>
            </Pressable>

            <Pressable onPress={handleDelete} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={16} color="#991B1B" />
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        </View>

        {(trip.days || []).map((day) => {
          const dateText = new Date(day.date + "T00:00:00").toLocaleDateString(
            "en-US",
            {
              weekday: "long",
              month: "short",
              day: "numeric",
            },
          );

          return (
            <View key={day.date} style={styles.dayBlock}>
              <Text style={styles.dayTitle}>Day {day.dayIndex}</Text>
              <Text style={styles.dayDate}>{dateText}</Text>

              {(day.stops || []).length === 0 ? (
                <Text style={styles.emptyDay}>No places added</Text>
              ) : (
                <View style={{ gap: 12, marginTop: 10 }}>
                  {day.stops.map((s) => {
                    const place = getPlace(s.placeId);
                    if (!place) return null;

                    // reuse your FavoriteCard style (already nice)
                    return <FavoriteCard key={s.id} destination={place} />;
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default TripDetailsPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  coverWrap: { height: 260 },
  cover: { width: "100%", height: "100%" },

  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  coverTextWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },

  tripTitle: { fontSize: 26, fontWeight: "900", color: "#fff" },
  tripSub: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
  },

  backBtn: {
    position: "absolute",
    top: 52,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#0F172A" },

  deleteBtn: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  deleteText: { color: "#991B1B", fontWeight: "900", fontSize: 12 },

  dayBlock: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#fff",
  },

  dayTitle: { fontSize: 16, fontWeight: "900", color: "#0F172A" },
  dayDate: {
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#64748B",
  },

  emptyDay: { marginTop: 10, color: "#94A3B8", fontWeight: "700" },
  editBtn: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
  },
  editText: { color: "#0F766E", fontWeight: "900", fontSize: 12 },
});
