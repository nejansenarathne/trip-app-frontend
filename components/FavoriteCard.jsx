import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDestinationContext } from "../contexts/DestinationContext";

const FavoriteCard = ({ destination }) => {
  const { removeFromFavorites, favorites } = useDestinationContext();
  const [showConfirm, setShowConfirm] = useState(false);

  // Check if it's favorited (for color logic)
  const isFavorite = favorites.some((fav) => fav.id === destination.id);

  const handleDelete = () => {
    setShowConfirm(false);
    removeFromFavorites(destination);
  };

  return (
    <>
      <Pressable
        onPress={() => router.push({ pathname: "dashboard/DetailsPage", params: { id: destination.id } })}
        style={styles.card}
      >
        <Image source={{ uri: destination.imageUrl }} style={styles.image} />

        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.title}>{destination.name}</Text>
          <Text numberOfLines={2} style={styles.desc}>{destination.shortDescription}</Text>
          
          <View style={styles.bottomRow}>
            <View style={styles.category}>
              <Text style={styles.categoryText}>{destination.category}</Text>
            </View>
            
            <TouchableOpacity 
              onPress={() => setShowConfirm(true)} 
              hitSlop={10}
              activeOpacity={0.7}
              style={styles.favBtn}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorite ? "#E11D48" : "#064E3B"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>

      <Modal transparent visible={showConfirm} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Remove from saved?</Text>
            
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.flatBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.flatBtn} onPress={handleDelete}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default FavoriteCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 2, // Allows shadow to breathe
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    alignItems: "center",
    // Match DestinationCard Shadow
    shadowColor: "#064E3B",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  content: {
    flex: 1,
    marginLeft: 14,
    height: 110,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: "900",
    color: "#064E3B", // Emerald title
  },
  desc: {
    fontSize: 13,
    color: "#4B5563", // Gray-600
    fontWeight: "600",
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  category: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    color: "#064E3B",
    fontWeight: "800",
    fontSize: 11,
    textTransform: "uppercase",
  },
  favBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(6, 78, 59, 0.4)", // Dark Emerald tinted overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 24,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#064E3B",
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  flatBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#F1F5F9",
  },
  cancelText: {
    color: "#64748B",
    fontWeight: "700",
  },
  removeText: {
    color: "#E11D48", // Rose-600
    fontWeight: "800",
  },
});

// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useState } from "react";
// import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useDestinationContext } from "../contexts/DestinationContext";

// const FavoriteCard = ({ destination }) => {
//   const { removeFromFavorites, favorites } = useDestinationContext();
//   const [showConfirm, setShowConfirm] = useState(false);

//   // Check if it's favorited (for color logic)
//   const isFavorite = favorites.some((fav) => fav.id === destination.id);

//   const handleDelete = () => {
//     setShowConfirm(false);
//     removeFromFavorites(destination);
//   };

//   return (
//     <>
//       <Pressable
//         onPress={() => router.push({ pathname: "dashboard/DetailsPage", params: { id: destination.id } })}
//         style={styles.card}
//       >
//         <Image source={{ uri: destination.imageUrl }} style={styles.image} />

//         <View style={styles.content}>
//           <Text numberOfLines={1} style={styles.title}>{destination.name}</Text>
//           <Text numberOfLines={2} style={styles.desc}>{destination.shortDescription}</Text>
          
//           <View style={styles.bottomRow}>
//             <View style={styles.category}>
//               <Text style={styles.categoryText}>{destination.category}</Text>
//             </View>
            
//             {/* Swapped Trash for Heart Toggle */}
//             <TouchableOpacity 
//               onPress={() => setShowConfirm(true)} 
//               hitSlop={10}
//               activeOpacity={0.7}
//             >
//               <Ionicons 
//                 name={isFavorite ? "heart" : "heart-outline"} 
//                 size={24} 
//                 color={isFavorite ? "#EF4444" : "#64748B"} 
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Pressable>

//       <Modal transparent visible={showConfirm} animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Remove from saved?</Text>
            
//             <View style={styles.btnRow}>
//               <TouchableOpacity style={styles.flatBtn} onPress={() => setShowConfirm(false)}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <View style={styles.divider} />
//               <TouchableOpacity style={styles.flatBtn} onPress={handleDelete}>
//                 <Text style={styles.removeText}>Remove</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// export default FavoriteCard;

// const styles = StyleSheet.create({
//   // --- Restored Original Styles ---
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     alignItems: "center",
//   },
//   image: {
//     width: 120,
//     height: 120,
//     borderRadius: 16,
//   },
//   content: {
//     flex: 1,
//     marginLeft: 14,
//     justifyContent: "space-between",
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: "900",
//     color: "#0F172A",
//   },
//   desc: {
//     marginTop: 6,
//     fontSize: 14,
//     color: "#475569",
//     fontWeight: "600",
//     lineHeight: 20,
//   },
//   bottomRow: {
//     marginTop: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   category: {
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 999,
//   },
//   categoryText: {
//     color: "#0F766E",
//     fontWeight: "800",
//     fontSize: 12,
//     textTransform: "capitalize",
//   },

//   // --- Minimalist Popup Styles ---
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "80%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     paddingTop: 20,
//     alignItems: "center",
//     overflow: "hidden",
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#0F172A",
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   btnRow: {
//     flexDirection: "row",
//     borderTopWidth: 1,
//     borderTopColor: "#F1F5F9",
//   },
//   flatBtn: {
//     flex: 1,
//     paddingVertical: 15,
//     alignItems: "center",
//   },
//   divider: {
//     width: 1,
//     backgroundColor: "#F1F5F9",
//   },
//   cancelText: {
//     color: "#64748B",
//     fontWeight: "600",
//   },
//   removeText: {
//     color: "#EF4444",
//     fontWeight: "700",
//   },
// });