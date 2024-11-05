import { createContext, useContext } from 'react'
import { Job, JobClient } from 'api/schema'

interface IJobContext {
  getAll: () => Promise<Job[]>
}

export const JobContext = (): IJobContext => {
  const { getAll } = useContext(Context)

  return {
    getAll,
  }
}

const Context = createContext({} as IJobContext)

export function JobProvider({ children }: { children: any }) {
  const apiClient = new JobClient(process.env.REACT_APP_API_URL)

  const getAll = async (): Promise<Job[]> => {
    return apiClient.getAll()
  }

  return (
    <Context.Provider
      value={{
        getAll,
      }}>
      {children}
    </Context.Provider>
  )
}
