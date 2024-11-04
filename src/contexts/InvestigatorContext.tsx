import { createContext, useContext, useState } from "react"
import jwt from "jwt-decode"
import { ErrorCode } from "helpers/errorcodes"
import { Investigator } from "api/schema";

interface IInvestigatorContext {
  register: (firstName: string, lastName: string, emailAddress: string, password: string, telephone: string) => Promise<Investigator>,
  registerGoogle: (credential: string, nonce: string) => Promise<string>,
  getMe: () => Promise<Investigator>,
  update: (investigator: Investigator) => Promise<Investigator>,
}

export const InvestigatorContext = (): IInvestigatorContext => {
  const {
    register,
    registerGoogle,
    getMe,
    update
  } = useContext(Context);

  return {
    register,
    registerGoogle,
    getMe,
    update
  };
}
    
const Context = createContext({} as IInvestigatorContext);
// const apiClient = new InvestigatorClient();

export function InvestigatorProvider({ children }: { children: any }) {
  
  const register = async (firstName: string, lastName: string, emailAddress: string, telephone: string, password: string): Promise<Investigator> => {
      
    if (password.length == 0) {
      return new Investigator();
      /*  await axiosRequest.post("/investigator/me",
        JSON.stringify({ 
          firstName,
          lastName,         
          emailAddress,
          telephone
        }));  
      */
    }
    else {
      return new Investigator();
      /* await axiosRequest.post("/investigator/me",
        JSON.stringify({ 
          firstName,
          lastName,         
          emailAddress,
          password,
          telephone          
        }));  
      */
    }
  }

  const registerGoogle = async (credential: string, nonce: string): Promise<string> => {
    const item = jwt<any>(credential);
    return "";
    /*
    await axiosRequest.post("/investigator/me",
      JSON.stringify({ 
        firstName: item.given_name,
        lastName: item.family_name,
        emailAddress: item.email,
        telephone: item.telephone,
        googleCredential: credential
      })   
    ).then(async result => {
      if (nonce != item.nonce) {
        throw { response: { data: { errorCode: 2201, errorCodeName: ErrorCode.GoogleJwtNonceInvalid } } };
      }
      return "";
    }
    ).catch(error => { throw error;});
    return ""; 
    */
  }

  const getMe = async (): Promise<Investigator> => {
    return new Investigator(); // await axiosRequest.get("/investigator/me"); 
  }

  const update = async (investigator: Investigator): Promise<Investigator> => {    
    if (investigator.uniqueID != undefined)
      return new Investigator(); // await axiosRequest.put("/investigator/me");   
    else
      return new Investigator(); // await axiosRequest.post("/investigator/me", investigator);         
  }
  
  return (
    <Context.Provider value={{
      register,
      registerGoogle,
      getMe,
      update      
    }}>{children}
    </Context.Provider>
  )
}
