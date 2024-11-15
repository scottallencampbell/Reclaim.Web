import { createContext, useContext, useMemo } from 'react'
import {
  Account,
  Customer,
  Investigator,
  Claim,
  AdministratorClient,
  AdministratorDashboard,
} from 'api/schema'

interface IAdministratorContext {
  getDashboard: () => Promise<AdministratorDashboard>
  getAuthenticatedAccounts: () => Promise<Account[]>
  getAllCustomers: () => Promise<Customer[]>
  getAllInvestigators: () => Promise<Investigator[]>
  getAllClaims: () => Promise<Claim[]>
  updateCustomer: (customer: Customer) => Promise<Customer>
  updateInvestigator: (investigator: Investigator) => Promise<Investigator>
}

export const AdministratorContext = (): IAdministratorContext => {
  const {
    getDashboard,
    getAuthenticatedAccounts,
    getAllCustomers,
    getAllInvestigators,
    getAllClaims,
    updateCustomer,
    updateInvestigator,
  } = useContext(Context)

  return {
    getDashboard,
    getAuthenticatedAccounts,
    getAllCustomers,
    getAllInvestigators,
    getAllClaims,
    updateCustomer,
    updateInvestigator,
  }
}

const Context = createContext({} as IAdministratorContext)

export function AdministratorProvider({ children }: { children: any }) {
  const apiClient = useMemo(() => new AdministratorClient(process.env.REACT_APP_API_URL), [])
  
  const getDashboard = async (): Promise<AdministratorDashboard> => {
    return await apiClient.getDashboard()
  }

  const getAuthenticatedAccounts = async (): Promise<Account[]> => {
    return await apiClient.authenticated()
  }

  const getAllCustomers = async (): Promise<Customer[]> => {
    return await apiClient.getCustomers()
  }

  const getAllInvestigators = async (): Promise<Investigator[]> => {
    return await apiClient.getInvestigators()
  }

  const getAllClaims = async (): Promise<Claim[]> => {
    return await apiClient.getClaims()
  }

  const updateCustomer = async (customer: Customer): Promise<Customer> => {
    if (customer.uniqueID !== undefined) {
      return await apiClient.updateCustomer(customer.uniqueID, customer)
    } else {
      return await apiClient.createCustomer(customer)
    }
  }

  const updateInvestigator = async (
    investigator: Investigator
  ): Promise<Investigator> => {
    if (investigator.uniqueID !== undefined) {
      return await apiClient.updateInvestigator(investigator.uniqueID, investigator)
    } else {
      return await apiClient.createInvestigator(investigator)
    }
  }

  return (
    <Context.Provider
      value={{
        getDashboard,
        getAuthenticatedAccounts,
        getAllCustomers,
        getAllInvestigators,
        getAllClaims,
        updateCustomer,
        updateInvestigator,
      }}>
      {children}
    </Context.Provider>
  )
}
