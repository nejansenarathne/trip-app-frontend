import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react"; // Added useState
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal, // Added Modal
  TouchableOpacity, // Added TouchableOpacity for the popup buttons
} from "react-native";
import FavoriteCard from "../../components/FavoriteCard";
import { useDestinationContext } from "../../contexts/DestinationContext";
import { useTripContext } from "../../contexts/TripContext";

const formatRange = (startISO, endISO) => {
  if (!startISO || !endISO) return "Dates not set";
  const s = new Date(startISO + "T00:00:00");
  const e = new Date(endISO + "T00:00:00");
  const startText = s.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endText = e.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${startText} – ${endText}`;
};

const TripDetailsPage = () => {
  const { tripId } = useLocalSearchParams();
  const { getTripById, deleteTrip } = useTripContext();
  const { destinations } = useDestinationContext();

  const [showConfirm, setShowConfirm] = useState(false); // State for popup

  const trip = getTripById(String(tripId));

  if (!trip) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontWeight: "900", fontSize: 16 }}>Trip not found</Text>
        <Pressable style={{ marginTop: 12 }} onPress={() => router.back()}>
          <Text style={{ color: "#0F766E", fontWeight: "900" }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const coverImage = (() => {
    for (const day of trip.days || []) {
      const firstStop = day.stops?.[0];
      if (firstStop) {
        const place = destinations.find((d) => d.id === firstStop.placeId);
        if (place?.imageUrl) return place.imageUrl;
      }
    }
    return destinations?.[0]?.imageUrl || "https://picsum.photos/900/600?random=101";
  })();

  const confirmDelete = () => {
    setShowConfirm(false);
    deleteTrip(trip.id);
    router.back();
  };

  const getPlace = (placeId) => destinations.find((d) => d.id === placeId);

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.coverWrap}>
          <Image source={{ uri: coverImage }} style={styles.cover} />
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
          <View style={styles.coverOverlay} />
          <View style={styles.coverTextWrap}>
            <Text style={styles.tripTitle}>{trip.name}</Text>
            <Text style={styles.tripSub}>{formatRange(trip.startDate, trip.endDate)}</Text>
          </View>
        </View>

        {/* Days Content */}
        <View style={{ padding: 16, paddingBottom: 30 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Trip Plan</Text>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <Pressable
                onPress={() => router.push({ pathname: "/dashboard/EditTripPage", params: { tripId: String(trip.id) } })}
                style={styles.editBtn}
              >
                <Ionicons name="create-outline" size={16} color="#0F766E" />
                <Text style={styles.editText}>Edit</Text>
              </Pressable>

              <Pressable onPress={() => setShowConfirm(true)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={16} color="#991B1B" />
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>

          {(trip.days || []).map((day) => (
            <View key={day.date} style={styles.dayBlock}>
              <Text style={styles.dayTitle}>Day {day.dayIndex}</Text>
              <Text style={styles.dayDate}>
                {new Date(day.date + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
              {(day.stops || []).length === 0 ? (
                <Text style={styles.emptyDay}>No places added</Text>
              ) : (
                <View style={{ gap: 12, marginTop: 10 }}>
                  {day.stops.map((s) => {
                    const place = getPlace(s.placeId);
                    return place ? <FavoriteCard key={s.id} destination={place} /> : null;
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Confirmation Popup (Same style as FavoriteCard) */}
      <Modal transparent visible={showConfirm} animationType="none">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete this trip?</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.flatBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.flatBtn} onPress={confirmDelete}>
                <Text style={styles.removeText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TripDetailsPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  coverWrap: { height: 260 },
  cover: { width: "100%", height: "100%" },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  coverTextWrap: { position: "absolute", left: 16, right: 16, bottom: 16 },
  tripTitle: { fontSize: 26, fontWeight: "900", color: "#fff" },
  tripSub: { marginTop: 6, fontSize: 13, fontWeight: "700", color: "rgba(255,255,255,0.9)" },
  backBtn: { position: "absolute", top: 52, left: 16, width: 38, height: 38, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", zIndex: 10 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#0F172A" },
  deleteBtn: { flexDirection: "row", gap: 6, alignItems: "center", backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  deleteText: { color: "#991B1B", fontWeight: "900", fontSize: 12 },
  editBtn: { flexDirection: "row", gap: 6, alignItems: "center", backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, marginRight: 10 },
  editText: { color: "#0F766E", fontWeight: "900", fontSize: 12 },
  dayBlock: { marginTop: 14, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 18, padding: 14, backgroundColor: "#fff" },
  dayTitle: { fontSize: 16, fontWeight: "900", color: "#0F172A" },
  dayDate: { marginTop: 4, fontSize: 12.5, fontWeight: "700", color: "#64748B" },
  emptyDay: { marginTop: 10, color: "#94A3B8", fontWeight: "700" },

  // --- Popup Styles (Mirrored from FavoriteCard) ---
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "80%", backgroundColor: "#fff", borderRadius: 12, paddingTop: 20, alignItems: "center", overflow: "hidden" },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 20, paddingHorizontal: 10 },
  btnRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  flatBtn: { flex: 1, paddingVertical: 15, alignItems: "center" },
  divider: { width: 1, backgroundColor: "#F1F5F9" },
  cancelText: { color: "#64748B", fontWeight: "600" },
  removeText: { color: "#EF4444", fontWeight: "700" },
});