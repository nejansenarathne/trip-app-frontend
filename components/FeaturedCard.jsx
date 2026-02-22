import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from "react-native";

const FeaturedCard = ({ destination, featuredData, onPress }) => {
  // Guard clause
  if (!destination) return null;

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.featureWrap} 
      onPress={onPress}
    >
      <ImageBackground
        source={{ uri: destination.imageUrl }}
        style={styles.featureImage}
        imageStyle={styles.featureImgRadius}
      >
        <View style={styles.featureOverlay}>
          <View style={styles.featureContent}>
            <View style={styles.badge}>
              <Ionicons name="sparkles" size={14} color="#064E3B" />
              <Text style={styles.badgeText}>FEATURED</Text>
            </View>

            <View>
              <Text style={styles.featureTitle}>{destination.name}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default FeaturedCard;

const styles = StyleSheet.create({
  featureWrap: {
    marginHorizontal: 20, // Unified with Destinations page padding
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  featureImage: {
    height: 200, // Slightly taller for more visual impact
    justifyContent: "flex-end",
  },
  featureImgRadius: {
    borderRadius: 20,
  },
  featureOverlay: {
    ...StyleSheet.absoluteFillObject,
    // Deeper gradient-style overlay for premium look
    backgroundColor: "rgba(82, 82, 82, 0.35)", 
    borderRadius: 20,
    justifyContent: 'flex-end'
  },
  featureContent: {
    padding: 20,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.95)", // High contrast white
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12, // Matches the new boxy-modern aesthetic
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#064E3B", // MyTrips Dark Emerald
    letterSpacing: 1,
  },
  featureTitle: {
    fontSize: 28, // Bigger, bolder title
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

// import { Ionicons } from "@expo/vector-icons";
// import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from "react-native";

// const FeaturedCard = ({ destination, featuredData, onPress }) => {
//   // Guard clause
//   if (!destination) return null;

//   return (
//     <TouchableOpacity 
//       activeOpacity={0.9} 
//       style={styles.featureWrap} 
//       onPress={onPress}
//     >
//       <ImageBackground
//         source={{ uri: destination.imageUrl }}
//         style={styles.featureImage}
//         imageStyle={styles.featureImgRadius}
//       >
//         <View style={styles.featureOverlay}>
//           <View style={styles.featureContent}>
//             <View style={styles.badge}>
//               <Ionicons name="sparkles" size={14} color="#0F766E" />
//               <Text style={styles.badgeText}>FEATURED</Text>
//             </View>

//             <View>
//               <Text style={styles.featureTitle}>{destination.name}</Text>
              
//             </View>
//           </View>
//         </View>
//       </ImageBackground>
//     </TouchableOpacity>
//   );
// };

// export default FeaturedCard;

// const styles = StyleSheet.create({
//   featureWrap: {
//     marginHorizontal: 16,
//     marginBottom: 16,
//   },
//   featureImage: {
//     height: 180, // Set a specific height
//     justifyContent: "flex-end",
//   },
//   featureImgRadius: {
//     borderRadius: 20,
//   },
//   featureOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     borderRadius: 20,
//     justifyContent: 'flex-end'
//   },
//   featureContent: {
//     padding: 16,
//   },
//   badge: {
//     alignSelf: "flex-start",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 99,
//     marginBottom: 8,
//   },
//   badgeText: {
//     fontSize: 11,
//     fontWeight: "900",
//     color: "#0F766E",
//   },
//   featureTitle: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: "#FFFFFF",
//   },
//   featureSubtitle: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "rgba(255,255,255,0.9)",
//     marginTop: 2,
//   },
// });