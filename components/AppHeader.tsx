import { getHeaderTitle } from "@react-navigation/elements";
import { View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { UserMenu } from "./UserMenu";

export const AppHeader = ({ navigation, route, options, back }: any) => {
    const theme = useTheme();
    const title = getHeaderTitle(options, route.name);

    return (
        <Appbar.Header
            style={{ backgroundColor: theme.colors.background, justifyContent: "space-between" }}
            elevated={false}
        >
            <View style={{ width: 50, alignItems: "flex-start" }}>
                {options.headerLeft ? (
                    options.headerLeft()
                ) : back ? (
                    <Appbar.BackAction onPress={navigation.goBack} />
                ) : null}
            </View>

            <Appbar.Content
                title="WorkAscent"
                titleStyle={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: theme.colors.onBackground,
                }}
            />

            <View style={{ width: 50, alignItems: "flex-end" }}>
                <UserMenu />
            </View>
        </Appbar.Header>
    );
};
