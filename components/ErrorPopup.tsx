import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const ErrorPopup = ({ message }: { message: string | null }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    if (!message) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.error,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            width: "100%",
            position: "absolute",
            top: 0, // Or bottom: 0 depending on preference
            zIndex: 1000,
        },
        text: {
            fontWeight: "bold",
            textAlign: "center",
            margin: 8,
            color: theme.colors.onError,
        },
    });

export default ErrorPopup;
