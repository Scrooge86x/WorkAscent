import { compactParams, parseSearchBoolean, parseSearchParam } from "@/hooks/search-params-helpers";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import {
    Button,
    Checkbox,
    Divider,
    HelperText,
    List,
    SegmentedButtons,
    Text,
    TextInput,
    useTheme,
} from "react-native-paper";

export default function OfferFilterScreen() {
    const theme = useTheme();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const router = useRouter();
    const params = useLocalSearchParams<any>();

    const [tagInput, setTagInput] = useState("");

    const initialValues = useMemo(
        () => ({
            title: parseSearchParam(params.title) ?? "",
            city: parseSearchParam(params.city) ?? "",
            region: parseSearchParam(params.region) ?? "",
            country: parseSearchParam(params.country) ?? "",
            salaryMin: parseSearchParam(params.salaryMin) ?? "",
            salaryMax: parseSearchParam(params.salaryMax) ?? "",
            tags: parseSearchParam(params.tags) ?? "",
            remote: parseSearchBoolean(params.remote) ?? false,
            salaryUnspecified: parseSearchBoolean(params.salaryUnspecified) ?? false,
            sortBy: parseSearchParam(params.sortBy) ?? "createdAt",
            sortOrder: parseSearchParam(params.sortOrder) ?? "asc",
        }),
        [
            params.title,
            params.city,
            params.region,
            params.country,
            params.salaryMin,
            params.salaryMax,
            params.tags,
            params.remote,
            params.salaryUnspecified,
            params.sortBy,
            params.sortOrder,
        ],
    );

    const validateFiltering = useCallback(
        (values: any) => {
            const errors: Record<string, string> = {};

            if (values.salaryMin && values.salaryMax) {
                const salaryMin = parseInt(values.salaryMin, 10);
                const salaryMax = parseInt(values.salaryMax, 10);

                if (
                    !Number.isNaN(salaryMin) &&
                    !Number.isNaN(salaryMax) &&
                    salaryMin >= salaryMax
                ) {
                    errors.salaryMax = t(
                        "offerForm.validation.salaryRange",
                        "Maximum salary must be greater than minimum salary",
                    );
                }
            }

            return errors;
        },
        [t],
    );

    const handleFiltering = useCallback(
        (values: any) => {
            const params = compactParams({
                sortBy: values.sortBy,
                sortOrder: values.sortOrder,
                remote: String(values.remote),
                salaryUnspecified: String(values.salaryUnspecified),
                city: values.city,
                region: values.region,
                country: values.country,
                tags: values.tags,
                salaryMin: values.salaryMin,
                salaryMax: values.salaryMax,
            });

            router.replace({
                pathname: "/",
                params,
            });
        },
        [router],
    );

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <Stack.Screen />

                        <Text variant="headlineSmall" style={styles.title}>
                            {t("offerForm.criteria", "Search Criteria")}
                        </Text>

                        <Formik
                            enableReinitialize={true}
                            validate={validateFiltering}
                            initialValues={initialValues}
                            onSubmit={handleFiltering}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                resetForm,
                                setFieldValue,
                                values,
                            }) => (
                                <View style={styles.form}>
                                    <Text variant="bodyMedium" style={styles.subtitle}>
                                        {t("offerForm.location", "Location")}
                                    </Text>

                                    <TextInput
                                        mode="outlined"
                                        label={t("offerForm.cityLabel", "City")}
                                        value={values.city}
                                        onChangeText={handleChange("city")}
                                        onBlur={handleBlur("city")}
                                        style={styles.input}
                                        disabled={values.remote}
                                    />

                                    <TextInput
                                        mode="outlined"
                                        label={t("offerForm.regionLabel", "Region")}
                                        value={values.region}
                                        onChangeText={handleChange("region")}
                                        onBlur={handleBlur("region")}
                                        style={styles.input}
                                        disabled={values.remote}
                                    />

                                    <TextInput
                                        mode="outlined"
                                        label={t("offerForm.countryLabel", "Country")}
                                        value={values.country}
                                        onChangeText={handleChange("country")}
                                        onBlur={handleBlur("country")}
                                        style={styles.input}
                                        disabled={values.remote}
                                    />

                                    <View style={styles.row}>
                                        <Text
                                            variant="bodyMedium"
                                            style={{ color: theme.colors.onSurfaceVariant }}
                                        >
                                            {t("offerForm.onlyRemote", "Show only remote offers")}
                                        </Text>
                                        <Checkbox
                                            status={values.remote ? "checked" : "unchecked"}
                                            onPress={() => {
                                                setFieldValue("remote", !values.remote);
                                            }}
                                        />
                                    </View>

                                    <Divider bold={true} style={styles.separator} />
                                    <Text variant="bodyMedium" style={styles.subtitle}>
                                        {t("offerForm.salaryAndTags", "Salary and Tags")}
                                    </Text>

                                    <TextInput
                                        mode="outlined"
                                        label={t("offerForm.salaryLabelFrom", "Salary from (PLN)")}
                                        value={values.salaryMin}
                                        onChangeText={(val) => {
                                            const numericValue = val.replace(/[^0-9]/g, "");
                                            setFieldValue("salaryMin", numericValue);
                                        }}
                                        onBlur={handleBlur("salaryMin")}
                                        keyboardType="decimal-pad"
                                        style={styles.input}
                                    />

                                    <TextInput
                                        mode="outlined"
                                        label={t("offerForm.salaryLabelTo", "Salary to (PLN)")}
                                        value={values.salaryMax}
                                        onChangeText={(val) => {
                                            const numericValue = val.replace(/[^0-9]/g, "");
                                            setFieldValue("salaryMax", numericValue);
                                        }}
                                        onBlur={handleBlur("salaryMax")}
                                        keyboardType="decimal-pad"
                                        style={styles.input}
                                    />

                                    {values.salaryMin && values.salaryMax && (
                                        <HelperText type="error" visible={true}>
                                            {values.salaryMin >= values.salaryMax
                                                ? t(
                                                      "offerForm.validation.salaryRange",
                                                      "Maximum salary must be greater than minimum salary",
                                                  )
                                                : ""}
                                        </HelperText>
                                    )}

                                    <View style={styles.row}>
                                        <Text
                                            variant="bodyMedium"
                                            style={{ color: theme.colors.onSurfaceVariant }}
                                        >
                                            {t(
                                                "offerForm.allowSalaryForNegotiation",
                                                "Allow unspecified salary",
                                            )}
                                        </Text>
                                        <Checkbox
                                            status={
                                                values.salaryUnspecified ? "checked" : "unchecked"
                                            }
                                            onPress={() => {
                                                setFieldValue(
                                                    "salaryUnspecified",
                                                    !values.salaryUnspecified,
                                                );
                                            }}
                                        />
                                    </View>
                                    <Divider bold style={styles.separator} />

                                    <List.AccordionGroup expandedId="tags-accordion">
                                        <List.Accordion
                                            id="tags-accordion"
                                            title={t("offerForm.tagsTitle", "Tags")}
                                            left={(props) => (
                                                <List.Icon {...props} icon="label-outline" />
                                            )}
                                            style={styles.accordion}
                                        >
                                            <View style={styles.tagList}>
                                                {values.tags
                                                    .split(", ")
                                                    .filter((t) => t !== "")
                                                    .map((tag, index) => (
                                                        <Button
                                                            key={`${tag}-${index}`}
                                                            mode="outlined"
                                                            onPress={() => {
                                                                const newTags = values.tags
                                                                    .split(", ")
                                                                    .filter((t) => t !== tag)
                                                                    .join(", ");
                                                                setFieldValue("tags", newTags);
                                                            }}
                                                            icon="close"
                                                            style={styles.tagChip}
                                                            compact
                                                        >
                                                            {tag}
                                                        </Button>
                                                    ))}
                                            </View>
                                        </List.Accordion>
                                    </List.AccordionGroup>

                                    <View style={styles.tagInputRow}>
                                        <TextInput
                                            mode="outlined"
                                            label={t("offerForm.addTagLabel", "New tag")}
                                            value={tagInput}
                                            onChangeText={setTagInput}
                                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                        />
                                        <Button
                                            mode="contained-tonal"
                                            style={styles.addTagButton}
                                            disabled={!tagInput.trim()}
                                            onPress={() => {
                                                const trimmed = tagInput.trim().toLowerCase();
                                                const currentArray = values.tags
                                                    .split(", ")
                                                    .filter((t) => t !== "");
                                                if (trimmed && !currentArray.includes(trimmed)) {
                                                    const newTags = values.tags
                                                        ? `${values.tags}, ${trimmed}`
                                                        : trimmed;
                                                    setFieldValue("tags", newTags);
                                                    setTagInput("");
                                                }
                                            }}
                                        >
                                            {t("offerForm.addTagButton", "Add")}
                                        </Button>
                                    </View>

                                    <Divider bold style={styles.separator} />

                                    <Text variant="bodyMedium" style={styles.subtitle}>
                                        {t("offerForm.sortByTitle", "Sort By")}
                                    </Text>

                                    <View style={styles.checkboxGroup}>
                                        <List.Item
                                            title={t("offerForm.creationDate", "Creation date")}
                                            right={() => (
                                                <Checkbox
                                                    status={
                                                        values.sortBy === "createdAt"
                                                            ? "checked"
                                                            : "unchecked"
                                                    }
                                                    onPress={() =>
                                                        setFieldValue("sortBy", "createdAt")
                                                    }
                                                />
                                            )}
                                            style={styles.checkboxItem}
                                        />
                                        <List.Item
                                            title={t("offerForm.salary", "Salary")}
                                            right={() => (
                                                <Checkbox
                                                    status={
                                                        values.sortBy === "salary"
                                                            ? "checked"
                                                            : "unchecked"
                                                    }
                                                    onPress={() =>
                                                        setFieldValue("sortBy", "salary")
                                                    }
                                                />
                                            )}
                                            style={styles.checkboxItem}
                                        />
                                        <List.Item
                                            title={t("offerForm.titleSort", "Title")}
                                            right={() => (
                                                <Checkbox
                                                    status={
                                                        values.sortBy === "title"
                                                            ? "checked"
                                                            : "unchecked"
                                                    }
                                                    onPress={() => setFieldValue("sortBy", "title")}
                                                />
                                            )}
                                            style={styles.checkboxItem}
                                        />
                                    </View>

                                    <SegmentedButtons
                                        value={values.sortOrder}
                                        onValueChange={(value) => setFieldValue("sortOrder", value)}
                                        style={styles.segmentedButtons}
                                        buttons={[
                                            {
                                                value: "asc",
                                                label: t("offerForm.ascending", "Ascending"),
                                                icon: "sort-ascending",
                                            },
                                            {
                                                value: "desc",
                                                label: t("offerForm.descending", "Descending"),
                                                icon: "sort-descending",
                                            },
                                        ]}
                                    />

                                    <Button
                                        mode="outlined"
                                        onPress={() => {
                                            resetForm({
                                                values: {
                                                    title: "",
                                                    city: "",
                                                    region: "",
                                                    country: "",
                                                    salaryMin: "",
                                                    salaryMax: "",
                                                    tags: "",
                                                    remote: false,
                                                    salaryUnspecified: false,
                                                    sortBy: "createdAt",
                                                    sortOrder: "asc",
                                                },
                                            });
                                            setTagInput("");
                                            router.replace({ pathname: "/" });
                                        }}
                                        style={styles.button}
                                    >
                                        {t("offerForm.resetFiltersButton", "Reset filters")}
                                    </Button>

                                    <Button
                                        mode="contained"
                                        onPress={handleSubmit as any}
                                        style={styles.button}
                                    >
                                        {t("offerForm.searchButton", "Search")}
                                    </Button>
                                </View>
                            )}
                        </Formik>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const createStyles = (theme: any) =>
    StyleSheet.create({
        keyboardAvoidingContainer: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
        },
        innerContainer: {
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingBottom: 24,
        },
        title: {
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 8,
            color: theme.colors.onBackground,
        },
        subtitle: {
            textAlign: "center",
            marginBottom: 8,
            color: theme.colors.onBackground,
        },
        separator: {
            marginVertical: 12,
        },
        form: {
            width: "100%",
        },
        input: {
            marginBottom: 4,
            backgroundColor: "transparent",
        },
        button: {
            marginHorizontal: 18,
            marginVertical: 8,
            padding: 8,
            borderRadius: 90,
        },
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
        },
        accordion: {
            backgroundColor: "transparent",
            paddingHorizontal: 0,
        },
        tagList: {
            flexDirection: "row",
            flexWrap: "wrap",
            paddingVertical: 10,
            paddingLeft: 10,
        },
        tagChip: {
            margin: 4,
            borderRadius: 8,
        },
        noTagsText: {
            fontStyle: "italic",
            color: theme.colors.outline,
            paddingLeft: 12,
        },
        tagInputRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
            gap: 8,
        },
        addTagButton: {
            height: 50,
            marginTop: 4,
            justifyContent: "center",
            borderRadius: 4,
        },
        checkboxGroup: {
            marginBottom: 16,
        },
        checkboxItem: {
            paddingVertical: 4,
            paddingHorizontal: 0,
        },
        segmentedButtons: {
            marginTop: 8,
            marginBottom: 16,
        },
    });
