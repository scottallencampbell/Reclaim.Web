import 'bootstrap/dist/css/bootstrap.css'
import { useEffect, useMemo, useState } from 'react'
import Table from 'components/Table'
import { Account } from 'api/schema'
import { AdministratorContext } from 'contexts/AdministratorContext'
import CommandBar from 'components/CommandBar'
import { exportSignins } from 'helpers/exporter'

const SignIns = () => {
  const [accounts, setAccounts] = useState<Account[]>()
  const { getAuthenticatedAccounts } = AdministratorContext()

  const columns = useMemo(
    () => [
      {
        label: '',
        accessor: 'avatarUrl',
        type: 'avatar',
      },
      {
        label: 'Email address',
        accessor: 'emailAddress',
      },
      {
        label: 'Role',
        accessor: 'role',
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
        const result = await getAuthenticatedAccounts()
        setAccounts(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [getAuthenticatedAccounts])

  return (
    <main>
      <CommandBar onExport={() => exportSignins(accounts!)} onLogout={null}></CommandBar>
      <div id="overlay" className="wrapper">
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
      </div>
    </main>
  )
}

export default SignIns
