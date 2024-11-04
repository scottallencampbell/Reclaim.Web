import { createContext, useContext, useState } from "react"
import { Account, Customer, Investigator, Claim, AdministratorClient } from "api/schema";

interface IAdministratorContext {
    getAuthenticatedAccounts: () => Promise<Account[]>,
    getAllCustomers: () => Promise<Customer[]>,
    getAllInvestigators: () => Promise<Investigator[]>,
    getAllClaims: () => Promise<Claim[]>,
    updateCustomer: (customer: Customer) => Promise<Customer>,
    updateInvestigator: (investigator: Investigator) => Promise<Investigator>
}

const apiClient = new AdministratorClient();

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

const getAllCustomers = async (): Promise<Customer[]> => {
  return await apiClient.getCustomers(); 
}

const getAllInvestigators = async (): Promise<Investigator[]> => {
  return await apiClient.getInvestigators();
}

const getAllClaims = async (): Promise<Claim[]> => {
  return await apiClient.getClaims();
}

const updateCustomer = async (customer: Customer): Promise<Customer> => {    
  if (customer.uniqueID != undefined)
    return await apiClient.updateCustomer(customer.uniqueID, customer);   
  else
    return await apiClient.createCustomer(customer);         
}

const updateInvestigator = async (investigator: Investigator): Promise<Investigator> => {    
  if (investigator.uniqueID != undefined)
    return await apiClient.updateInvestigator(investigator.uniqueID, investigator);   
  else
    return await apiClient.createInvestigator(investigator);         
}

const Context = createContext({} as IAdministratorContext);

export function AdministratorProvider({ children }: { children: any }) {  
  const getAuthenticatedAccounts = async (): Promise<Account[]> => {
    return await apiClient.authenticated();
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
