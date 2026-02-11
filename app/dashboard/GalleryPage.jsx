// import { useLocalSearchParams } from 'expo-router';
// import { FlatList, Image, StyleSheet, View } from 'react-native';

// const GalleryPage = () => {

//   const params = useLocalSearchParams()
//   const images = JSON.parse(params.images)

//   return (
//     <View>
//       <FlatList
//         data={images}
//         renderItem={({item}) => {
//             return(<Image source={{uri: item.uri}} style={{ width: 200, height: 200 }} />)
//         }}
//       />
//     </View>
//   )
// }

// export default GalleryPage

// const styles = StyleSheet.create({})

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
  const images = JSON.parse(params.images);

  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <View style={styles.container}>
      <BackButton light />
      {/* GRID */}
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => setSelectedIndex(index)}>
            <Image source={{ uri: item.uri }} style={styles.image} />
          </Pressable>
        )}
      />

      {/* FULLSCREEN VIEWER */}
      <Modal visible={selectedIndex !== null} transparent>
        <View style={styles.viewer}>
          {/* close */}
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Image source={{ uri: item.uri }} style={styles.fullImage} />
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default GalleryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  list: {
    padding: 12,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
  },

  /* FULL SCREEN */
  viewer: {
    flex: 1,
    backgroundColor: "black",
  },

  fullImage: {
    width: width,
    height: height,
    resizeMode: "contain",
  },

  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
