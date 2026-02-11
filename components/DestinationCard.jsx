// import { router } from 'expo-router';
// import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useDestinationContext } from '../contexts/DestinationContext';

// const DestinationCard = ({destination}) => {

//   const {addToFavorites, removeFromFavorites, isFavorite} = useDestinationContext();
//   const fav = isFavorite(destination);

//   //This function will direct to the relavent details page when the card is pressed
//   const directToDetails = () => {
//     router.push({
//       pathname: 'dashboard/DetailsPage',
//       params: { destination: JSON.stringify(destination) }
//     })
//   }

//   return (
//     <TouchableOpacity onPress={directToDetails}>
//       <View>

//           <Text>{destination.name}</Text>

//           {/* ---favorite button--- */}
//           <Pressable style={{ padding: 10}} onPress={() => {
//               fav? removeFromFavorites(destination) : addToFavorites(destination);
//           }}>
//             <Text>{fav ? '❤️' : '🤍'}</Text>
//           </Pressable>

//           <Image source={{uri: destination.imageUrl}} style={{width: '100%', height: 200}}/>
//           <Text>{destination.shortDescription}</Text>

//       </View>
//     </TouchableOpacity>
//   )
// }

// export default DestinationCard

// const styles = StyleSheet.create({})

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDestinationContext } from "../contexts/DestinationContext";

const DestinationCard = ({ destination, variant = "large" }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } =
    useDestinationContext();
  const fav = isFavorite(destination);

  const directToDetails = () => {
    router.push({
      pathname: "dashboard/DetailsPage",
      params: { destination: JSON.stringify(destination) },
    });
  };

  return (
    <TouchableOpacity
      onPress={directToDetails}
      activeOpacity={0.9}
      style={[styles.card, variant === "compact" && styles.cardCompact]}
    >
      {/* Image */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: destination.imageUrl }} style={styles.image} />

        {/* Favorite */}
        <Pressable
          onPress={() =>
            fav ? removeFromFavorites(destination) : addToFavorites(destination)
          }
          style={styles.favBtn}
        >
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={18}
            color={fav ? "#E11D48" : "#0F172A"}
          />
        </Pressable>

        {/* Rating pill */}
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={14} color="#0F766E" />
          <Text style={styles.ratingText}>{destination.rating}</Text>
        </View>
      </View>

      {/* Text */}
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.name}>
          {destination.name}
        </Text>
        <Text numberOfLines={2} style={styles.desc}>
          {destination.shortDescription}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DestinationCard;

const styles = StyleSheet.create({
  card: {
    width: 240,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardCompact: {
    width: 200,
  },

  imageWrap: {
    height: 150,
    backgroundColor: "#F1F5F9",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    height: 34,
    width: 34,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.9)",
  },

  ratingPill: {
    position: "absolute",
    left: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.9)",
  },
  ratingText: {
    fontWeight: "900",
    color: "#0F172A",
    fontSize: 12,
  },

  body: {
    padding: 12,
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },
  desc: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "600",
    lineHeight: 17,
  },
});
