import { createContext, useContext, useState } from "react"
import { AxiosResponse } from "axios";
import { axiosRequest } from "api/api";
import { Job } from "api/schema";

interface IJobContext {
  getAll: () => Promise<AxiosResponse<Job[], any>>
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

export function JobProvider({ children }: { children: any }) {

  const getAll = async (): Promise<AxiosResponse<Job[], any>> => {
    return await axiosRequest.get("/job/all");             
  }

  return (
    <Context.Provider value={{
      getAll
    }}>{children}
    </Context.Provider>
  )
}
