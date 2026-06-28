import { Stack } from "expo-router";
import { AuthProvider } from "@/src/contexts/AuthContext";

const RootLayout = () => (
  <AuthProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  </AuthProvider>
);

export default RootLayout;
