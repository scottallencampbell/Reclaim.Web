import { Guid } from "typescript-guid";

export class Customer {
    public emailAddress: string;
    public internalID: string;
    public code: string;
    public name: string;
    public address: string;
    public address2?: string;
    public city: string;
    public state: string; 
    public postalCode: string;
    public telephone: string;
    public uniqueID: Guid;    
    public lastActiveTimestamp: Date | null;
}

