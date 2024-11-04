import { createContext, useContext, useState } from "react"
import { AxiosResponse } from "axios";
import jwt from "jwt-decode"
import { ErrorCode } from "helpers/errorcodes"
import { Investigator } from "api/schema";
import { axiosRequest } from "api/api";

interface IInvestigatorContext {
  register: (firstName: string, lastName: string, emailAddress: string, password: string, telephone: string) => Promise<AxiosResponse<any, any>>,
  registerGoogle: (credential: string, nonce: string) => Promise<string>,
  // search: (terms: string) => Promise<AxiosResponse<Customer[], any>>,
  getMe: () => Promise<AxiosResponse<Investigator, any>>,
  update: (investigator: Investigator) => Promise<AxiosResponse<any, any>>,
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

export function InvestigatorProvider({ children }: { children: any }) {

  const register = async (firstName: string, lastName: string, emailAddress: string, telephone: string, password: string): Promise<AxiosResponse<any, any>> => {
      
    if (password.length == 0) {
      return await axiosRequest.post("/investigator/me",
        JSON.stringify({ 
          firstName,
          lastName,         
          emailAddress,
          telephone
        }));             
    }
    else {
      return await axiosRequest.post("/investigator/me",
        JSON.stringify({ 
          firstName,
          lastName,         
          emailAddress,
          password,
          telephone          
        }));   
    }
  }

  const registerGoogle = async (credential: string, nonce: string): Promise<string> => {
    const item = jwt<any>(credential);

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
  }

  const getMe = async (): Promise<AxiosResponse<Investigator, any>> => {
    return await axiosRequest.get("/investigator/me"); 
  }

  const update = async (investigator: Investigator): Promise<AxiosResponse<any, any>> => {    
    if (investigator.uniqueID != undefined)
      return await axiosRequest.put("/investigator/me");   
    else
      return await axiosRequest.post("/investigator/me", investigator);         
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
