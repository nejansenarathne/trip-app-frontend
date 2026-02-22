import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

const BackButton = ({ light = false }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[
        styles.btn, 
        light ? styles.lightBtn : styles.darkBtn
      ]}
      activeOpacity={0.7}
    >
      <Ionicons
        name="chevron-back"
        size={24}
        color={light ? "#FFFFFF" : "#064E3B"}
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44, // Standard touch target size
    height: 44,
    borderRadius: 22, // Perfect circle
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  // Style for use on top of images
  lightBtn: {
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Subtle dark overlay for contrast
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  // Style for use on white backgrounds
  darkBtn: {
    backgroundColor: "#F1F5F9", 
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});

// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { StyleSheet, TouchableOpacity } from "react-native";

// const BackButton = ({ light = false }) => {
//   const router = useRouter();

//   return (
//     <TouchableOpacity
//       onPress={() => router.back()}
//       style={[styles.btn, light && { backgroundColor: "rgba(0,0,0,0.45)" }]}
//       activeOpacity={0.8}
//     >
//       <Ionicons
//         name="chevron-back"
//         size={22}
//         color={light ? "#fff" : "#0F172A"}
//       />
//     </TouchableOpacity>
//   );
// };

// export default BackButton;

// const styles = StyleSheet.create({
//   btn: {
//     position: "absolute",
//     top: 50,
//     left: 16,
//     width: 38,
//     height: 38,
//     borderRadius: 999,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 5,
//     zIndex: 999,
//   },
// });
