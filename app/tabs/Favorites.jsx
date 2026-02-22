import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import FavoriteCard from "../../components/FavoriteCard";
import { useDestinationContext } from "../../contexts/DestinationContext";

const Favorites = () => {
  const { favorites } = useDestinationContext();

  return (
    <View style={styles.container}>
      {/* Header - Styled like Trips Page */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Saved places</Text>
          <Text style={styles.subtitle}>
            {favorites.length} destination{favorites.length !== 1 ? "s" : ""} saved
          </Text>
        </View>
      </View>

      {/* Main Content */}
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={80} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Tap the heart icon to save destinations you love and build your list.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => item.id ? String(item.id) : `fav-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <FavoriteCard destination={item} />}
        />
      )}
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 30, // Matches Trips Header
    paddingBottom: 20,
  },

  title: { 
    fontSize: 32, 
    fontWeight: "900", 
    color: "#064E3B", // Dark Emerald from Trips theme
    letterSpacing: -1,
  },

  subtitle: { 
    marginTop: -2, 
    fontSize: 15, 
    fontWeight: "600", 
    color: "#4B5563" 
  },

  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 120, 
    gap: 16 
  },
  
  /* EMPTY STATE - Styled like Trips Page */
  empty: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    paddingHorizontal: 40,
    paddingBottom: 100,
  },

  emptyTitle: { 
    marginTop: 20,
    fontSize: 20, 
    fontWeight: "900", 
    color: "#064E3B" 
  },

  emptyText: { 
    marginTop: 8, 
    textAlign: "center", 
    fontSize: 15, 
    color: "#6B7280", 
    fontWeight: "600", 
    lineHeight: 22 
  },
});

// import { Ionicons } from "@expo/vector-icons";
// import { FlatList, StyleSheet, Text, View } from "react-native";
// import FavoriteCard from "../../components/FavoriteCard";
// import { useDestinationContext } from "../../contexts/DestinationContext";

// const Favorites = () => {
//   const { favorites } = useDestinationContext();

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.title}>Saved places</Text>
//           <Text style={styles.subtitle}>
//             {favorites.length} destination{favorites.length !== 1 ? "s" : ""}
//           </Text>
//         </View>
//         {favorites.length > 0 && (
//           <View style={styles.iconCircle}>
//             <Ionicons name="heart" size={20} color="#0F766E" />
//           </View>
//         )}
//       </View>

//       {/* Main Content */}
//       {favorites.length === 0 ? (
//         <View style={styles.empty}>
//           <View style={styles.emptyIconCircle}>
//              <Ionicons name="heart-outline" size={60} color="#CBD5E1" />
//           </View>
//           <Text style={styles.emptyTitle}>No saved places yet</Text>
//           <Text style={styles.emptyText}>
//             Tap the heart icon to save destinations you love
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={favorites}
//           keyExtractor={(item, index) => item.id ? String(item.id) : `fav-${index}`}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => <FavoriteCard destination={item} />}
//         />
//       )}
//     </View>
//   );
// };

// export default Favorites;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFFFFF" },
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   title: { fontSize: 28, fontWeight: "900", color: "#0F172A" },
//   subtitle: { fontSize: 14, fontWeight: "700", color: "#64748B", marginTop: 4 },
//   iconCircle: {
//     height: 44,
//     width: 44,
//     borderRadius: 22,
//     backgroundColor: "#F0FDFA",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#CCFBF1",
//   },
//   listContent: { paddingHorizontal: 20, paddingBottom: 100, gap: 16 },
  
//   /* EMPTY STATE (Trips Style) */
//   empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
//   emptyIconCircle: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#F8FAFC",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20
//   },
//   emptyTitle: { fontSize: 20, fontWeight: "900", color: "#0F172A" },
//   emptyText: { marginTop: 8, textAlign: "center", fontSize: 15, color: "#64748B", fontWeight: "600", lineHeight: 22 },
// });