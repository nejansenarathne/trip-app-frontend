import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserContext } from "../../../contexts/UserContext";

const EditProfile = () => {
  const { user, loadProfile, updateProfile } = useUserContext();

  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const profile = user || (await loadProfile());
      if (!profile) return;

      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setBio(profile.bio || "");
      setEmail(profile.email || "");
    })();
  }, []);

  const onSave = async () => {
    if (saving) return;

    if (!fullName.trim()) {
      alert("Please enter your name.");
      return;
    }

    setSaving(true);
    try {
      const res = await updateProfile({
        full_name: fullName.trim(),
        phone: phone?.trim() ? phone.trim() : null,
        bio: bio?.trim() ? bio.trim() : null,
      });

      if (!res.ok) {
        alert(res.message || "Save failed");
        return;
      }

      await loadProfile();
      router.back();
    } finally {
      setSaving(false);
    }
  };

  if (!user && !fullName) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={{ fontWeight: "800" }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Update your details</Text>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your name"
            placeholderTextColor="#94A3B8"
            style={styles.textInput}
          />

          <View style={styles.divider} />

          <Text style={styles.label}>Email</Text>
          <View style={styles.readonlyRow}>
            <Ionicons name="mail" size={16} color="#64748B" />
            <Text style={styles.readonlyText}>{email || "—"}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>Phone (optional)</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="07X XXX XXXX"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            style={styles.textInput}
          />

          <View style={styles.divider} />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about your travel style..."
            placeholderTextColor="#94A3B8"
            multiline
            style={[styles.textInput, styles.textArea]}
            textAlignVertical="top"
          />
        </View>

        {/* Save */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={onSave}
            disabled={saving}
            style={[styles.primaryBtn, saving ? { opacity: 0.7 } : null]}
            activeOpacity={0.9}
          >
            <Ionicons name="save-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 13, fontWeight: "600", color: "#64748B", marginTop: 2 },

  closeBtn: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },

  card: {
    marginTop: 14,
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    padding: 14,
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 8,
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  textArea: {
    minHeight: 110,
    lineHeight: 20,
    fontWeight: "600",
    color: "#334155",
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },

  readonlyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  readonlyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  footer: { paddingHorizontal: 16, marginTop: 16 },
  primaryBtn: {
    backgroundColor: "#0F766E",
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
});
