import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

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

const TripCard = ({ trip, coverImage, onPress }) => {
  const totalPlaces =
    (trip.days || []).reduce((sum, d) => sum + (d.stops?.length || 0), 0) || 0;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: coverImage }} style={styles.image} />

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {trip.name || "Untitled trip"}
        </Text>

        <Text style={styles.desc}>
          {formatRange(trip.startDate, trip.endDate)}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.pill}>
            <Ionicons name="calendar-outline" size={14} color="#0F766E" />
            <Text style={styles.pillText}>{(trip.days || []).length} days</Text>
          </View>

          <View style={styles.pill}>
            <Ionicons name="pin-outline" size={14} color="#0F766E" />
            <Text style={styles.pillText}>{totalPlaces} places</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },

  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0F172A",
  },

  desc: {
    marginTop: 6,
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
    lineHeight: 20,
  },

  bottomRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },

  pillText: {
    color: "#0F766E",
    fontWeight: "900",
    fontSize: 12,
  },
});
