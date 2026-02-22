// import { Ionicons } from "@expo/vector-icons";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useDestinationContext } from "../contexts/DestinationContext";

// const iconByCategory = (name) => {
//   const key = (name || "").toLowerCase();

//   if (key === "all") return "grid-outline";
//   if (key === "beaches") return "sunny-outline";
//   if (key === "hills") return "leaf-outline";
//   if (key === "cultural") return "library-outline";
//   if (key === "wildlife") return "paw-outline";
//   if (key === "historical") return "time-outline";

//   return "pricetag-outline";
// };

// const HorizontalTag = ({ list, selected }) => {
//   const name = list.name;
//   const { destinationByCategory } = useDestinationContext();

//   return (
//     <TouchableOpacity
//       activeOpacity={0.85}
//       onPress={() => destinationByCategory(name)}
//     >
//       <View style={[styles.chip, selected && styles.chipSelected]}>
//         <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
//           <Ionicons
//             name={iconByCategory(name)}
//             size={16}
//             color={selected ? "#0F766E" : "#64748B"}
//           />
//         </View>

//         <Text style={[styles.text, selected && styles.textSelected]}>
//           {name}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default HorizontalTag;

// const styles = StyleSheet.create({
//   chip: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 999,
//     backgroundColor: "#F8FAFC",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },

//   chipSelected: {
//     backgroundColor: "#ECFDF5",
//     borderColor: "#A7F3D0",
//   },

//   iconWrap: {
//     width: 26,
//     height: 26,
//     borderRadius: 999,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },

//   iconWrapSelected: {
//     backgroundColor: "#FFFFFF",
//     borderColor: "#A7F3D0",
//   },

//   text: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#0F172A",
//   },

//   textSelected: {
//     color: "#0F766E",
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDestinationContext } from "../contexts/DestinationContext";

const HorizontalTag = ({ list, selected }) => {
  const { name, icon_url } = list;
  const { destinationByCategory } = useDestinationContext();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => destinationByCategory(name)}
    >
      <View style={[
        styles.chip, 
        selected && styles.chipSelected,
        !icon_url && { paddingHorizontal: 16 } // Add extra padding if no icon
      ]}>
        {/* Only render the icon wrapper if icon_url is present */}
        {icon_url && (
          <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
            <Ionicons
              name={icon_url}
              size={16}
              color={selected ? "#0F766E" : "#64748B"}
            />
          </View>
        )}

        <Text style={[styles.text, selected && styles.textSelected]}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default HorizontalTag;

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    // Gap only applies if there are two elements
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipSelected: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  iconWrapSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#A7F3D0",
  },
  text: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  textSelected: {
    color: "#0F766E",
  },
});