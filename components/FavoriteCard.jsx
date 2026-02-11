import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useDestinationContext } from "../contexts/DestinationContext";

const FavoriteCard = ({ destination }) => {
  const { removeFromFavorites } = useDestinationContext();

  const openDetails = () => {
    router.push({
      pathname: "dashboard/DetailsPage",
      params: { destination: JSON.stringify(destination) },
    });
  };

  return (
    <Pressable onPress={openDetails} style={styles.card}>
      {/* image */}
      <Image source={{ uri: destination.imageUrl }} style={styles.image} />

      {/* content */}
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {destination.name}
        </Text>

        <Text numberOfLines={2} style={styles.desc}>
          {destination.shortDescription}
        </Text>

        {/* bottom row */}
        <View style={styles.bottomRow}>
          <View style={styles.category}>
            <Text style={styles.categoryText}>{destination.category}</Text>
          </View>

          <Pressable
            onPress={() => removeFromFavorites(destination)}
            hitSlop={10}
          >
            <Ionicons name="heart" size={20} color="#0F766E" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default FavoriteCard;

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
    justifyContent: "space-between",
  },

  category: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },

  categoryText: {
    color: "#0F766E",
    fontWeight: "800",
    fontSize: 12,
    textTransform: "capitalize",
  },
});
