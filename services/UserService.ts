import {
    collection,
    doc,
    getDoc,
    setDoc
} from 'firebase/firestore';
import { db } from './FirebaseConfig';

import type { User } from '../models/User';

const USERS_COLLECTION = 'users';

class UserService {
    private usersCollection = collection(db, USERS_COLLECTION);

    async addUser(user: User): Promise<void> {
        await setDoc(doc(this.usersCollection, user.userId), user);
    }

    async getUser(userId: string): Promise<User | null> {
        const docSnap = await getDoc(doc(this.usersCollection, userId));
        return docSnap.exists() ? (docSnap.data() as User) : null;
    }
}

export const userService = new UserService();
export default userService;