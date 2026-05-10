import { Offer } from '@/models/Offer';
import { useRouter } from "expo-router";
import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from "react-native-paper";


interface OfferItemProps {
    item: Offer;
}

export const OfferItem = memo(({ item }: OfferItemProps) => {
    const router = useRouter();
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const handlePress = () => {
        router.push({
            pathname: '/offer-details'
        });
    };

    const locationDisplay = item.remote ? "Remote" : `${item.location?.city}, ${item.location?.region}, ${item.location?.country}`;

    return (
        <Pressable onPress={handlePress}>
            <View style={styles.card}>
                <Text variant="headlineSmall" style={styles.title}>{item.title}</Text>
                <Text variant="bodyMedium" style={styles.info}>{`${item.salary}zł • ${item.tags}`}</Text>
                <Text variant="bodyMedium" style={styles.subtitleInfo}>{item.companyName}</Text>
                <Text variant="bodyMedium" style={styles.subtitleInfo}>{locationDisplay}</Text>
                <Divider bold={true} style={styles.separator}/>
            </View>
        </Pressable>
    );
});

const createStyles = (theme: any) =>
    StyleSheet.create({
        card: {
            flex: 1,
            paddingVertical: 12,
        },
        separator: {
            marginTop: 12,
        },
        title: {
            marginBottom: 8,
            color: theme.colors.onBackground,
        },
        info: {
            marginBottom: 2,
            color: theme.colors.onBackground,
        },
        subtitleInfo: {
            marginBottom: 2,
            color: theme.colors.onSurfaceVariant,
        },
    });