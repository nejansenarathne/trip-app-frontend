import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import BackButton from "../../components/BackButton";

const { width, height } = Dimensions.get("window");
const IMAGE_SIZE = (width - 36) / 2;

const GalleryPage = () => {
  const params = useLocalSearchParams();
  const images = params.images ? JSON.parse(params.images) : [];

  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <View style={styles.container}>
      <BackButton light />
      <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => setSelectedIndex(index)}>
            {/* ✅ FIXED: Changed uri to url */}
            <Image source={{ uri: item.url }} style={styles.image} />
          </Pressable>
        )}
      />

      <Modal visible={selectedIndex !== null} transparent>
        <View style={styles.viewer}>
          <Pressable
            style={styles.closeBtn}
            onPress={() => setSelectedIndex(null)}
          >
            <Ionicons name="close" size={28} color="white" />
          </Pressable>

          <FlatList
            data={images}
            horizontal
            pagingEnabled
            initialScrollIndex={selectedIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              /* ✅ FIXED: Changed uri to url */
              <Image source={{ uri: item.url }} style={styles.fullImage} />
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default GalleryPage;

// ... (Your styles remain exactly as provided)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerSpacer: {
    paddingTop: 10,
    zIndex: 10,
  },
  list: {
    padding: 12,
    paddingTop: 60, // Space for back button
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pressable: {
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE + 40, // Slightly portrait for a modern look
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#94a3b8",
  },
  /* FULL SCREEN */
  viewer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  fullImageContainer: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: width,
    height: height * 0.8,
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 100,
  },
});
