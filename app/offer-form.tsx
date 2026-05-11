import ErrorPopup from "@/components/ErrorPopup";
import { Offer } from "@/models/Offer";
import { auth } from "@/services/FirebaseConfig";
import { offersService } from "@/services/OffersService";
import * as Network from "expo-network";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    Checkbox,
    Divider,
    HelperText,
    Text,
    TextInput,
    useTheme,
} from "react-native-paper";

type OfferFormErrors = {
    title?: string;
    description?: string;
    city?: string;
    region?: string;
    country?: string;
    salary?: string;
    email?: string;
    companyName?: string;
};

export default function OfferFormScreen() {
    const params: { id: string } = useLocalSearchParams<{ id: string } & any>();
    const [user] = useAuthState(auth);
    const router = useRouter();
    const theme = useTheme();
    const { t } = useTranslation();

    const [offer, setOffer] = useState<Offer | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<OfferFormErrors>({});
    const [remote, setRemote] = useState(true);
    const [salaryUnspecified, setSalaryUnspecified] = useState(false);

    const styles = useMemo(() => createStyles(theme), [theme]);

    const creatingNewOffer = !params.id;

    // TODO: Lepsza walidacja
    const validateData = useCallback(
        (values: any) => {
            const errors: OfferFormErrors = {};
            if (!values.title) {
                errors.title = t("offerForm.validation.titleRequired", "Title is required");
            }
            if (values.description.length > 500) {
                errors.description = t(
                    "offerForm.validation.descriptionRequired",
                    "Description cannot be over 500 characters long",
                );
            }
            if (remote && !values.city) {
                errors.city = t(
                    "offerForm.validation.cityRequired",
                    "City is required for non-remote offers",
                );
            }
            if (remote && !values.region) {
                errors.region = t(
                    "offerForm.validation.regionRequired",
                    "Region is required for non-remote offers",
                );
            }
            if (remote && !values.country) {
                errors.country = t(
                    "offerForm.validation.countryRequired",
                    "Country is required for non-remote offers",
                );
            }
            if (salaryUnspecified && (!values.salary || values.salary <= 0)) {
                errors.salary = t(
                    "offerForm.validation.salaryRequired",
                    "Salary needs to be greater than 0 unless marked as for negotiation",
                );
            }
            if (!values.email) {
                errors.email = t("offerForm.validation.emailRequired", "Email is required");
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = t("offerForm.validation.emailInvalid", "Email is invalid");
            }
            if (!values.companyName) {
                errors.companyName = t(
                    "offerForm.validation.companyNameRequired",
                    "Company name is required",
                );
            }
            setValidationErrors(errors);
            return Object.keys(errors).length === 0;
        },
        [remote, salaryUnspecified],
    );

    const handleEdit = useCallback(
        async (values: any, { setSubmitting }: any) => {
            setSubmitting(true);
            if (!validateData(values)) {
                setSubmitting(false);
                setError(
                    t(
                        "offerForm.validationError",
                        "Please fix validation errors before submitting",
                    ),
                );
                return;
            }

            if (remote) {
                values.city = "";
                values.region = "";
                values.country = "";
            }

            if (salaryUnspecified) {
                values.salary = 0;
            }

            const newOffer: Offer = {
                userId: offer?.userId || user?.uid || "",
                title: values.title,
                companyName: values.companyName,
                description: values.description,
                location: {
                    city: values.city,
                    region: values.region,
                    country: values.country,
                },
                remote: remote,
                tags: "", // TODO: tagi
                salary: parseInt(values.salary),
                email: values.email,
                phoneNumber: values.phone,
            };

            console.log(newOffer);

            try {
                if (creatingNewOffer) {
                    //await offersService.addOffer(newOffer);
                } else {
                    // TODO
                }
                router.back();
            } catch (error) {
                setError(t("offerForm.saveError", "Failed to save offer"));
            } finally {
                setSubmitting(false);
            }
        },
        [creatingNewOffer, params.id, router],
    );

    const fetchOfferDetails = useCallback(async () => {
        const networkStatus = await Network.getNetworkStateAsync();

        if (!networkStatus.isConnected) {
            setError(t("noConnection", "No internet connection"));
            return;
        }

        try {
            const offer = await offersService.getOffer(params.id);
            setOffer(offer);
            setRemote(offer?.remote || false);
            setSalaryUnspecified(offer?.salary === 0);
            setError(null);
        } catch (error) {
            setOffer(null);
            setError(t("offerForm.fetchError", "Failed to fetch offer details"));
        }
    }, [params.id]);

    useEffect(() => {
        if (!creatingNewOffer) {
            fetchOfferDetails();
        }
    }, []);

    if (offer === null && !creatingNewOffer) {
        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true} style={{ flex: 1 }} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <ErrorPopup message={error} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <Stack.Screen />

                    <Text variant="headlineSmall" style={styles.title}>
                        {creatingNewOffer
                            ? t("offerForm.creator", "Offer Creator")
                            : t("offerForm.editor", "Offer Editor")}
                    </Text>

                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            title: offer?.title || "",
                            city: offer?.location?.city || "",
                            region: offer?.location?.region || "",
                            country: offer?.location?.country || "",
                            salary: offer?.salary?.toString() || "",
                            description: offer?.description || "",
                            email: offer?.email || "",
                            phone: offer?.phoneNumber || "",
                            companyName: offer?.companyName || "",
                        }}
                        onSubmit={handleEdit}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            values,
                            isSubmitting,
                        }) => (
                            <View style={styles.form}>
                                <Text variant="bodyMedium" style={styles.subtitle}>
                                    {t("offerForm.titleAndDescription", "Title and description")}
                                </Text>

                                {validationErrors.title && (
                                    <HelperText type="error">{validationErrors.title}</HelperText>
                                )}
                                <TextInput
                                    mode="outlined"
                                    label={t("offerForm.titleLabel", "Title")}
                                    value={values.title}
                                    onChangeText={handleChange("title")}
                                    onBlur={handleBlur("title")}
                                    style={styles.input}
                                    disabled={isSubmitting}
                                />

                                {validationErrors.description && (
                                    <HelperText type="error">
                                        {validationErrors.description}
                                    </HelperText>
                                )}
                                <TextInput
                                    mode="outlined"
                                    label={t("offerForm.descriptionLabel", "Description")}
                                    value={values.description}
                                    onChangeText={handleChange("description")}
                                    onBlur={handleBlur("description")}
                                    style={styles.input}
                                    disabled={isSubmitting}
                                    multiline
                                    numberOfLines={4}
                                />

                                <Divider bold={true} style={styles.separator} />
                                <Text variant="bodyMedium" style={styles.subtitle}>
                                    {t("offerForm.location", "Location")}
                                </Text>

                                {validationErrors.city && (
                                    <HelperText type="error">{validationErrors.city}</HelperText>
                                )}
                                <TextInput
                                    mode="outlined"
                                    label={t("offerForm.cityLabel", "City")}
                                    value={values.city}
                                    onChangeText={handleChange("city")}
                                    onBlur={handleBlur("city")}
                                    style={styles.input}
                                    disabled={isSubmitting || remote}
                                />

                                {validationErrors.region && (
                                    <HelperText type="error">{validationErrors.region}</HelperText>
                                )}
                                <TextInput
                                    mode="outlined"
                                    label={t("offerForm.regionLabel", "Region")}
                                    value={values.region}
                                    onChangeText={handleChange("region")}
                                    onBlur={handleBlur("region")}
                                    style={styles.input}
                                    disabled={isSubmitting || remote}
                                />

                                {validationErrors.country && (
                                    <HelperText type="error">{validationErrors.country}</HelperText>
                                )}
                                <TextInput
                                    mode="outlined"
                                    label={t("offerForm.countryLabel", "Country")}
                                    value={values.country}
                                    onChangeText={handleChange("country")}
                                    onBlur={handleBlur("country")}
                                    style={styles.input}
                                    disabled={isSubmitting || remote}
                                />

                                <View style={styles.row}>
                                    <Text
                                        variant="bodyMedium"
                                        style={{ color: theme.colors.onSurfaceVariant }}
                                    >
                                        {t("offerForm.remote", "Remote")}
                                    </Text>
                                    <Checkbox
                                        status={remote ? "checked" : "unchecked"}
                                        onPress={() => {
                                            setRemote(!remote);
                                        }}
                                    />
                                </View>

                                <Divider bold={true} style={styles.separator} />
                                <Text variant="bodyMedium" style={styles.subtitle}>
                                    {t("offerForm.salaryAndTags", "Salary and Tags")}
                                </Text>

                                {validationErrors.salary && (
                                    <HelperText type="error">{validationErrors.salary}</HelperText>
                                )}
                                <TextInput
                                    mode="outlined"
                                    label={t("offerForm.salaryLabel", "Salary (PLN)")}
                                    value={values.salary}
                                    onChangeText={(val) => {
                                        const numericValue = val.replace(/[^0-9]/g, "");
                                        setFieldValue("salary", numericValue);
                                    }}
                                    onBlur={handleBlur("salary")}
                                    keyboardType="decimal-pad"
                                    style={styles.input}
                                    disabled={isSubmitting || salaryUnspecified}
                                />

                                <View style={styles.row}>
                                    <Text
                                        variant="bodyMedium"
                                        style={{ color: theme.colors.onSurfaceVariant }}
                                    >
                                        {t("offerForm.salaryForNegotiation", "For negotiation")}
                                    </Text>
                                    <Checkbox
                                        status={salaryUnspecified ? "checked" : "unchecked"}
                                        onPress={() => {
                                            setSalaryUnspecified(!salaryUnspecified);
                                        }}
                                    />
                                </View>

                                <Divider bold={true} style={styles.separator} />
                                <Text variant="bodyMedium" style={styles.subtitle}>
                                    {t("offerForm.contact", "Contact information")}
                                </Text>

                                {validationErrors.email && (
                                    <HelperText type="error">{validationErrors.email}</HelperText>
                                )}
                                <TextInput
                                    mode="outlined"
                                    label={t("offerForm.emailLabel", "Email")}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.input}
                                    disabled={isSubmitting}
                                />

                                {validationErrors.companyName && (
                                    <HelperText type="error">
                                        {validationErrors.companyName}
                                    </HelperText>
                                )}
                                <TextInput
                                    mode="outlined"
                                    label={t("offerForm.companyNameLabel", "Company name")}
                                    value={values.companyName}
                                    onChangeText={handleChange("companyName")}
                                    onBlur={handleBlur("companyName")}
                                    autoCapitalize="none"
                                    style={styles.input}
                                    disabled={isSubmitting}
                                />

                                <TextInput
                                    mode="outlined"
                                    label={t("offerForm.phoneLabel", "Phone number")}
                                    value={values.phone}
                                    onChangeText={(val) => {
                                        const numericValue = val.replace(/[^0-9\-\+]/g, "");
                                        setFieldValue("phone", numericValue);
                                    }}
                                    onBlur={handleBlur("phone")}
                                    keyboardType="phone-pad"
                                    style={styles.input}
                                    disabled={isSubmitting}
                                />

                                <Button
                                    mode="contained"
                                    onPress={handleSubmit as any}
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    style={styles.button}
                                    contentStyle={styles.buttonContent}
                                >
                                    {creatingNewOffer
                                        ? t("offerForm.createButton", "Create Offer")
                                        : t("offerForm.saveButton", "Save Offer")}
                                </Button>
                            </View>
                        )}
                    </Formik>
                </View>
            </TouchableWithoutFeedback>
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
            marginVertical: 26,
            borderRadius: 28,
        },
        buttonContent: {
            height: 56,
        },
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
        },
    });
