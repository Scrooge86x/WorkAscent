import { OfferItem } from "@/components/OfferItem";
import { Offer } from "@/models/Offer";
import { offersService } from "@/services/OffersService";
import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function HomeScreen() {
    const theme = useTheme();
    const { t } = useTranslation();

    const [offers, setOffers] = useState<Offer[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const styles = useMemo(() => createStyles(theme), [theme]);

    // TODO: Filtracja, sortowanie
    const fetchOffers = useCallback(async () => {
        try {
            const offers = await offersService.getOffers();
            setOffers(offers);
        } catch (error) {
            console.error("Error fetching offers:", error);
        }
    }, [offers]);

    useEffect(() => {
        fetchOffers();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen />
            <Text variant="bodyMedium" style={styles.subtitleInfo}>
                {`${t("home.found")} ${offers.length} ${t("home.offers")}`}
            </Text>
            <View style={styles.innerContainer}>
                {offers.length == 0 ? (
                    <Text variant="bodyMedium" style={styles.subtitleInfo}>
                        {t("home.noOffers")}
                    </Text>
                ) : (
                    <FlashList
                        data={offers}
                        renderItem={({ item }) => <OfferItem item={item} />}
                        keyExtractor={(item) => item.userId + item.title}
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
