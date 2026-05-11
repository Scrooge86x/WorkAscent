import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryDocumentSnapshot,
    updateDoc,
    where,
} from "firebase/firestore";
import type { Offer } from "../models/Offer";
import { db } from "./FirebaseConfig";

const OFFERS_COLLECTION = "offers";

type FirestoreOffer = Omit<Offer, "id"> & {
    createdAt: string;
};

const mapDocToOffer = (doc: QueryDocumentSnapshot): Offer => {
    const data = doc.data() as FirestoreOffer;
    return {
        userId: data.userId,
        title: data.title,
        companyName: data.companyName,
        description: data.description,
        email: data.email,
        phoneNumber: data.phoneNumber,
        salary: data.salary,
        tags: data.tags,
        remote: data.remote,
        location: data.location,
    };
};

export type GetOffersOptions = {
    userId?: string;
    remote?: boolean;
    tags?: string;
    maxResults?: number;
    sortBy?: "createdAt" | "salary" | "title";
    sortOrder?: "asc" | "desc";
};

export type EditOfferData = Partial<Omit<Offer, "userId">> & {
    userId?: string;
};

class OffersService {
    private offersCollection = collection(db, OFFERS_COLLECTION);

    async addOffer(offer: Omit<Offer, "userId"> & { userId: string }): Promise<string> {
        const docRef = await addDoc(this.offersCollection, {
            ...offer,
            createdAt: new Date().toISOString(),
        });
        return docRef.id;
    }

    async getOffer(offerId: string): Promise<Offer | null> {
        const docSnap = await getDoc(doc(this.offersCollection, offerId));
        return docSnap.exists() ? mapDocToOffer(docSnap) : null;
    }

    async getOffers(options?: GetOffersOptions): Promise<{ offer: Offer; id: string }[]> {
        const constraints = [];

        if (options?.userId) constraints.push(where("userId", "==", options.userId));
        if (options?.remote !== undefined) constraints.push(where("remote", "==", options.remote));

        if (options?.tags) {
            constraints.push(where("tags", ">=", options.tags));
            constraints.push(where("tags", "<=", options.tags + "\uf8ff"));
        }

        constraints.push(orderBy(options?.sortBy || "createdAt", options?.sortOrder || "desc"));
        if (options?.maxResults) constraints.push(limit(options?.maxResults));

        const snapshot = await getDocs(query(this.offersCollection, ...constraints));
        return snapshot.docs.map((doc) => ({ offer: mapDocToOffer(doc), id: doc.id }));
    }

    async editOffer(offerId: string, updatedData: EditOfferData): Promise<void> {
        const offerDoc = doc(this.offersCollection, offerId);
        await updateDoc(offerDoc, updatedData);
    }

    async deleteOffer(offerId: string): Promise<void> {
        const offerDoc = doc(this.offersCollection, offerId);
        await deleteDoc(offerDoc);
    }
}

export const offersService = new OffersService();
export default offersService;
