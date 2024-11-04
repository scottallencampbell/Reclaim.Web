import { createContext, useContext, useState } from "react"
import { AxiosResponse } from "axios";
import { axiosRequest } from "api/api";
import { Account, Customer, Investigator, Claim } from "api/schema";

interface IAdministratorContext {
    getAuthenticatedAccounts: () => Promise<AxiosResponse<Account[], any>>,
    getAllCustomers: () => Promise<AxiosResponse<Customer[], any>>,
    getAllInvestigators: () => Promise<AxiosResponse<Investigator[], any>>,
    getAllClaims: () => Promise<AxiosResponse<Claim[], any>>,
    updateCustomer: (customer: Customer) => Promise<AxiosResponse<Customer, any>>,
    updateInvestigator: (investigator: Investigator) => Promise<AxiosResponse<Investigator, any>>
}

export const AdministratorContext = (): IAdministratorContext => {
  const {
    getAuthenticatedAccounts
  } = useContext(Context);

  return {    
    getAuthenticatedAccounts,
    getAllCustomers,
    getAllInvestigators,
    getAllClaims,
    updateCustomer,
    updateInvestigator
  };
}

const getAllCustomers = async (): Promise<AxiosResponse<Customer[], any>> => {
  return await axiosRequest.get("/administrator/customer/all"); 
}

const getAllInvestigators = async (): Promise<AxiosResponse<Investigator[], any>> => {
  return await axiosRequest.get("/administrator/investigator/all"); 
}

const getAllClaims = async (): Promise<AxiosResponse<Claim[], any>> => {
  return await axiosRequest.get("/administrator/claim/all"); 
}

const updateCustomer = async (customer: Customer): Promise<AxiosResponse<Customer, any>> => {    
  if (customer.uniqueID != undefined)
    return await axiosRequest.put(`/administrator/customer/${customer.uniqueID}`, customer);   
  else
    return await axiosRequest.post("/administrator/customer", customer);         
}

const updateInvestigator = async (investigator: Investigator): Promise<AxiosResponse<Investigator, any>> => {    
  if (investigator.uniqueID != undefined)
    return await axiosRequest.put(`/administrator/investigator/${investigator.uniqueID}`, investigator);   
  else
    return await axiosRequest.post("/administrator/investigator", investigator);         
}

const Context = createContext({} as IAdministratorContext);

export function AdministratorProvider({ children }: { children: any }) {  
  const getAuthenticatedAccounts = async (): Promise<AxiosResponse<Account[], any>> => {
    return await axiosRequest.get("/administrator/account/authenticated");
  }

  return (
    <Context.Provider value={{
      getAuthenticatedAccounts,
      getAllCustomers,
      getAllInvestigators,
      getAllClaims,
      updateCustomer,
      updateInvestigator
    }}>{children}
    </Context.Provider>
  )
}
