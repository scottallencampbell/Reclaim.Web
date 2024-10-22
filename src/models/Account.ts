import { Guid } from "typescript-guid";

export class Account {
    public uniqueID: Guid;
    public emailAddress: string;
    public role: string;
    public identityProvider: string;
    public authenticatedTimestamp?: string;  
    public sessionAuthenticatedTimestamp?: string;
    public lastActiveTimestamp?: string;
}
