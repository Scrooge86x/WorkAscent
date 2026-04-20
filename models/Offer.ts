export type Offer = {
    userId: string;
    title: string;
    companyName: string;
    description: string;
    email: string;
    phoneNumber: string | null;
    salary: number;
    tags: string;
    remote: boolean;
}