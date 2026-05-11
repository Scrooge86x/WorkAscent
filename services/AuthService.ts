import {
    User as FirebaseUser,
    UserCredential,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";

import i18n from "../i18n/i18n";
import { auth } from "./FirebaseConfig";

import type { User, UserRole } from "../models/User";
import { userService } from "./UserService";

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role: UserRole;
}

export interface LoginData {
    email: string;
    password: string;
}

class AuthService {
    async register({
        email,
        password,
        name,
        role = "user",
    }: RegisterData): Promise<UserCredential> {
        let firebaseUser: FirebaseUser | null = null;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            firebaseUser = userCredential.user;

            if (name) {
                await updateProfile(firebaseUser, { displayName: name });
            }

            const userData: User = {
                userId: firebaseUser.uid,
                name: name,
                email: email,
                role: role,
            };

            await userService.addUser(userData);

            return userCredential;
        } catch (error: any) {
            if (firebaseUser) {
                try {
                    await firebaseUser.delete();
                } catch (deleteError) {
                    this.handleAuthError("rollbackError");
                }
            }
            this.handleAuthError(error);
            throw error;
        }
    }

    async login({ email, password }: LoginData): Promise<UserCredential> {
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            this.handleAuthError(error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        await signOut(auth);
    }

    async resetPassword(email: string): Promise<void> {
        await sendPasswordResetEmail(auth, email);
    }

    getCurrentFirebaseUser(): FirebaseUser | null {
        return auth.currentUser;
    }

    onAuthStateChange(callback: (firebaseUser: FirebaseUser | null) => void): () => void {
        return onAuthStateChanged(auth, callback);
    }

    async updateUserProfile(profile: { name: string }): Promise<void> {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Użytkownik nie jest zalogowany");
        }

        await updateProfile(user, {
            displayName: profile.name,
        });
    }

    private handleAuthError(error: any): void {
        let errorMessage: string = "An unexpected error occurred";

        switch (error.code) {
            case "auth/email-already-in-use":
                errorMessage = i18n.t("auth.errors.emailAlreadyInUse");
                break;
            case "auth/invalid-email":
                errorMessage = i18n.t("auth.errors.invalidEmail");
                break;
            case "auth/user-not-found":
            case "auth/wrong-password":
                errorMessage = i18n.t("auth.errors.userNotFound");
                break;
            case "auth/weak-password":
                errorMessage = i18n.t("auth.errors.weakPassword");
                break;
            case "auth/too-many-requests":
                errorMessage = i18n.t("auth.errors.tooManyRequests");
                break;
            case "rollbackError":
                errorMessage = i18n.t("auth.errors.rollbackError");
                break;
            default:
                errorMessage = error.message || errorMessage;
        }

        const message = `${i18n.t("auth.errors.title")}, ${error.code}, ${errorMessage}`;

        throw new Error(message);
    }
}

export const authService = new AuthService();
export default authService;
