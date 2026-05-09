import { Stack, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View>
            <Stack.Screen />
            <Text>Home</Text>
            <Button onPress={() => router.push("/login")}>Login</Button>
        </View>
    );
}
