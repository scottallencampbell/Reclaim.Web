import { useEffect, useMemo, useState } from 'react'
import { AdministratorClient, Customer, CustomerCreateOrUpdate } from 'api/api'
import CustomerList from 'components/CustomerList'

const Customers = () => {
  const apiClient = useMemo(
    () => new AdministratorClient(process.env.REACT_APP_API_URL),
    []
  )

  const [customers, setCustomers] = useState<Customer[]>()

  const handleUpdateCustomer = async (customer: Customer) => {
    var dto = new CustomerCreateOrUpdate()
    dto.name = customer.name
    dto.code = customer.code
    dto.firstName = customer.firstName
    dto.lastName = customer.lastName
    dto.address = customer.address
    dto.address2 = customer.address2
    dto.city = customer.city
    dto.state = customer.state
    dto.postalCode = customer.postalCode
    dto.emailAddress = customer.emailAddress
    dto.telephone = customer.telephone

    if (customer.uniqueID === undefined) {
      await apiClient.createCustomer(dto)
    } else {
      await apiClient.updateCustomer(customer.uniqueID, dto)
    }
    var customers = await apiClient.getCustomers()

    setCustomers(customers)
  }

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

  return (
    <CustomerList
      customers={customers}
      handleUpdateCustomer={handleUpdateCustomer}></CustomerList>
  )
}

export default Customers
