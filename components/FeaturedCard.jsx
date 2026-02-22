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
              <Ionicons name="sparkles" size={14} color="#0F766E" />
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
    marginHorizontal: 16,
    marginBottom: 16,
  },
  featureImage: {
    height: 180, // Set a specific height
    justifyContent: "flex-end",
  },
  featureImgRadius: {
    borderRadius: 20,
  },
  featureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    justifyContent: 'flex-end'
  },
  featureContent: {
    padding: 16,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#0F766E",
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  featureSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
  },
});