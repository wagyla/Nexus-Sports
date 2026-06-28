import { Stack } from "expo-router";
import GuestGuard from "@/src/components/GuestGuard";

const AuthLayout = () => (
  <GuestGuard>
    <Stack screenOptions={{ headerShown: false }} />
  </GuestGuard>
);

export default AuthLayout;
