import { Stack } from "expo-router";

const DashboardLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ✅ hide default header
      }}
    />
  );
};

export default DashboardLayout;
