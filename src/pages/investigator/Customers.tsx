import { useEffect, useMemo, useState } from 'react'
import { Customer, InvestigatorClient } from 'api/model'
import CustomerList from 'components/CustomerList'

const Customers = () => {
  const apiClient = useMemo(
    () => new InvestigatorClient(process.env.REACT_APP_API_URL),
    []
  )

  const [customers, setCustomers] = useState<Customer[]>()

  /*  const handleCustomerUpdate = async (
    uniqueID: string,
    editCustomer: CustomerCreateOrUpdate
  ) => {
    return null
  }
  */

  useEffect(() => {
    ;(async () => {
      try {
        const result = await apiClient.getCustomers()
        setCustomers(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

  return <CustomerList customers={customers}></CustomerList>
}

export default Customers
