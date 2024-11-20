import 'bootstrap/dist/css/bootstrap.css'
import { useEffect, useMemo, useState } from 'react'
import Table from 'components/Table'
import { Account } from 'api/schema'
import { AdministratorContext } from 'contexts/AdministratorContext'

const SignIns = () => {
  const [accounts, setAccounts] = useState<Account[]>()
  const { getAuthenticatedAccounts } = AdministratorContext()

  const columns = useMemo(
    () => [
      {
        label: '',
        accessor: 'avatarUrlx',
        type: 'avatar',
      },
      {
        label: 'Email',
        accessor: 'emailAddress',
      },
      {
        label: 'Role',
        accessor: 'role',
        type: 'status',
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
      console.log(1, 'starting')
      try {
        const result = await getAuthenticatedAccounts()
        setAccounts(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [getAuthenticatedAccounts])

  return (
    <>
      <div className="header">Sign-ins</div>
      <div className="inner">
        <Table
          id="sign-in-table"
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
