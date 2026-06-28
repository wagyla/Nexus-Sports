import { Stack } from "expo-router";
import AuthGuard from "@/src/components/AuthGuard";

const AppLayout = () => (
  <AuthGuard>
    <Stack screenOptions={{ headerShown: false }} />
  </AuthGuard>
);

export default AppLayout;
