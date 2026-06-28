import { getUser } from "@/utils/auth";
import { Redirect } from "expo-router";

const Index = () => {

    const user = getUser()

    if (user) return <Redirect href="/(app)/feed" />

    return <Redirect href="/(auth)/login" />
};

export default Index;
