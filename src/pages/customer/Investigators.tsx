import { useEffect, useMemo, useState } from 'react'
import { CustomerClient, Investigator } from 'api/api'
import React from 'react'
import InvestigatorList from 'components/InvestigatorList'

const Investigators = () => {
  const apiClient = useMemo(() => new CustomerClient(process.env.REACT_APP_API_URL), [])

  const [investigators, setInvestigators] = useState<Investigator[]>()

  useEffect(() => {
    ;(async () => {
      try {
        const result = await apiClient.getInvestigators()
        setInvestigators(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

  return <InvestigatorList investigators={investigators}></InvestigatorList>
}

export default Investigators
