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

// const LoginPage = () => {
//   const [email, setEmail] = useState(""); // username or email
//   const [password, setPassword] = useState("");
//   const [showPw, setShowPw] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // ✅ call context ONCE
//   const { authLogin, authGoogle } = useUserContext();

//   // ✅ google hook
//   const { request, response, promptAsync, getGoogleTokenFromResponse } =
//     useGoogleAuth();

//   // ✅ handle google callback
//   useEffect(() => {
//     if (response?.type !== "success") return;

//     const run = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         setMessage("");

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

// const loginWithGoogle = () => {
//   setError("This feature will be availble soon.");
// };

//   const loginSubmit = async () => {
//     if (loading) return;

//     setError("");
//     setMessage("");
//     setLoading(true);

//     if (!email.trim() || !password.trim()) {
//       setError("Please enter your username/email and password.");
//       setLoading(false);
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await authLogin(email.trim(), password);

//       if (!res.ok) {
//         setError(res.message);
//         return;
//       }

//       setMessage("Login successful ✅");
//       router.replace("/tabs/Destinations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       {/* Top */}
//       <View style={styles.header}>
//         <View style={styles.badge}>
//           <Ionicons name="sparkles-outline" size={14} color="#0F766E" />
//           <Text style={styles.badgeText}>Welcome back</Text>
//         </View>

//         <Text style={styles.title}>Login to WonderLand</Text>
//         <Text style={styles.subtitle}>
//           Continue exploring your saved places
//         </Text>
//       </View>

//       {/* Card */}
//       <View style={styles.card}>
//         {/* Username/Email */}
//         <View style={styles.inputWrap}>
//           <Ionicons name="person-outline" size={18} color="#64748B" />
//           <TextInput
//             placeholder="Username or email"
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
//             returnKeyType="done"
//             onSubmitEditing={loginSubmit}
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

//         {!!error && <Text style={styles.error}>{error}</Text>}
//         {!!message && <Text style={styles.success}>{message}</Text>}

//         {/* Forgot */}
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={() => router.push("/(auth)/resetPassword")}
//           style={styles.forgotBtn}
//         >
//           <Text style={styles.forgotText}>Forgot password?</Text>
//         </TouchableOpacity>

//         {/* Submit */}
//         <TouchableOpacity
//           activeOpacity={0.9}
//           style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
//           onPress={loginSubmit}
//           disabled={loading}
//         >
//           <Text style={styles.primaryText}>
//             {loading ? "Loading..." : "Login"}
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
//           onPress={() => router.push("/(auth)/registerPage")}
//           style={styles.switchBtn}
//         >
//           <Text style={styles.switchText}>
//             New to WonderLand?{" "}
//             <Text style={styles.switchStrong}>Create one</Text>
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default LoginPage;

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

//   success: {
//     color: "#16A34A",
//     fontWeight: "800",
//     marginBottom: 10,
//     marginTop: -2,
//   },

//   forgotBtn: {
//     alignSelf: "flex-end",
//     marginBottom: 14,
//   },

//   forgotText: {
//     color: "#0F766E",
//     fontWeight: "800",
//     fontSize: 13,
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

const LoginPage = () => {
  /* ---------------- STATE (Original Logic) ---------------- */
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ---------------- CONTEXT & GOOGLE (Original Logic) ---------------- */
  const { authLogin, authGoogle } = useUserContext();
  const { request, response, promptAsync, getGoogleTokenFromResponse } = useGoogleAuth();

  useEffect(() => {
    if (response?.type !== "success") return;
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");
        if (!authGoogle) { setError("Auth provider not ready."); return; }
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

  /* ---------------- LOGIN SUBMIT (Original Logic) ---------------- */
  const loginSubmit = async () => {
    if (loading) return;
    setError("");
    setMessage("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your username/email and password.");
      setLoading(false); return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false); return;
    }

    try {
      const res = await authLogin(email.trim(), password);
      // if (!res.ok) { setError(res.message); return; }
      if (!res.ok) { setError( "Login failed!"); return; }
      setMessage("Login successful ✅");
      router.replace("/tabs/Destinations");
    } finally { setLoading(false); }
  };

  const loginWithGoogle = () => { setError("This feature will be available soon."); };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* FIXED LOGO */}
      <View style={styles.fixedHeader}>
        <Image source={lightLogoNBG} style={styles.logo} resizeMode="contain" />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.textWrapper}>
            <Text style={styles.title}>Login to MyTrips</Text>
          </View>

          <View style={styles.form}>
            {/* INLINE ERROR/SUCCESS */}
            {!!error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
            {!!message && <View style={styles.successBox}><Text style={styles.successText}>{message}</Text></View>}

            <Text style={styles.label}>Username or Email</Text>
            <View style={styles.inputWrap}>
              <TextInput 
                placeholder="Enter your email" 
                value={email} 
                onChangeText={setEmail} 
                style={styles.input} 
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <TextInput 
                placeholder="••••••••" 
                value={password} 
                onChangeText={setPassword} 
                style={styles.input} 
                secureTextEntry={!showPw} 
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Ionicons name={showPw ? "eye-off" : "eye"} size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => router.push("/(auth)/resetPassword")} 
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={loginSubmit} disabled={loading}>
              <Text style={styles.primaryText}>{loading ? "Loading..." : "LOGIN"}</Text>
            </TouchableOpacity>

            <View style={styles.dividerWrap}>
              <View style={styles.line} /><Text style={styles.dividerText}>OR</Text><View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleBtn} onPress={loginWithGoogle}>
              <Image source={googleIcon} style={styles.googleIcon} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/(auth)/registerPage")} style={styles.switchBtn}>
              <Text style={styles.switchText}>New to MyTrips? <Text style={styles.switchStrong}>Create account</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  fixedHeader: { paddingLeft: 20, paddingTop: 10 },
  logo: { width: 100, height: 100, tintColor: "#064E3B" },
  scrollContent: { paddingHorizontal: 30, paddingBottom: 40 },
  textWrapper: { marginTop: 0, marginBottom: 20 },
  title: { fontSize: 38, fontWeight: "900", color: "#064E3B", letterSpacing: -1 },
  label: { fontSize: 10, fontWeight: "800", color: "#064E3B", textTransform: "uppercase", marginBottom: 4, marginLeft: 2 },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12 },
  input: { flex: 1, fontSize: 15, fontWeight: "600", color: "#0F172A" },
  
  errorBox: { backgroundColor: "#F0FDF4", borderLeftWidth: 4, borderLeftColor: "#064E3B", padding: 10, marginBottom: 15, borderRadius: 4 },
  errorText: { color: "#064E3B", fontSize: 12, fontWeight: "700" },
  successBox: { backgroundColor: "#ECFDF5", borderLeftWidth: 4, borderLeftColor: "#10B981", padding: 10, marginBottom: 15, borderRadius: 4 },
  successText: { color: "#10B981", fontSize: 12, fontWeight: "700" },

  forgotBtn: { alignSelf: "flex-end", marginBottom: 15 },
  forgotText: { color: "#064E3B", fontWeight: "800", fontSize: 13 },

  primaryBtn: { backgroundColor: "#064E3B", paddingVertical: 16, borderRadius: 6, alignItems: "center", marginTop: 5 },
  primaryText: { color: "#FFF", fontSize: 15, fontWeight: "900", letterSpacing: 1 },
  dividerWrap: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { marginHorizontal: 10, fontSize: 11, fontWeight: "800", color: "#64748B" },
  googleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 6, borderWidth: 1, borderColor: "#E5E7EB" },
  googleIcon: { width: 18, height: 18 },
  googleText: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  switchBtn: { marginTop: 20, alignItems: "center" },
  switchText: { color: "#64748B", fontWeight: "600", fontSize: 13 },
  switchStrong: { color: "#064E3B", fontWeight: "900" },
});