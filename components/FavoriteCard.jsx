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
            
            {/* Swapped Trash for Heart Toggle */}
            <TouchableOpacity 
              onPress={() => setShowConfirm(true)} 
              hitSlop={10}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#EF4444" : "#64748B"} 
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
  // --- Restored Original Styles ---
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

  // --- Minimalist Popup Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 20,
    alignItems: "center",
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  btnRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  flatBtn: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#F1F5F9",
  },
  cancelText: {
    color: "#64748B",
    fontWeight: "600",
  },
  removeText: {
    color: "#EF4444",
    fontWeight: "700",
  },
});