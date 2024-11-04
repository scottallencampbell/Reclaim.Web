import { Account, AccountClient, AccountConfirmation, PasswordReset, PasswordResetRequest } from "api/schema";
import { createContext, useContext, useState } from "react"

interface IAccountManagementContext {
  confirmAccount: (emailAddress: string, token: string) => Promise<void>,
  requestPasswordReset: (emailAddress: string) => Promise<void>,
  updatePassword: (emailAddress: string, password: string, token: string) => Promise<void>,
  getMe: () => Promise<Account>
}

export const AccountManagementContext = (): IAccountManagementContext => {
  const {
    confirmAccount,
    requestPasswordReset,
    updatePassword,
    getMe    
  } = useContext(Context);

  return {    
    confirmAccount,
    requestPasswordReset,
    updatePassword,
    getMe
  };
}
    
const Context = createContext({} as IAccountManagementContext);

export function AccountManagementProvider({ children }: { children: any }) {
  const apiClient = new AccountClient();
  
  const confirmAccount = async (emailAddress: string, token: string): Promise<void> => {  
    const request = new AccountConfirmation({ emailAddress: emailAddress, token: token }); 

    return apiClient.confirm(request);
  }

  const requestPasswordReset = async (emailAddress: string): Promise<void> => {
    const request = new PasswordResetRequest({ emailAddress: emailAddress });

    return apiClient.requestResetPassword(request);
  }

  const updatePassword = async (emailAddress: string, newPassword: string, token: string): Promise<void> => {
    const request = new PasswordReset({ emailAddress: emailAddress, newPassword: newPassword, token: token });
    
    return apiClient.resetPassword(request);
  }
  
  const getMe = async (): Promise<Account> => {     
    return apiClient.me();
  }
  
  return (
    <Context.Provider value={{
      confirmAccount,
      requestPasswordReset,
      updatePassword,
      getMe,      
    }}>{children}
    </Context.Provider>
  )
}
