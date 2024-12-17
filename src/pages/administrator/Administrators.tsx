import { useEffect, useMemo, useState } from 'react'
import Table from 'components/Table'
import { Administrator, AdministratorClient } from 'api/model'

const Administrators = () => {
  const apiClient = useMemo(
    () => new AdministratorClient(process.env.REACT_APP_API_URL),
    []
  )

  const [administrators, setAdministrators] = useState<Administrator[]>()

  const columns = useMemo(
    () => [
      {
        label: '',
        accessor: 'avatarUrl',
        type: 'avatar',
      },
      {
        label: 'Name / Email',
        accessor: 'lastName',
        type: 'fullNameAndEmailAddress',
      },
      {
        label: 'Last active',
        accessor: 'lastActiveTimestamp',
        type: 'timeAgo',
      },
    ],
    []
  )

  useEffect(() => {
    ;(async () => {
      try {
        const result = await apiClient.getAdministrators()
        setAdministrators(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

  return (
    <>
      <div className="header">Administrators</div>
      <div className="inner">
        <Table
          id="administrator-table"
          name="Administrators"
          type="administrators"
          keyField="lastName"
          columns={columns}
          sourceData={administrators}
          isPropertyBarVisible={false}
          onSearchTermsChange={null}
          onRowClick={null}
          initialSortColumn={'lastName'}
          children={undefined}
        />
      </div>
    </>
  )
}

export default Administrators
