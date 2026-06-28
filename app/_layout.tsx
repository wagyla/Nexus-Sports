import { Stack } from "expo-router";

const RootLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(auth)" />
    <Stack.Screen name="(app)" />
  </Stack>
);

export default RootLayout;
