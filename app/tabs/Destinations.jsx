import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DestinationCard from "../../components/DestinationCard";
import HorizontalTag from "../../components/HorizontalTag";
import { useDestinationContext } from "../../contexts/DestinationContext";
import { useGeneralContext } from "../../contexts/GeneralContext";
import { useUserContext } from "../../contexts/UserContext";
import FeaturedCard from "../../components/FeaturedCard";

const CARD_WIDTH = 230;

const Destinations = () => {
  const { user } = useUserContext();

  const { 
    destinations, 
    filteredDestinations, 
    selectCategory, 
    featuredDestination, 
    featuredData 
  } = useDestinationContext();
  const { categories } = useGeneralContext();

  const goToSearch = (query = "") => {
    router.push({
      pathname: "/tabs/Search",
      params: { q: query },
    });
  };

  const openProfile = () => {
    router.push("/tabs/Profile");
  };

  const openFeatured = () => {
  if (!featuredDestination) return;
  router.push({
    pathname: "/dashboard/DetailsPage",
    params: { id: featuredDestination.id },
  });
};

  // ✅ Feature the first destination (or any logic you want later)
  const featured = destinations?.[0];


  return (
    <ScrollView>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Explore</Text>
            <Text style={styles.subtitle}>Find places you’ll love</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={styles.profileBtn}
              activeOpacity={0.85}
              onPress={openProfile}
            >
              {user?.profile_picture ? (
                <Image
                  source={{ uri: user.profile_picture }}
                  style={{ width: 34, height: 34, borderRadius: 17 }}
                />
              ) : (
                <Image source={require("../../assets/images/ProfPic.png")} style={{ width: 34, height: 34, borderRadius: 17 }} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH BAR */}
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.9}
          onPress={() => goToSearch("")}
        >
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <Text style={styles.searchText}>Where to?</Text>
        </TouchableOpacity>

        {/* FEATURED HERO CARD */}
{featuredDestination ? (
          <FeaturedCard 
            destination={featuredDestination} 
            featuredData={featuredData} 
            onPress={openFeatured} 
          />
        ) : (
          <View style={[styles.featureWrap, { height: 170, backgroundColor: '#F1F5F9', borderRadius: 20 }]} />
        )}

        {/* POPULAR */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Popular</Text>
            {/* <Text style={styles.sectionAction}>See all</Text> */}
          </View>

          <FlatList
            data={destinations}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.id ? String(item.id) : `item-${index}`}
            contentContainerStyle={styles.hListContent}
            renderItem={({ item }) => (
              <DestinationCard destination={item} width={CARD_WIDTH} />
            )}
          />
        </View>

        {/* CATEGORIES + FILTERED */}
        <View style={styles.section}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.tagsContent}
            renderItem={({ item }) => (
              <HorizontalTag
                list={item}
                selected={selectCategory === item.name}
              />
            )}
          />

          <FlatList
            data={filteredDestinations}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.hListContent}
            renderItem={({ item }) => (
              <DestinationCard destination={item} width={CARD_WIDTH} />
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Destinations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 12,
  },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },

  iconBtn: {
    height: 40,
    width: 40,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  profileBtn: {
    height: 40,
    width: 40,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },

  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchText: {
    color: "#94A3B8",
    fontWeight: "700",
    fontSize: 14,
  },

  /* FEATURE CARD */
  featureWrap: {
    marginHorizontal: 16,
    marginBottom: 16,
  },

  featureImage: {
    height: 170,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  featureImgRadius: {
    borderRadius: 20,
  },

  featureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  featureContent: {
    padding: 14,
  },

  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F766E",
  },

  featureTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  featureSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
  },

  section: {
    marginBottom: 14,
  },

  sectionRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  sectionAction: {
    fontSize: 13,
    color: "#0F766E",
    fontWeight: "800",
  },

  hListContent: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    gap: 12,
  },

  tagsContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
});
