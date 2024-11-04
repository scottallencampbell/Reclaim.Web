import { createContext, useContext, useState } from "react"
import { ErrorCode } from "helpers/errorcodes"
import { Customer } from "api/schema";

interface ICustomerContext {
  update: (customer: Customer) => Promise<Customer>,
}

export const CustomerContext = (): ICustomerContext => {
  const {
    update
  } = useContext(Context);

  return {
    update
  };
}
    
const Context = createContext({} as ICustomerContext);
// const apiClient = new CustomerClient();

export function CustomerProvider({ children }: { children: any }) {

  const update = async (customer: Customer): Promise<Customer> => {    
    if (customer.uniqueID != undefined)
      return new Customer(); // await apiClient.updateCustomer(customer.uniqueID, customer);   
    else
      return new Customer(); //  await apiClient.createCustomer(customer);         
  }
  
  return (
    <Context.Provider value={{
      update      
    }}>{children}
    </Context.Provider>
  )
}
