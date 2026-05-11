import ErrorPopup from "@/components/ErrorPopup";
import { Offer } from "@/models/Offer";
import { auth } from "@/services/FirebaseConfig";
import { offersService } from "@/services/OffersService";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";

// TODO: Prezentacja informacji, edycja, usuwanie oferty (tylko dla właściciela)
export default function OfferDetailsScreen() {
    const params: { id: string } = useLocalSearchParams<{ id: string } & any>();

    const [offer, setOffer] = useState<Offer | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [user] = useAuthState(auth);
    const router = useRouter();
    const theme = useTheme();
    const { t } = useTranslation();

    const styles = useMemo(() => createStyles(theme), [theme]);

    const isLoggedIn = !!user;
    const isOwner = offer?.userId === user?.uid;

    // TODO: Warunkowe wyświetlanie przycisków edycji/usuwania (tylko dla właściciela oferty)
    const handleEdit = useCallback(() => {
        router.push({
            pathname: "/offer-form",
            params: params,
        });
    }, []);

    const handleDelete = useCallback(() => {
        // TODO: implementacja
    }, []);

    const fetchOfferDetails = useCallback(async () => {
        try {
            const offer = await offersService.getOffer(params.id);
            setOffer(offer);
        } catch (error) {
            setOffer(null);
        }
    }, [params.id]);

    useEffect(() => {
        fetchOfferDetails();
    }, []);

    if (offer === null) {
        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true} style={{ flex: 1 }} />
            </View>
        );
    }

    return (
        <ScrollView>
            <Stack.Screen />
            <ErrorPopup message={error} />

            <Text variant="headlineSmall" style={{ margin: 16 }}>
                {offer?.title}
            </Text>
            {isLoggedIn && isOwner && (
                <View>
                    <Button mode="contained" style={styles.button} onPress={handleEdit}>
                        {t("offerDetails.edit", "Edit offer")}
                    </Button>
                    <Button
                        mode="contained"
                        style={[styles.button, styles.deleteButton]}
                        onPress={handleDelete}
                    >
                        {t("offerDetails.delete", "Delete offer")}
                    </Button>
                </View>
            )}
        </ScrollView>
    );
}

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
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
