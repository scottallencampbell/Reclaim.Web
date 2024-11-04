export abstract class ApiBase {
    protected transformOptions(options: RequestInit) {
       options.credentials = "include";
 
       return Promise.resolve(options);
    }
 }
