import { createContext, useContext, useState } from "react"
import { AxiosResponse } from "axios";
import { axiosRequest } from "api/api";
import { Account } from "models/Account";
import { Customer } from "models/Customer";
import { Investigator } from "models/Investigator";

interface IAdministratorContext {
    getAuthenticatedAccounts: () => Promise<AxiosResponse<Account[], any>>,
    getAllCustomers: () => Promise<AxiosResponse<Customer[], any>>,
    getAllInvestigators: () => Promise<AxiosResponse<Investigator[], any>>,
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
    return await axiosRequest.get("/account/authenticated");
  }

  return (
    <Context.Provider value={{
      getAuthenticatedAccounts,
      getAllCustomers,
      getAllInvestigators,
      updateCustomer,
      updateInvestigator
    }}>{children}
    </Context.Provider>
  )
}
