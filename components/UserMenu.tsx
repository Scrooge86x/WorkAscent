import { authService } from "@/services/AuthService";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Divider, IconButton, Menu, Text, useTheme } from "react-native-paper";

export const UserMenu = () => {
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const theme = useTheme();
    const { t } = useTranslation();

    const user = authService.getCurrentFirebaseUser();
    const isLoggedIn = !!user;

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleAction = (route: string, action?: () => void) => {
        closeMenu();
        if (action) {
            action();
        } else {
            router.push(route as any);
        }
    };

    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
                <IconButton
                    icon="account-circle"
                    iconColor={theme.colors.primary}
                    size={30}
                    onPress={openMenu}
                />
            }
            contentStyle={{ backgroundColor: theme.colors.elevation.level2, borderRadius: 12 }}
        >
            {isLoggedIn ? (
                <>
                    <View style={{ padding: 12 }}>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {t("menu.loggedInAs", "Logged in as:")}
                        </Text>
                        <Text variant="bodyMedium" numberOfLines={1}>
                            {user.email}
                        </Text>
                    </View>
                    <Divider />
                    <Menu.Item
                        onPress={() => handleAction("/offers/new")}
                        title={t("menu.newOffer", "Create new offer")}
                        leadingIcon="plus"
                    />
                    <Menu.Item
                        onPress={() => handleAction("/offers/my")}
                        title={t("menu.myOffers", "My offers")}
                        leadingIcon="format-list-bulleted"
                    />
                    <Menu.Item
                        onPress={() => handleAction("/settings")}
                        title={t("menu.settings", "Settings")}
                        leadingIcon="cog"
                    />
                    <Divider />
                    <Menu.Item
                        onPress={() => handleAction("/", () => authService.logout())}
                        title={t("menu.logout", "Log out")}
                        titleStyle={{ color: theme.colors.error }}
                        leadingIcon="logout"
                    />
                </>
            ) : (
                <>
                    <Menu.Item
                        onPress={() => handleAction("/settings")}
                        title={t("menu.settings", "Settings")}
                        leadingIcon="cog"
                    />
                    <Menu.Item
                        onPress={() => handleAction("/login")}
                        title={t("menu.signIn", "Sign in")}
                        leadingIcon="login"
                    />
                </>
            )}
        </Menu>
    );
};
