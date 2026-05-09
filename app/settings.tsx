import { authService } from "@/services/AuthService";
import { useThemeStore } from "@/store/useThemeStore";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutChangeEvent, ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Divider,
    List,
    Menu,
    SegmentedButtons,
    Surface,
    Text,
    useTheme,
} from "react-native-paper";

const SUPPORTED_LANGUAGES = [
    { code: "en", label: "English" },
    { code: "pl", label: "Polski" },
];

export default function SettingsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { themeMode, setThemeMode } = useThemeStore();

    const user = authService.getCurrentFirebaseUser();
    const isLoggedIn = !!user;

    const [langMenuVisible, setLangMenuVisible] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);

    const onLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            router.replace("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const currentLanguageLabel = useMemo(() => {
        return SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language)?.label || "English";
    }, [i18n.language]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Stack.Screen options={{ headerTitle: "WorkAscent" }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text
                    variant="headlineSmall"
                    style={[styles.mainTitle, { color: theme.colors.onBackground }]}
                >
                    {t("settings.title", "Settings")}
                </Text>

                <View style={styles.section} onLayout={onLayout}>
                    <Text
                        variant="labelLarge"
                        style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}
                    >
                        {t("settings.language", "Language")}
                    </Text>

                    <Menu
                        visible={langMenuVisible}
                        onDismiss={() => setLangMenuVisible(false)}
                        anchorPosition="bottom"
                        contentStyle={{
                            width: containerWidth,
                            backgroundColor: theme.colors.elevation.level2,
                            borderRadius: 12,
                            marginTop: 4,
                        }}
                        anchor={
                            <Surface
                                elevation={0}
                                style={[
                                    styles.anchorSurface,
                                    {
                                        backgroundColor: theme.dark
                                            ? theme.colors.surfaceVariant
                                            : "#f0f0f0",
                                    },
                                ]}
                            >
                                <List.Item
                                    title={currentLanguageLabel}
                                    titleStyle={{ color: theme.colors.onSurface }}
                                    onPress={() => setLangMenuVisible(true)}
                                    left={(props) => (
                                        <List.Icon
                                            {...props}
                                            icon="translate"
                                            color={theme.colors.onSurfaceVariant}
                                        />
                                    )}
                                    right={(props) => (
                                        <List.Icon
                                            {...props}
                                            icon="chevron-down"
                                            color={theme.colors.onSurfaceVariant}
                                        />
                                    )}
                                />
                            </Surface>
                        }
                    >
                        {SUPPORTED_LANGUAGES.map((lang, index) => (
                            <React.Fragment key={lang.code}>
                                <Menu.Item
                                    onPress={() => {
                                        i18n.changeLanguage(lang.code);
                                        setLangMenuVisible(false);
                                    }}
                                    title={lang.label}
                                    leadingIcon={
                                        lang.code === i18n.language ? "check" : "circle-outline"
                                    }
                                    style={{ width: containerWidth, maxWidth: containerWidth }}
                                />
                                {index < SUPPORTED_LANGUAGES.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </Menu>
                </View>

                <View style={styles.section}>
                    <Text
                        variant="labelLarge"
                        style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}
                    >
                        {t("settings.appearance", "Appearance")}
                    </Text>
                    <SegmentedButtons
                        value={themeMode}
                        onValueChange={(val) => setThemeMode(val)}
                        buttons={[
                            {
                                value: "light",
                                label: t("settings.light", "Light"),
                                icon: "brightness-7",
                            },
                            {
                                value: "auto",
                                label: t("settings.auto", "Auto"),
                                icon: "brightness-auto",
                            },
                            {
                                value: "dark",
                                label: t("settings.dark", "Dark"),
                                icon: "brightness-4",
                            },
                        ]}
                    />
                </View>

                {isLoggedIn && (
                    <View style={styles.authContainer}>
                        <View style={styles.section}>
                            <Text
                                variant="labelLarge"
                                style={[
                                    styles.sectionLabel,
                                    { color: theme.colors.onSurfaceVariant },
                                ]}
                            >
                                {t("settings.account", "Account")}
                            </Text>
                            <View style={styles.accountInfo}>
                                <Text
                                    variant="bodyMedium"
                                    style={{ color: theme.colors.onSurfaceVariant }}
                                >
                                    {t("settings.loggedInAs", "Logged in as:")}
                                </Text>
                                <Text
                                    variant="bodyLarge"
                                    style={[styles.emailText, { color: theme.colors.onSurface }]}
                                >
                                    {user?.email}
                                </Text>
                            </View>
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleLogout}
                            style={styles.logoutButton}
                            buttonColor={theme.colors.error}
                            contentStyle={styles.logoutButtonContent}
                        >
                            {t("settings.logout", "Log out")}
                        </Button>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    mainTitle: {
        textAlign: "center",
        fontWeight: "bold",
        marginVertical: 20,
    },
    section: {
        marginBottom: 32,
        width: "100%",
    },
    sectionLabel: {
        marginBottom: 12,
        marginLeft: 4,
        textTransform: "capitalize",
    },
    anchorSurface: {
        borderRadius: 12,
        overflow: "hidden",
    },
    authContainer: {
        width: "100%",
        marginTop: 10,
    },
    accountInfo: {
        alignItems: "center",
        width: "100%",
    },
    emailText: {
        fontWeight: "500",
        marginTop: 4,
    },
    logoutButton: {
        marginTop: 20,
        borderRadius: 28,
        width: "100%",
    },
    logoutButtonContent: {
        height: 56,
    },
});
