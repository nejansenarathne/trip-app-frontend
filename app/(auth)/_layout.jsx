import { Stack } from "expo-router";

const authLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="loginPage" options={{ headerShown: false }} />
      <Stack.Screen name="registerPage" options={{ headerShown: false }} />
      <Stack.Screen name="resetPassword" options={{ headerShown: false }} />
    </Stack>
  );
};

export default authLayout;
