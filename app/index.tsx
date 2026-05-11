import ErrorPopup from "@/components/ErrorPopup";
import { OfferItem } from "@/components/OfferItem";
import { useAppTranslation } from "@/hooks/use-app-translation";
import { Offer } from "@/models/Offer";
import { offersService } from "@/services/OffersService";
import { FlashList } from "@shopify/flash-list";
import * as Network from "expo-network";
import { Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

export default function HomeScreen() {
    const theme = useTheme();
    const { t } = useAppTranslation();

    const [offers, setOffers] = useState<{ offer: Offer; id: string }[]>([]);
    const [refreshing, setRefreshing] = useState(true);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [error, setError] = useState<string | null>(null);

    // TODO: Filtracja, sortowanie
    const fetchOffers = useCallback(async () => {
        setRefreshing(true);
        const networkStatus = await Network.getNetworkStateAsync();

        if (!networkStatus.isConnected) {
            setError(t("noConnection", "No internet connection"));
            setRefreshing(false);
            return;
        }

        try {
            const offers = await offersService.getOffers();
            setOffers(offers);
            setError(null);
        } catch (error) {
            setOffers([]);
            setError(t("home.fetchError", "Failed to fetch offers"));
        } finally {
            setRefreshing(false);
        }
    }, [offers]);

    useEffect(() => {
        fetchOffers();
    }, []);

    if (refreshing && offers.length === 0) {
        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true} style={{ flex: 1 }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen />
            <ErrorPopup message={error} />
            <Text variant="bodyMedium" style={styles.subtitleInfo}>
                {`${t("home.found", "Found")} ${offers.length} ${t("home.offers", "offers matching your criteria:")}`}
            </Text>
            <View style={styles.innerContainer}>
                {offers.length == 0 ? (
                    <Text variant="bodyMedium" style={styles.subtitleInfo}>
                        {t("home.noOffers", "No offers found.")}
                    </Text>
                ) : (
                    <FlashList
                        data={offers}
                        renderItem={({ item }) => <OfferItem item={item.offer} id={item.id} />}
                        keyExtractor={(item) => item.id}
                        refreshing={refreshing}
                        onRefresh={fetchOffers}
                    />
                )}
            </View>
        </View>
    );
}

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        innerContainer: {
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
        },
        title: {
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 8,
            color: theme.colors.onBackground,
        },
        subtitleInfo: {
            textAlign: "center",
            marginBottom: 24,
            color: theme.colors.onSurfaceVariant,
        },
        errorArea: {
            height: 32,
            marginBottom: 8,
            justifyContent: "center",
        },
        form: {
            width: "100%",
        },
        input: {
            marginBottom: 4,
            backgroundColor: "transparent",
        },
        button: {
            marginTop: 16,
            borderRadius: 28,
        },
        buttonContent: {
            height: 56,
        },
        footer: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 32,
        },
        link: {
            fontWeight: "bold",
            textDecorationLine: "underline",
            color: theme.colors.primary,
            marginLeft: 4,
        },
    });
