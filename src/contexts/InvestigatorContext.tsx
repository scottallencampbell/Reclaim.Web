import { createContext, useContext } from 'react'
import { Investigator } from 'api/schema'

interface IInvestigatorContext {
  getMe: () => Promise<Investigator>
  update: (investigator: Investigator) => Promise<Investigator>
}

export const InvestigatorContext = (): IInvestigatorContext => {
  const { getMe, update } = useContext(Context)

  return {
    getMe,
    update,
  }
}

const Context = createContext({} as IInvestigatorContext)
// const apiClient = useMemo(() => new InvestigatorClient(process.env.REACT_APP_API_URL), [])

export function InvestigatorProvider({ children }: { children: any }) {
  const getMe = async (): Promise<Investigator> => {
    return new Investigator() // await axiosRequest.get("/investigator/me");
  }

  const update = async (investigator: Investigator): Promise<Investigator> => {
    if (investigator.uniqueID !== undefined) {
      return new Investigator() // await axiosRequest.put("/investigator/me");
    } else {
      return new Investigator() // await axiosRequest.post("/investigator/me", investigator);
    }
  }

  return (
    <Context.Provider
      value={{
        getMe,
        update,
      }}>
      {children}
    </Context.Provider>
  )
}
