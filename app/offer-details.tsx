import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

// TODO: Prezentacja informacji
export default function OfferDetailsScreen() {
    const params: { id: string } = useLocalSearchParams<{ id: string } & any>();

    const theme = useTheme();
    const { t } = useTranslation();

    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <ScrollView>
            <Stack.Screen />

            <Text variant="displayMedium" style={{ margin: 16 }}>
                {params.id}
            </Text>
            <Button mode="contained" style={styles.button} onPress={() => {}}>
                {t("offerDetails.edit", "Edit offer")}
            </Button>
            <Button
                mode="contained"
                style={[styles.button, styles.deleteButton]}
                onPress={() => {}}
            >
                {t("offerDetails.delete", "Delete offer")}
            </Button>
        </ScrollView>
    );
}

const createStyles = (theme: any) =>
    StyleSheet.create({
        button: {
            marginHorizontal: 18,
            marginVertical: 8,
            padding: 8,
            borderRadius: 90,
        },
        deleteButton: {
            backgroundColor: theme.colors.error,
            color: theme.colors.onError,
        },
    });
