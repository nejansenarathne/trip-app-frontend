// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import googleIcon from "../../assets/images/google.png";
// import { useUserContext } from "../../contexts/UserContext";
// import { useGoogleAuth } from "../../services/googleAuth";

// const RegisterPage = () => {
//   /* ---------------- STATE ---------------- */
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [showPw, setShowPw] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ---------------- CONTEXT ---------------- */
//   const { authRegister, authGoogle } = useUserContext();

//   /* ---------------- GOOGLE ---------------- */
//   const { request, response, promptAsync, getGoogleTokenFromResponse } =
//     useGoogleAuth();

//   useEffect(() => {
//     if (response?.type !== "success") return;

//     const run = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         if (!authGoogle) {
//           setError("Auth provider not ready.");
//           return;
//         }

//         const token = getGoogleTokenFromResponse();
//         if (!token) {
//           setError("Google token not received.");
//           return;
//         }

//         const res = await authGoogle(token);
//         if (!res?.ok) {
//           setError(res?.message || "Google login failed");
//           return;
//         }

//         router.replace("/tabs/Destinations");
//       } catch (e) {
//         setError(e?.message || "Google login failed");
//       } finally {
//         setLoading(false);
//       }
//     };

//     run();
//   }, [response]);

//   /* ---------------- REGISTER ---------------- */
//   const registerSubmit = async () => {
//     if (loading) return;

//     setError("");
//     setLoading(true);

//     // ✅ Validation
//     if (
//       !fullName.trim() ||
//       !email.trim() ||
//       !password.trim() ||
//       !confirm.trim()
//     ) {
//       setError("Please fill all fields.");
//       setLoading(false);
//       return;
//     }
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       setLoading(false);
//       return;
//     }
//     if (password !== confirm) {
//       setError("Passwords do not match.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await authRegister(fullName.trim(), email.trim(), password);

//       if (!res.ok) {
//         setError(res.message);
//         return;
//       }

//       router.replace("/tabs/Destinations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loginWithGoogle = () => {
//   setError("This feature will be availble soon.");
// };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       {/* Top */}
//       <View style={styles.header}>
//         <View style={styles.badge}>
//           <Ionicons name="sparkles-outline" size={14} color="#0F766E" />
//           <Text style={styles.badgeText}>Create account</Text>
//         </View>

//         <Text style={styles.title}>Join WonderLand</Text>
//         <Text style={styles.subtitle}>Save places and plan trips faster</Text>
//       </View>

//       {/* Card */}
//       <View style={styles.card}>
//         {/* Full name */}
//         <View style={styles.inputWrap}>
//           <Ionicons name="id-card-outline" size={18} color="#64748B" />
//           <TextInput
//             placeholder="Full name"
//             placeholderTextColor="#94A3B8"
//             value={fullName}
//             onChangeText={setFullName}
//             style={styles.input}
//             returnKeyType="next"
//           />
//         </View>

//         {/* Email */}
//         <View style={styles.inputWrap}>
//           <Ionicons name="mail-outline" size={18} color="#64748B" />
//           <TextInput
//             placeholder="Email"
//             placeholderTextColor="#94A3B8"
//             value={email}
//             onChangeText={setEmail}
//             style={styles.input}
//             autoCapitalize="none"
//             autoCorrect={false}
//             keyboardType="email-address"
//             returnKeyType="next"
//           />
//         </View>

//         {/* Password */}
//         <View style={styles.inputWrap}>
//           <Ionicons name="lock-closed-outline" size={18} color="#64748B" />
//           <TextInput
//             placeholder="Password"
//             placeholderTextColor="#94A3B8"
//             value={password}
//             onChangeText={setPassword}
//             style={styles.input}
//             autoCapitalize="none"
//             autoCorrect={false}
//             secureTextEntry={!showPw}
//             returnKeyType="next"
//           />
//           <TouchableOpacity
//             onPress={() => setShowPw((s) => !s)}
//             style={styles.eyeBtn}
//             activeOpacity={0.8}
//           >
//             <Ionicons
//               name={showPw ? "eye-off-outline" : "eye-outline"}
//               size={18}
//               color="#64748B"
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Confirm */}
//         <View style={styles.inputWrap}>
//           <Ionicons name="shield-checkmark-outline" size={18} color="#64748B" />
//           <TextInput
//             placeholder="Confirm password"
//             placeholderTextColor="#94A3B8"
//             value={confirm}
//             onChangeText={setConfirm}
//             style={styles.input}
//             autoCapitalize="none"
//             autoCorrect={false}
//             secureTextEntry={!showConfirm}
//             returnKeyType="done"
//             onSubmitEditing={registerSubmit}
//           />
//           <TouchableOpacity
//             onPress={() => setShowConfirm((s) => !s)}
//             style={styles.eyeBtn}
//             activeOpacity={0.8}
//           >
//             <Ionicons
//               name={showConfirm ? "eye-off-outline" : "eye-outline"}
//               size={18}
//               color="#64748B"
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Error */}
//         {!!error && <Text style={styles.error}>{error}</Text>}

//         {/* Submit */}
//         <TouchableOpacity
//           activeOpacity={0.9}
//           style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
//           onPress={registerSubmit}
//           disabled={loading}
//         >
//           <Text style={styles.primaryText}>
//             {loading ? "Creating..." : "Create account"}
//           </Text>
//           <Ionicons name="arrow-forward" size={18} color="#fff" />
//         </TouchableOpacity>

//         {/* Divider */}
//         <View style={styles.dividerWrap}>
//           <View style={styles.line} />
//           <Text style={styles.dividerText}>or continue with</Text>
//           <View style={styles.line} />
//         </View>

//         {/* Google */}
//         <TouchableOpacity
//           activeOpacity={0.85}
//           style={[styles.googleBtn, (!request || loading) && { opacity: 0.6 }]}
//           onPress={loginWithGoogle}
//           disabled={!request || loading}
//         >
//           <Image source={googleIcon} style={styles.googleIcon} />
//           <Text style={styles.googleText}>Continue with Google</Text>
//         </TouchableOpacity>

//         {/* Switch */}
//         <TouchableOpacity
//           activeOpacity={0.85}
//           onPress={() => router.push("/(auth)/loginPage")}
//           style={styles.switchBtn}
//         >
//           <Text style={styles.switchText}>
//             Already have an account?{" "}
//             <Text style={styles.switchStrong}>Login</Text>
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default RegisterPage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 18,
//     justifyContent: "center",
//   },

//   header: {
//     marginBottom: 18,
//     alignItems: "center",
//   },

//   badge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 999,
//     backgroundColor: "#ECFDF5",
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//     marginBottom: 12,
//   },

//   badgeText: {
//     fontSize: 12,
//     fontWeight: "900",
//     color: "#0F766E",
//   },

//   title: {
//     fontSize: 26,
//     fontWeight: "900",
//     color: "#0F172A",
//     textAlign: "center",
//   },

//   subtitle: {
//     marginTop: 6,
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#64748B",
//     textAlign: "center",
//   },

//   card: {
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 18,
//     padding: 14,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 14,
//     shadowOffset: { width: 0, height: 10 },
//     elevation: 2,
//   },

//   inputWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: "#F8FAFC",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     marginBottom: 12,
//   },

//   input: {
//     flex: 1,
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#0F172A",
//     padding: 0,
//   },

//   eyeBtn: {
//     padding: 6,
//   },

//   error: {
//     color: "#EF4444",
//     fontWeight: "700",
//     marginBottom: 10,
//     marginTop: -2,
//   },

//   primaryBtn: {
//     backgroundColor: "#0F766E",
//     paddingVertical: 14,
//     borderRadius: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//   },

//   primaryText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "900",
//   },

//   switchBtn: {
//     marginTop: 14,
//     alignItems: "center",
//   },

//   switchText: {
//     color: "#64748B",
//     fontWeight: "700",
//   },

//   switchStrong: {
//     color: "#0F766E",
//     fontWeight: "900",
//   },

//   dividerWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 16,
//   },

//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#E5E7EB",
//   },

//   dividerText: {
//     marginHorizontal: 10,
//     fontSize: 12,
//     fontWeight: "800",
//     color: "#64748B",
//   },

//   googleBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     paddingVertical: 13,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#FFFFFF",
//   },

//   googleIcon: {
//     width: 20,
//     height: 20,
//   },

//   googleText: {
//     fontSize: 15,
//     fontWeight: "800",
//     color: "#0F172A",
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView
} from "react-native";
import { StatusBar } from "expo-status-bar";

import googleIcon from "../../assets/images/google.png";
import lightLogoNBG from "../../assets/images/light_logo_nobg.png";
import { useUserContext } from "../../contexts/UserContext";
import { useGoogleAuth } from "../../services/googleAuth";

const RegisterPage = () => {
  /* ---------------- STATE ---------------- */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- CONTEXT ---------------- */
  const { authRegister, authGoogle } = useUserContext();
  const { request, response, promptAsync, getGoogleTokenFromResponse } = useGoogleAuth();

  useEffect(() => {
    if (response?.type !== "success") return;
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const token = getGoogleTokenFromResponse();
        if (!token) { setError("Google token not received."); return; }
        const res = await authGoogle(token);
        if (!res?.ok) { setError(res?.message || "Google login failed"); return; }
        router.replace("/tabs/Destinations");
      } catch (e) { setError(e?.message || "Google login failed"); }
      finally { setLoading(false); }
    };
    run();
  }, [response]);

  /* ---------------- LIVE CHECKLIST LOGIC ---------------- */
  const requirements = [
    { label: "8+ Characters", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Numbers", met: /\d/.test(password) },
    { label: "Symbols", met: /[!@#$%^&*]/.test(password) },
  ];

  const getStrengthData = () => {
    const metCount = requirements.filter(r => r.met).length;
    if (password.length === 0) return { width: "0%", color: "#E5E7EB", label: "" };
    if (metCount <= 1) return { width: "25%", color: "#EF4444", label: "Weak" };
    if (metCount <= 3) return { width: "60%", color: "#F59E0B", label: "Fair" };
    return { width: "100%", color: "#064E3B", label: "Strong" };
  };

  const strength = getStrengthData();

  /* ---------------- REGISTER SUBMIT ---------------- */
  const registerSubmit = async () => {
    if (loading) return;
    setError("");
    setLoading(true);

    const metCount = requirements.filter(r => r.met).length;

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError("Please fill all fields.");
      setLoading(false); return;
    }
    // Now allowing "Fair" (metCount >= 2) as requested
    if (password.length < 8 || metCount < 2) {
      setError("Password is too weak. Meet at least 3 requirements.");
      setLoading(false); return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false); return;
    }

    try {
      const res = await authRegister(fullName.trim(), email.trim(), password);
      if (!res.ok) { setError( "Register failed!"); return; }
      router.replace("/tabs/Destinations");
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.fixedHeader}>
        <Image source={lightLogoNBG} style={styles.logo} resizeMode="contain" />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Join MyTrips</Text>

          <View style={styles.form}>
            {!!error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrap}>
              <TextInput placeholder="Full name" value={fullName} onChangeText={setFullName} style={styles.input} />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrap, { marginBottom: 6 }]}>
              <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry={!showPw} />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}><Ionicons name={showPw ? "eye-off" : "eye"} size={18} color="#64748B" /></TouchableOpacity>
            </View>

            {/* STRENGTH BAR (Smaller Width to avoid wrap) */}
            <View style={styles.strengthRow}>
              <View style={styles.strengthTrack}>
                <View style={[styles.strengthBar, { width: strength.width, backgroundColor: strength.color }]} />
              </View>
              <Text style={[styles.strengthText, { color: strength.color }]}>{strength.label}</Text>
            </View>

            {/* CHECKLIST SECTION */}
            <View style={styles.checklist}>
              {requirements.map((req, i) => (
                <View key={i} style={styles.checkItem}>
                  <Ionicons name={req.met ? "checkmark-circle" : "ellipse-outline"} size={14} color={req.met ? "#064E3B" : "#CBD5E1"} />
                  <Text style={[styles.checkText, req.met && { color: "#064E3B", fontWeight: "700" }]}>{req.label}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrap}>
              <TextInput placeholder="Confirm" value={confirm} onChangeText={setConfirm} style={styles.input} secureTextEntry={!showConfirm} />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}><Ionicons name={showConfirm ? "eye-off" : "eye"} size={18} color="#64748B" /></TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={registerSubmit} disabled={loading}>
              <Text style={styles.primaryText}>{loading ? "Verifying..." : "JOIN MyTrips"}</Text>
            </TouchableOpacity>

            <View style={styles.dividerWrap}>
              <View style={styles.line} /><Text style={styles.dividerText}>OR</Text><View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleBtn} onPress={() => setError("Google login coming soon.")}>
              <Image source={googleIcon} style={styles.googleIcon} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/(auth)/loginPage")} style={styles.switchBtn}>
              <Text style={styles.switchText}>Already have an account? <Text style={styles.switchStrong}>Login</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  fixedHeader: { paddingLeft: 20, paddingTop: 10 },
  logo: { width: 100, height: 100, tintColor: "#064E3B" },
  scrollContent: { paddingHorizontal: 30, paddingBottom: 40 },
  title: { fontSize: 38, fontWeight: "900", color: "#064E3B", letterSpacing: -1, marginBottom: 20 },
  label: { fontSize: 10, fontWeight: "800", color: "#064E3B", textTransform: "uppercase", marginBottom: 4, marginLeft: 2 },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12 },
  input: { flex: 1, fontSize: 15, fontWeight: "600", color: "#0F172A" },
  
  /* STRENGTH & CHECKLIST */
  strengthRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  strengthTrack: { flex: 1, height: 4, backgroundColor: "#F1F5F9", borderRadius: 2, marginRight: 10 },
  strengthBar: { height: "100%", borderRadius: 2 },
  strengthText: { fontSize: 10, fontWeight: "900", width: 50, textAlign: "right", textTransform: "uppercase" },
  
  checklist: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 15, paddingLeft: 2 },
  checkItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  checkText: { fontSize: 11, color: "#64748B", fontWeight: "500" },

  errorBox: { backgroundColor: "#F0FDF4", borderLeftWidth: 4, borderLeftColor: "#064E3B", padding: 10, marginBottom: 15, borderRadius: 4 },
  errorText: { color: "#064E3B", fontSize: 12, fontWeight: "700" },
  primaryBtn: { backgroundColor: "#064E3B", paddingVertical: 16, borderRadius: 6, alignItems: "center", marginTop: 5 },
  primaryText: { color: "#FFF", fontSize: 15, fontWeight: "900", letterSpacing: 1 },
  dividerWrap: { flexDirection: "row", alignItems: "center", marginVertical: 15 },
  line: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { marginHorizontal: 10, fontSize: 11, fontWeight: "800", color: "#64748B" },
  googleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 6, borderWidth: 1, borderColor: "#E5E7EB" },
  googleIcon: { width: 18, height: 18 },
  googleText: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  switchBtn: { marginTop: 15, alignItems: "center" },
  switchText: { color: "#64748B", fontWeight: "600", fontSize: 13 },
  switchStrong: { color: "#064E3B", fontWeight: "900" },
});