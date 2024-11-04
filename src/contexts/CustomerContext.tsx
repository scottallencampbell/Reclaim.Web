import { createContext, useContext, useState } from "react"
import { AxiosResponse } from "axios";
import jwt from "jwt-decode"
import { ErrorCode } from "helpers/errorcodes"
import { Customer } from "api/schema";
import { axiosRequest } from "api/api";

interface ICustomerContext {
  // search: (terms: string) => Promise<AxiosResponse<Customer[], any>>,
  update: (customer: Customer) => Promise<AxiosResponse<any, any>>,
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

export function CustomerProvider({ children }: { children: any }) {

  const update = async (customer: Customer): Promise<AxiosResponse<any, any>> => {    
    if (customer.uniqueID != undefined)
      return await axiosRequest.put(`/administrator/customer/${customer.uniqueID}`, customer);   
    else
      return await axiosRequest.post("/administrator/customer", customer);         
  }
  
  return (
    <Context.Provider value={{
      update      
    }}>{children}
    </Context.Provider>
  )
}
