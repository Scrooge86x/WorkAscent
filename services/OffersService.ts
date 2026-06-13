import type { Location } from "@/models/Location";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
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
    salaryUnspecified?: boolean;
    salaryMin?: string;
    salaryMax?: string;
    location?: Location;
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
        const constraints: any[] = [];

        if (options?.userId) constraints.push(where("userId", "==", options.userId));
        if (options?.remote === true) constraints.push(where("remote", "==", options.remote));

        const hasTagFilter = !!(options?.tags && options.tags.trim() !== "");
        if (hasTagFilter) {
            const searchTag = options!.tags!.trim();
            constraints.push(where("tags", ">=", searchTag));
            constraints.push(where("tags", "<=", searchTag + "\uf8ff"));
            constraints.push(orderBy("tags"));
        } else if (options?.sortBy) {
            constraints.push(orderBy(options.sortBy, options.sortOrder || "asc"));
        }

        const snapshot = await getDocs(query(this.offersCollection, ...constraints));

        let results = snapshot.docs.map((doc) => ({
            offer: mapDocToOffer(doc),
            id: doc.id,
            createdAt: (doc.data() as any).createdAt || "",
        }));

        if (options?.location) {
            const { country, region, city } = options.location;
            results = results.filter(({ offer }) => {
                if (country && offer.location?.country !== country) return false;
                if (region && offer.location?.region !== region) return false;
                if (city && offer.location?.city !== city) return false;
                return true;
            });
        }

        const hasSalaryMin = options?.salaryMin !== undefined;
        const hasSalaryMax = options?.salaryMax !== undefined;

        if (hasSalaryMin || hasSalaryMax || options?.salaryUnspecified !== undefined) {
            let salaryMinNum = hasSalaryMin ? parseFloat(options!.salaryMin!) : undefined;
            let salaryMaxNum = hasSalaryMax ? parseFloat(options!.salaryMax!) : undefined;

            if (!hasSalaryMin) {
                salaryMinNum =
                    !options?.salaryUnspecified && options?.salaryUnspecified !== undefined ? 1 : 0;
            }

            results = results.filter(({ offer }) => {
                const offerSalary =
                    typeof offer.salary === "string" ? parseFloat(offer.salary) : offer.salary;

                // If document doesn't have a valid salary
                if (
                    offerSalary === undefined ||
                    offerSalary === null ||
                    Number.isNaN(offerSalary)
                ) {
                    return options?.salaryUnspecified === true;
                }

                if (salaryMinNum !== undefined && offerSalary < salaryMinNum) return false;
                if (salaryMaxNum !== undefined && offerSalary > salaryMaxNum) return false;
                return true;
            });
        }

        if (options?.sortBy) {
            const sortBy = options.sortBy;
            const isDesc = options.sortOrder === "desc";

            results.sort((a, b) => {
                let valA: any;
                let valB: any;

                if (sortBy === "createdAt") {
                    valA = a.createdAt;
                    valB = b.createdAt;
                } else {
                    valA = a.offer[sortBy];
                    valB = b.offer[sortBy];
                }

                if (typeof valA === "string") valA = valA.toLowerCase();
                if (typeof valB === "string") valB = valB.toLowerCase();

                if (valA < valB) return isDesc ? 1 : -1;
                if (valA > valB) return isDesc ? -1 : 1;
                return 0;
            });
        }

        if (options?.maxResults) {
            results = results.slice(0, options.maxResults);
        }

        return results.map(({ offer, id }) => ({ offer, id }));
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
