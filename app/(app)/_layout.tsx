import { Stack } from "expo-router";
import AuthGuard from "@/src/componentes/AuthGuard";

const AppLayout = () => (
  <AuthGuard>
    <Stack screenOptions={{ headerShown: false }} />
  </AuthGuard>
);

export default AppLayout;
