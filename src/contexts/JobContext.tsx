import { createContext, useContext, useState } from "react"
import { Job, JobClient } from "api/schema";

interface IJobContext {
  getAll: () => Promise<Job[]>
}

export const JobContext = (): IJobContext => {
  const {
    getAll
  } = useContext(Context);

  return {
    getAll
  };
}
    
const Context = createContext({} as IJobContext);
const apiClient = new JobClient();

export function JobProvider({ children }: { children: any }) {

  const getAll = async (): Promise<Job[]> => {
    return apiClient.getAll();             
  }

  return (
    <Context.Provider value={{
      getAll
    }}>{children}
    </Context.Provider>
  )
}
