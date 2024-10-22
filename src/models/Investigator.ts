import { Guid } from "typescript-guid";

export class Investigator {
    public uniqueID: Guid;
    public emailAddress: string;
    public firstName: string;
    public lastName: string;
    public telephone: string;
    public fullName: string;
    public lastActiveTimestamp: Date | null;
}
