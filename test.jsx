import * as SecureStore from "expo-secure-store"; // for secure token storage
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://192.168.1.5:8000"; // replace with Bathila's backend IP or ngrok URL

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.access && data.refresh) {
        // ✅ Save tokens securely
        await SecureStore.setItemAsync("accessToken", data.access);
        await SecureStore.setItemAsync("refreshToken", data.refresh);

        setMessage("Login successful ✅");
        navigation.navigate("Home"); // go to protected page
      } else {
        setMessage("Login failed ❌");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={{ marginTop: 20 }}>{message}</Text>
    </View>
  );
}
