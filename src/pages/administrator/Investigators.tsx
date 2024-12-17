import { useEffect, useMemo, useState } from 'react'
import { AdministratorClient, Investigator, InvestigatorCreateOrUpdate } from 'api/model'
import React from 'react'
import InvestigatorList from 'components/InvestigatorList'

const Investigators = () => {
  const apiClient = useMemo(
    () => new AdministratorClient(process.env.REACT_APP_API_URL),
    []
  )

  const [investigators, setInvestigators] = useState<Investigator[]>()

  const handleUpdateInvestigator = async (investigator: Investigator) => {
    var dto = new InvestigatorCreateOrUpdate()
    dto.firstName = investigator.firstName
    dto.lastName = investigator.lastName
    dto.address = investigator.address
    dto.address2 = investigator.address2
    dto.city = investigator.city
    dto.state = investigator.state
    dto.postalCode = investigator.postalCode
    dto.emailAddress = investigator.emailAddress
    dto.telephone = investigator.telephone

    if (investigator.uniqueID === undefined) {
      await apiClient.createInvestigator(dto)
    } else {
      await apiClient.updateInvestigator(investigator.uniqueID, dto)
    }
    var investigators = await apiClient.getInvestigators()

    setInvestigators(investigators)
  }

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

  return (
    <InvestigatorList
      investigators={investigators}
      handleUpdateInvestigator={handleUpdateInvestigator}></InvestigatorList>
  )
}

export default Investigators
