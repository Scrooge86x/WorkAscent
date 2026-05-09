import { authService } from "@/services/AuthService";
import { Stack, useRouter } from "expo-router";
import { Formik } from "formik";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";

export default function LoginScreen() {
    const router = useRouter();
    const theme = useTheme();
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);
    const [globalError, setGlobalError] = useState("");

    const togglePassword = () => setShowPassword(!showPassword);
    const goToSignup = () => router.push("/register");

    const handleLogin = async (values: any, { setSubmitting }: any) => {
        setGlobalError("");
        try {
            await authService.login({ email: values.email, password: values.password });
            router.replace("/");
        } catch (error: any) {
            setGlobalError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={"height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <Stack.Screen />

                    <Text variant="displayMedium" style={styles.title}>
                        {t("login.title", "Sign in")}
                    </Text>

                    <View style={styles.errorArea}>
                        {!!globalError && (
                            <HelperText type="error" visible={!!globalError}>
                                {globalError}
                            </HelperText>
                        )}
                    </View>

                    <Formik initialValues={{ email: "", password: "" }} onSubmit={handleLogin}>
                        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <View style={styles.form}>
                                <TextInput
                                    mode="outlined"
                                    label={t("login.emailLabel", "E-mail")}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.input}
                                    disabled={isSubmitting}
                                />

                                <TextInput
                                    mode="outlined"
                                    label={t("login.passwordLabel", "Password")}
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    secureTextEntry={!showPassword}
                                    style={styles.input}
                                    disabled={isSubmitting}
                                    right={
                                        <TextInput.Icon
                                            icon={showPassword ? "eye-off" : "eye"}
                                            onPress={togglePassword}
                                            forceTextInputFocus={false}
                                        />
                                    }
                                />

                                <Button
                                    mode="contained"
                                    onPress={handleSubmit as any}
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    style={styles.button}
                                    contentStyle={styles.buttonContent}
                                >
                                    {t("login.button", "Login")}
                                </Button>
                            </View>
                        )}
                    </Formik>

                    <View style={styles.footer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            {t("login.noAccount", "Don't have an account? ")}
                        </Text>
                        <Text variant="bodyMedium" style={styles.link} onPress={goToSignup}>
                            {t("login.signUpLink", "Sign up")}
                        </Text>
                    </View>
                </View>
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
