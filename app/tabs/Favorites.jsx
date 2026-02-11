import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import FavoriteCard from "../../components/FavoriteCard";
import { useDestinationContext } from "../../contexts/DestinationContext";

const Favorites = () => {
  const { favorites } = useDestinationContext();

  // Empty state
  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={70} color="#CBD5E1" />
        <Text style={styles.emptyTitle}>No saved places yet</Text>
        <Text style={styles.emptyText}>
          Tap the heart icon to save destinations you love
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Saved places</Text>
          <Text style={styles.subtitle}>
            {favorites.length} destination{favorites.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.iconCircle}>
          <Ionicons name="heart" size={20} color="#0F766E" />
        </View>
      </View>

      {/* Favorites list */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <FavoriteCard destination={item} />}
      />
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },

  iconCircle: {
    height: 42,
    width: 42,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 16,
  },

  /* Empty state */
  emptyContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
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
});
