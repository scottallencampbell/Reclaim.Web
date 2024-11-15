import { createContext, useContext, useMemo } from 'react'
import { Customer, CustomerClient, CustomerRegistration } from 'api/schema'
import * as jwtDecode from 'jwt-decode'

interface ICustomerContext {
  update: (customer: Customer) => Promise<Customer>
  register: (dto: CustomerRegistration) => Promise<Customer>
  registerGoogle: (credential: string, nonce: string) => Promise<Customer>
}

export const CustomerContext = (): ICustomerContext => {
  const { update, register, registerGoogle } = useContext(Context)

  return {
    update,
    register,
    registerGoogle,
  }
}

const Context = createContext({} as ICustomerContext)

export function CustomerProvider({ children }: { children: any }) {
  const apiClient = useMemo(() => new CustomerClient(process.env.REACT_APP_API_URL), [])

  const update = async (customer: Customer): Promise<Customer> => {
    if (customer.uniqueID !== undefined) {
      return new Customer() // await apiClient.updateCustomer(customer.uniqueID, customer);
    } else {
      return new Customer() //  await apiClient.createCustomer(customer);
    }
  }

  const register = async (dto: CustomerRegistration): Promise<Customer> => {
    return apiClient.register(dto)
  }

  const registerGoogle = async (credential: string, nonce: string): Promise<Customer> => {
    const item = jwtDecode.jwtDecode<{
      given_name: string
      family_name: string
      telephone: string
      email: string
    }>(credential)
    const dto = new CustomerRegistration()

    dto.name = item.given_name // hmm
    dto.firstName = item.given_name
    dto.lastName = item.family_name
    dto.address = 'UNKNOWN'
    dto.address2 = undefined
    dto.city = 'UNKNOWN'
    dto.state = 'IL'
    dto.postalCode = '00000'
    dto.telephone = item.telephone
    dto.googleCredential = credential
    dto.emailAddress = item.email

    return apiClient.register(dto)
  }

  return (
    <Context.Provider
      value={{
        update,
        register,
        registerGoogle,
      }}>
      {children}
    </Context.Provider>
  )
}
