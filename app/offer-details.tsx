import ErrorPopup from "@/components/ErrorPopup";
import { Offer } from "@/models/Offer";
import { auth } from "@/services/FirebaseConfig";
import { offersService } from "@/services/OffersService";
import * as Network from "expo-network";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    Dialog,
    Divider,
    List,
    Portal,
    Text,
    useTheme,
} from "react-native-paper";

export default function OfferDetailsScreen() {
    const params: { id: string } = useLocalSearchParams<{ id: string } & any>();

    const [offer, setOffer] = useState<Offer | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [deletionNoticeVisible, setDeletionNoticeVisible] = useState<boolean>(false);

    const [user] = useAuthState(auth);
    const router = useRouter();
    const theme = useTheme();
    const { t } = useTranslation();

    const styles = useMemo(() => createStyles(theme), [theme]);

    const isLoggedIn = !!user;
    const isOwner = offer?.userId === user?.uid;

    const handleEdit = useCallback(() => {
        router.push({
            pathname: "/offer-form",
            params: params,
        });
    }, [params, router]);

    const handleDelete = useCallback(() => {
        setDeletionNoticeVisible(false);
        offersService
            .deleteOffer(params.id)
            .then(() => {
                router.push("/");
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [params.id, router]);

    const fetchOfferDetails = useCallback(async () => {
        const networkStatus = await Network.getNetworkStateAsync();

        if (!networkStatus.isConnected) {
            setError(t("noConnection", "No internet connection"));
            return;
        }

        try {
            const offer = await offersService.getOffer(params.id);
            setOffer(offer);
        } catch (error) {
            setOffer(null);
        }
    }, [params.id, t]);

    useEffect(() => {
        fetchOfferDetails();
    }, [fetchOfferDetails]);

    if (offer === null) {
        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true} style={{ flex: 1 }} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen />
            <ErrorPopup message={error} />

            <View style={styles.innerContainer}>
                <Text variant="headlineSmall" style={styles.title}>
                    {offer?.title}
                </Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                    {offer?.companyName}
                </Text>

                <Divider bold={true} style={styles.separator} />

                <List.Section>
                    <List.Item
                        title={
                            offer?.remote
                                ? t("offerDetails.remote", "Remote")
                                : `${offer?.location?.city}, ${offer?.location?.region}`
                        }
                        left={(props) => (
                            <List.Icon {...props} icon="map-marker" style={styles.icon} />
                        )}
                        titleStyle={styles.listItemText}
                    />
                    <List.Item
                        title={
                            offer?.salary > 0
                                ? `${offer?.salary}zł`
                                : t("offerDetails.salaryNotSpecified", "For negotiation")
                        }
                        left={(props) => <List.Icon {...props} icon="cash" style={styles.icon} />}
                        titleStyle={styles.listItemText}
                    />
                    {offer?.tags && (
                        <List.Item
                            title={offer?.tags}
                            left={(props) => (
                                <List.Icon {...props} icon="tag-outline" style={styles.icon} />
                            )}
                            titleStyle={styles.listItemText}
                        />
                    )}
                </List.Section>

                <Divider bold={true} style={styles.separator} />

                <Text variant="bodyMedium" style={styles.subtitle}>
                    {t("offerDetails.description", "Offer description")}
                </Text>
                <Text variant="bodyMedium" style={styles.description}>
                    {offer?.description}
                </Text>

                <Divider bold={true} style={styles.separator} />

                <Text variant="bodyMedium" style={styles.subtitle}>
                    {t("offerDetails.contactInfo", "Contact information")}
                </Text>

                <List.Item
                    title={offer?.email}
                    left={(props) => (
                        <List.Icon {...props} icon="email-outline" style={styles.icon} />
                    )}
                    titleStyle={styles.listItemText}
                />
                {offer?.phoneNumber && (
                    <List.Item
                        title={offer?.phoneNumber}
                        left={(props) => (
                            <List.Icon {...props} icon="phone-outline" style={styles.icon} />
                        )}
                        titleStyle={styles.listItemText}
                    />
                )}

                {isLoggedIn && isOwner && (
                    <View>
                        <Divider bold={true} style={styles.separator} />
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            {t("offerDetails.moderation", "Moderation actions")}
                        </Text>
                        <Portal>
                            <Dialog
                                visible={deletionNoticeVisible}
                                onDismiss={() => setDeletionNoticeVisible(false)}
                            >
                                <Dialog.Title>
                                    {t("offerDetails.deletion", "Offer deletion")}
                                </Dialog.Title>
                                <Dialog.Content>
                                    <Text variant="bodyMedium">
                                        {t(
                                            "offerDetails.deletionNotice",
                                            "Are you sure you want to delete this offer? This action cannot be undone!",
                                        )}
                                    </Text>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <View style={styles.buttonRow}>
                                        <Button onPress={() => setDeletionNoticeVisible(false)}>
                                            {t("offerDetails.cancel", "Cancel")}
                                        </Button>
                                        <Button onPress={handleDelete}>
                                            {t("offerDetails.delete", "Delete")}
                                        </Button>
                                    </View>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                        <Button mode="contained" style={styles.button} onPress={handleEdit}>
                            {t("offerDetails.edit", "Edit offer")}
                        </Button>
                        <Button
                            mode="contained"
                            style={[styles.button, styles.deleteButton]}
                            onPress={() => setDeletionNoticeVisible(true)}
                        >
                            {t("offerDetails.delete", "Delete offer")}
                        </Button>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        innerContainer: {
            paddingBottom: 40,
            paddingHorizontal: 24,
            paddingTop: 20,
        },
        title: {
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 4,
            color: theme.colors.onBackground,
        },
        icon: {
            alignSelf: "center",
        },
        subtitle: {
            textAlign: "center",
            marginBottom: 8,
            opacity: 0.7,
            color: theme.colors.onBackground,
        },
        description: {
            lineHeight: 22,
            color: theme.colors.onBackground,
        },
        listItemText: {
            fontSize: 14,
            color: theme.colors.onBackground,
        },
        separator: {
            marginVertical: 16,
        },
        button: {
            marginHorizontal: 18,
            marginVertical: 8,
            padding: 8,
            borderRadius: 90,
        },
        deleteButton: {
            backgroundColor: theme.colors.error,
        },
        buttonRow: {
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 16,
        },
    });
