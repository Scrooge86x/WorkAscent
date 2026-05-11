import { authService } from "@/services/AuthService";
import { Stack, useRouter } from "expo-router";
import { Formik } from "formik";
import { useMemo, useState } from "react";
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
import { Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";
import * as Yup from "yup";

interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterScreen() {
    const router = useRouter();
    const theme = useTheme();
    const { t } = useTranslation();

    const RegisterSchema = Yup.object().shape({
        email: Yup.string()
            .email(t("auth.validation.invalidEmail", "Invalid email"))
            .required(t("auth.validation.emailRequired", "Required")),
        name: Yup.string()
            .min(2, t("auth.validation.nameTooShort", "Too short"))
            .required(t("auth.validation.nameRequired", "Required")),
        password: Yup.string()
            .min(6, t("auth.validation.passwordTooShort", "Min 6 characters"))
            .required(t("auth.validation.passwordRequired", "Required")),
        confirmPassword: Yup.string()
            .oneOf(
                [Yup.ref("password")],
                t("auth.validation.passwordsMustMatch", "Passwords must match"),
            )
            .required(t("auth.validation.confirmRequired", "Required")),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [globalError, setGlobalError] = useState("");

    const togglePassword = () => setShowPassword(!showPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const goBack = () => router.back();

    const handleRegister = async (values: RegisterFormValues, { setSubmitting }: any) => {
        setGlobalError("");
        try {
            await authService.register({
                name: values.name,
                email: values.email,
                password: values.password,
                role: "user",
            });
            router.replace("/");
        } catch (error: any) {
            setGlobalError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Stack.Screen />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text variant="displayMedium" style={styles.title}>
                        {t("register.title", "Register\naccount")}
                    </Text>

                    <View style={styles.errorArea}>
                        {!!globalError && (
                            <HelperText type="error" visible={!!globalError}>
                                {globalError}
                            </HelperText>
                        )}
                    </View>

                    <Formik<RegisterFormValues>
                        initialValues={{
                            name: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                        }}
                        validationSchema={RegisterSchema}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={handleRegister}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                            isSubmitting,
                            submitCount,
                        }) => (
                            <View style={styles.form}>
                                <View>
                                    <TextInput
                                        mode="outlined"
                                        label={t("register.nameLabel", "Name")}
                                        onChangeText={handleChange("name")}
                                        onBlur={handleBlur("name")}
                                        value={values.name}
                                        style={styles.input}
                                        disabled={isSubmitting}
                                        error={(touched.name || submitCount > 0) && !!errors.name}
                                    />
                                    <HelperText
                                        type="error"
                                        visible={(touched.name || submitCount > 0) && !!errors.name}
                                    >
                                        {errors.name}
                                    </HelperText>
                                </View>

                                <View>
                                    <TextInput
                                        mode="outlined"
                                        label={t("register.emailLabel", "E-mail")}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        value={values.email}
                                        style={styles.input}
                                        disabled={isSubmitting}
                                        error={(touched.email || submitCount > 0) && !!errors.email}
                                    />
                                    <HelperText
                                        type="error"
                                        visible={
                                            (touched.email || submitCount > 0) && !!errors.email
                                        }
                                    >
                                        {errors.email}
                                    </HelperText>
                                </View>

                                <View>
                                    <TextInput
                                        mode="outlined"
                                        label={t("register.passwordLabel", "Password")}
                                        secureTextEntry={!showPassword}
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                        value={values.password}
                                        style={styles.input}
                                        disabled={isSubmitting}
                                        error={
                                            (touched.password || submitCount > 0) &&
                                            !!errors.password
                                        }
                                        right={
                                            <TextInput.Icon
                                                icon={showPassword ? "eye-off" : "eye"}
                                                onPress={togglePassword}
                                                forceTextInputFocus={false}
                                            />
                                        }
                                    />
                                    <HelperText
                                        type="error"
                                        visible={
                                            (touched.password || submitCount > 0) &&
                                            !!errors.password
                                        }
                                    >
                                        {errors.password}
                                    </HelperText>
                                </View>

                                <View>
                                    <TextInput
                                        mode="outlined"
                                        label={t("register.repeatPasswordLabel", "Repeat password")}
                                        secureTextEntry={!showConfirmPassword}
                                        onChangeText={handleChange("confirmPassword")}
                                        onBlur={handleBlur("confirmPassword")}
                                        value={values.confirmPassword}
                                        style={styles.input}
                                        disabled={isSubmitting}
                                        error={
                                            (touched.confirmPassword || submitCount > 0) &&
                                            !!errors.confirmPassword
                                        }
                                        right={
                                            <TextInput.Icon
                                                icon={showConfirmPassword ? "eye-off" : "eye"}
                                                onPress={toggleConfirmPassword}
                                                forceTextInputFocus={false}
                                            />
                                        }
                                    />
                                    <HelperText
                                        type="error"
                                        visible={
                                            (touched.confirmPassword || submitCount > 0) &&
                                            !!errors.confirmPassword
                                        }
                                    >
                                        {errors.confirmPassword}
                                    </HelperText>
                                </View>

                                <Button
                                    mode="contained"
                                    onPress={handleSubmit as any}
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    style={styles.button}
                                    contentStyle={styles.buttonContent}
                                >
                                    {t("register.button", "Register")}
                                </Button>
                            </View>
                        )}
                    </Formik>

                    <View style={styles.footer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            {t("register.hasAccount", "Already have an account? ")}
                        </Text>
                        <Text variant="bodyMedium" style={styles.link} onPress={goBack}>
                            {t("register.logInLink", "Log in")}
                        </Text>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 40,
        },
        title: {
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 8,
            color: theme.colors.onBackground,
        },
        errorArea: {
            height: 32,
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
            marginTop: 12,
            borderRadius: 28,
        },
        buttonContent: {
            height: 56,
        },
        footer: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 32,
            alignItems: "center",
        },
        link: {
            fontWeight: "bold",
            textDecorationLine: "underline",
            color: theme.colors.primary,
            marginLeft: 4,
        },
    });
