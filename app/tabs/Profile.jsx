import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProfPic from "../../assets/images/ProfPic.png";
import { useGeneralContext } from "../../contexts/GeneralContext";
import { useUserContext } from "../../contexts/UserContext";

const ProfileView = () => {
  const { user, loadProfile, updateProfile, logout } = useUserContext();
  const { avatars } = useGeneralContext();

  const [modalVisible, setModalVisible] = useState(false);

  const [avatarUri, setAvatarUri] = useState(null);
  const [avatarBuster, setAvatarBuster] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (!user) return;
    setAvatarUri(user.profile_picture || null);
    setAvatarBuster((v) => v + 1);
  }, [user?.profile_picture]);

  const avatarSource = avatarUri
    ? { uri: `${avatarUri}?v=${avatarBuster}` }
    : ProfPic;

  const avatarOptions = useMemo(() => avatars, [avatars]);

  const selectNewAvatar = async (imgUrl) => {
    setAvatarUri(imgUrl);
    setAvatarBuster((v) => v + 1);
    setModalVisible(false);

    const res = await updateProfile({ profile_picture: imgUrl });
    if (!res.ok) {
      alert(res.message || "Avatar update failed");
      return;
    }
    await loadProfile();
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={{ fontWeight: "800", color: "#064E3B" }}>Loading profile...</Text>
          <TouchableOpacity onPress={loadProfile} style={{ marginTop: 12 }}>
            <Text style={{ color: "#064E3B", fontWeight: "800" }}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={{ marginTop: 12 }}>
            <Text style={{ color: "#EF4444", fontWeight: "800" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = user.full_name?.trim() ? user.full_name : "Add your name";
  const displayBio = user.bio?.trim() ? user.bio : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.subtitle}>Manage your account details</Text>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutCircle}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.avatarWrapper}>
            <Image source={avatarSource} style={styles.avatar} />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.penCircle}
              activeOpacity={0.85}
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{displayName}</Text>

          {/* Bio Box */}
          <View style={styles.bioBox}>
            <Text
              style={[
                styles.bioText,
                !displayBio ? styles.placeholderText : null,
              ]}
              numberOfLines={3}
            >
              {displayBio || "Add a short bio so people know your travel vibe"}
            </Text>
          </View>
        </View>

        {/* Info tiles */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT INFORMATION</Text>

          <View style={styles.infoTile}>
            <View style={styles.tileIcon}>
              <Ionicons name="mail" size={18} color="#064E3B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tileLabel}>Email</Text>
              <Text style={styles.tileValue}>{user.email || "—"}</Text>
            </View>
          </View>

          <View style={styles.infoTile}>
            <View style={styles.tileIcon}>
              <Ionicons name="call" size={18} color="#064E3B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tileLabel}>Phone</Text>
              <Text style={styles.tileValue}>
                {user.phone || "Phone not provided"}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => router.push("/dashboard/profile/EditProfile")}
            style={styles.primaryBtn}
            activeOpacity={0.9}
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Avatar Modal */}
      {/* <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeIcon}
            >
              <Ionicons name="close-circle" size={30} color="#EF4444" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Choose Avatar</Text>
            <View style={styles.miniDivider} />

            <FlatList
              data={avatarOptions}
              numColumns={4}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              renderItem={({ item }) => {
                const imgUri = item.image_url || item.url;
                return (
                  <TouchableOpacity
                    onPress={() => selectNewAvatar(imgUri)}
                    activeOpacity={0.85}
                    style={{ margin: 6 }}
                  >
                    <Image
                      source={{ uri: imgUri }}
                      style={styles.avatarItem}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal> */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeIcon}
            >
              <Ionicons name="close-circle" size={30} color="#EF4444" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Choose Avatar</Text>
            <View style={styles.miniDivider} />

            <FlatList
              data={avatarOptions}
              numColumns={4}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              // Added spacing between items
              columnWrapperStyle={styles.avatarRow} 
              renderItem={({ item }) => {
                const imgUri = item.image_url || item.url;
                return (
                  <TouchableOpacity
                    onPress={() => selectNewAvatar(imgUri)}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={{ uri: imgUri }}
                      style={styles.avatarItem}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileView;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 32, fontWeight: "900", color: "#064E3B", letterSpacing: -1 },
  subtitle: { fontSize: 15, fontWeight: "600", color: "#4B5563", marginTop: -2 },

  logoutCircle: {
    height: 44,
    width: 44,
    borderRadius: 22, // Perfect circle
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },

  heroSection: { alignItems: "center", marginTop: 10, paddingHorizontal: 20 },
  avatarWrapper: { position: "relative", marginBottom: 16 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // Perfect circle
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F1F5F9",
  },
  penCircle: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#064E3B",
    width: 34,
    height: 34,
    borderRadius: 17, // Perfect circle
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userName: { fontSize: 24, fontWeight: "900", color: "#111827", marginBottom: 8 },

  bioBox: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  bioText: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
  },
  placeholderText: { color: "#9CA3AF", fontStyle: "italic" },

  section: { marginTop: 30, paddingHorizontal: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9CA3AF",
    marginBottom: 12,
    letterSpacing: 1,
  },

  infoTile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  tileLabel: { fontSize: 11, fontWeight: "800", color: "#9CA3AF", textTransform: "uppercase" },
  tileValue: { fontSize: 15, fontWeight: "700", color: "#111827" },

  footer: { paddingHorizontal: 20, marginTop: 10 },
  primaryBtn: {
    backgroundColor: "#064E3B",
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },

modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Slightly darker for focus
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: { 
    backgroundColor: "#FFF", 
    width: "100%", 
    borderRadius: 24, 
    padding: 20,
    maxHeight: '60%', // Prevents the modal from being too tall
  },
  closeIcon: { 
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "900", 
    color: "#064E3B", 
    marginBottom: 10,
    marginTop: 5 
  },
  miniDivider: { 
    height: 1, 
    backgroundColor: "#F1F5F9", 
    marginBottom: 15 
  },
  avatarRow: {
    justifyContent: 'space-between',
    marginBottom: 12
  },
  avatarItem: { 
    width: 60, // Reduced size to fit 4 per row comfortably
    height: 60, 
    borderRadius: 30, 
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
});

// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useEffect, useMemo, useState } from "react";
// import {
//   FlatList,
//   Image,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import ProfPic from "../../assets/images/ProfPic.png";
// import { useGeneralContext } from "../../contexts/GeneralContext";
// import { useUserContext } from "../../contexts/UserContext";

// const ProfileView = () => {
//   const { user, loadProfile, updateProfile, logout } = useUserContext();
//   const { avatars } = useGeneralContext();

//   const [modalVisible, setModalVisible] = useState(false);

//   // ✅ avatar state
//   const [avatarUri, setAvatarUri] = useState(null);
//   const [avatarBuster, setAvatarBuster] = useState(0);

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     setAvatarUri(user.profile_picture || null);
//     setAvatarBuster((v) => v + 1);
//   }, [user?.profile_picture]);

//   const avatarSource = avatarUri
//     ? { uri: `${avatarUri}?v=${avatarBuster}` }
//     : ProfPic;

//   const avatarOptions = useMemo(() => avatars, [avatars]);

//   const selectNewAvatar = async (imgUrl) => {
//     setAvatarUri(imgUrl);
//     setAvatarBuster((v) => v + 1);
//     setModalVisible(false);

//     const res = await updateProfile({ profile_picture: imgUrl });
//     if (!res.ok) {
//       alert(res.message || "Avatar update failed");
//       return;
//     }
//     await loadProfile();
//   };

//   const handleLogout = async () => {
//     await logout();
//     router.replace("/");
//   };

//   if (!user) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.center}>
//           <Text style={{ fontWeight: "800" }}>Loading...</Text>
//           <TouchableOpacity onPress={loadProfile} style={{ marginTop: 12 }}>
//             <Text style={{ color: "#0F766E", fontWeight: "800" }}>Retry</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handleLogout} style={{ marginTop: 12 }}>
//             <Text style={{ color: "#EF4444", fontWeight: "800" }}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const displayName = user.full_name?.trim() ? user.full_name : "Add your name";
//   const displayBio = user.bio?.trim() ? user.bio : null;

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.title}>My Profile</Text>
//           <Text style={styles.subtitle}>Manage your account details</Text>
//         </View>

//         <TouchableOpacity onPress={handleLogout} style={styles.logoutCircle}>
//           <Ionicons name="log-out-outline" size={20} color="#EF4444" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
//         {/* Hero */}
//         <View style={styles.heroSection}>
//           <View style={styles.avatarWrapper}>
//             <Image source={avatarSource} style={styles.avatar} />
//             <TouchableOpacity
//               onPress={() => setModalVisible(true)}
//               style={styles.penCircle}
//               activeOpacity={0.85}
//             >
//               <Ionicons name="images" size={16} color="#FFFFFF" />
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.userName}>{displayName}</Text>

//           {/* Bio */}
//           <View style={styles.bioBox}>
//             <Text
//               style={[
//                 styles.bioText,
//                 !displayBio ? styles.placeholderText : null,
//               ]}
//               numberOfLines={3}
//             >
//               {displayBio ||
//                 "Add a short bio so people know your travel vibe ✨"}
//             </Text>
//           </View>
//         </View>

//         {/* Info tiles */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Account</Text>

//           <View style={styles.infoTile}>
//             <View style={styles.tileIcon}>
//               <Ionicons name="mail" size={18} color="#0F766E" />
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.tileLabel}>Email</Text>
//               <Text style={styles.tileValue}>{user.email || "—"}</Text>
//             </View>
//           </View>

//           <View style={styles.infoTile}>
//             <View style={styles.tileIcon}>
//               <Ionicons name="call" size={18} color="#0F766E" />
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.tileLabel}>Phone</Text>
//               <Text style={styles.tileValue}>
//                 {user.phone || "Phone not provided"}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Footer button */}
//         <View style={styles.footer}>
//           <TouchableOpacity
//             onPress={() => router.push("/dashboard/profile/EditProfile")}
//             style={styles.primaryBtn}
//             activeOpacity={0.9}
//           >
//             <Ionicons name="create-outline" size={18} color="#FFFFFF" />
//             <Text style={styles.primaryBtnText}>Edit Profile</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Avatar Modal */}
//       <Modal visible={modalVisible} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <TouchableOpacity
//               onPress={() => setModalVisible(false)}
//               style={styles.closeIcon}
//               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             >
//               <Ionicons name="close-circle" size={30} color="#EF4444" />
//             </TouchableOpacity>

//             <Text style={styles.modalTitle}>Choose an avatar</Text>

//             <View style={styles.miniDivider} />

//             <Text style={styles.gridLabel}>Pick one</Text>

//             <FlatList
//               data={avatarOptions}
//               numColumns={4}
//               keyExtractor={(item, index) =>
//                 item.id?.toString() || index.toString()
//               }
//               ListEmptyComponent={
//                 <Text style={{ textAlign: "center", marginTop: 20 }}>
//                   No avatars found
//                 </Text>
//               }
//               renderItem={({ item }) => {
//                 // Determine the correct URI field based on what your console log showed
//                 const imgUri = item.image_url || item.url;

//                 return (
//                   <TouchableOpacity
//                     onPress={() => selectNewAvatar(imgUri)}
//                     activeOpacity={0.85}
//                     style={{ margin: 6 }}
//                   >
//                     <Image
//                       source={{ uri: imgUri }}
//                       style={[
//                         styles.avatarItem,
//                         { backgroundColor: "#F1F5F9" }, // Helps see the box if image is broken
//                       ]}
//                       onError={(e) =>
//                         console.log("Image Load Error:", e.nativeEvent.error)
//                       }
//                     />
//                   </TouchableOpacity>
//                 );
//               }}
//             />
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default ProfileView;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFFFFF" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },

//   header: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   title: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
//   subtitle: { fontSize: 13, fontWeight: "600", color: "#64748B", marginTop: 2 },

//   logoutCircle: {
//     height: 42,
//     width: 42,
//     borderRadius: 21,
//     backgroundColor: "#FEF2F2",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#FEE2E2",
//   },

//   heroSection: { alignItems: "center", marginTop: 10, paddingHorizontal: 16 },
//   avatarWrapper: { position: "relative", marginBottom: 12 },
//   avatar: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#F8FAFC",
//   },
//   penCircle: {
//     position: "absolute",
//     bottom: 2,
//     right: 2,
//     backgroundColor: "#0F766E",
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 3,
//     borderColor: "#FFFFFF",
//   },
//   userName: { fontSize: 22, fontWeight: "900", color: "#0F172A" },

//   bioBox: {
//     marginTop: 10,
//     backgroundColor: "#F8FAFC",
//     padding: 12,
//     borderRadius: 14,
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#F1F5F9",
//   },
//   bioText: {
//     fontSize: 14,
//     color: "#475569",
//     textAlign: "center",
//     lineHeight: 20,
//     fontWeight: "600",
//   },
//   placeholderText: { color: "#94A3B8", fontStyle: "italic" },

//   section: { marginTop: 22, paddingHorizontal: 16 },
//   sectionTitle: {
//     fontSize: 15,
//     fontWeight: "800",
//     color: "#0F172A",
//     marginBottom: 12,
//   },

//   infoTile: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 14,
//     padding: 12,
//     marginBottom: 10,
//   },
//   tileIcon: {
//     width: 38,
//     height: 38,
//     borderRadius: 10,
//     backgroundColor: "#F1F5F9",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   tileLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#94A3B8",
//     textTransform: "uppercase",
//   },
//   tileValue: { fontSize: 14, fontWeight: "700", color: "#0F172A" },

//   footer: { paddingHorizontal: 16, marginTop: 14 },
//   primaryBtn: {
//     backgroundColor: "#0F766E",
//     paddingVertical: 14,
//     borderRadius: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//   },
//   primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },

//   /* MODAL */
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   modalCard: {
//     backgroundColor: "#FFF",
//     width: "100%",
//     borderRadius: 24,
//     padding: 20,
//     position: "relative",
//   },
//   closeIcon: { position: "absolute", top: 12, right: 12, zIndex: 10 },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "900",
//     color: "#0F172A",
//     marginBottom: 10,
//     marginTop: 6,
//   },
//   miniDivider: {
//     height: 1,
//     backgroundColor: "#F1F5F9",
//     width: "100%",
//     marginBottom: 14,
//   },
//   gridLabel: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: "#94A3B8",
//     textTransform: "uppercase",
//     marginBottom: 12,
//   },
//   avatarItem: { width: 64, height: 64, borderRadius: 32, margin: 6 },
// });

