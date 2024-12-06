import 'bootstrap/dist/css/bootstrap.css'
import { useEffect, useMemo, useState } from 'react'
import Table from 'components/Table'
import { Account, AdministratorClient } from 'api/api'

const SignIns = () => {
  const apiClient = useMemo(
    () => new AdministratorClient(process.env.REACT_APP_API_URL),
    []
  )

  const [accounts, setAccounts] = useState<Account[]>()

  const columns = useMemo(
    () => [
      {
        label: '',
        accessor: 'avatarUrl',
        type: 'avatar',
      },
      {
        label: 'Email',
        accessor: 'emailAddress',
      },
      {
        label: 'Role',
        accessor: 'role',
        type: 'propertyTag',
      },
      {
        label: 'Signed in',
        accessor: 'sessionAuthenticatedTimestamp',
        type: 'datetime',
      },
      {
        label: 'Last active',
        accessor: 'lastActiveTimestamp',
        type: 'datetime',
      },
    ],
    []
  )

  useEffect(() => {
    ;(async () => {
      try {
        const result = await apiClient.authenticated()
        setAccounts(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

  return (
    <>
      <div className="header">Sign-ins</div>
      <div className="inner">
        <Table
          id="sign-in-table"
          name="Sign-Ins"
          type="current sign-ins"
          keyField="emailAddress"
          columns={columns}
          sourceData={accounts}
          isPropertyBarVisible={false}
          onSearchTermsChange={null}
          onRowClick={null}
          initialSortColumn={'emailAddress'}
          children={undefined}
        />
      </div>
    </>
  )
}

export default SignIns
