import { useEffect, useMemo, useState, useRef } from 'react'
import Table from 'components/Table'
import { Account, AdministratorClient } from 'api/model'
import Icon from 'components/Icon'

const SignIns = () => {
  const apiClient = useMemo(
    () => new AdministratorClient(process.env.REACT_APP_API_URL),
    []
  )

  const tableRef = useRef<{ handleExport: () => void } | null>(null)

  const handleExportClick = () => {
    if (tableRef.current) {
      tableRef.current.handleExport()
    }
  }

  const [accounts, setAccounts] = useState<Account[]>()

  const columns = useMemo(
    () => [
      {
        label: '',
        accessor: 'avatarUrl',
        type: 'avatar',
      },
      {
        label: 'Name / Email',
        accessor: 'niceName',
        type: 'niceNameAndEmailAddress',
      },
      {
        label: 'Role',
        accessor: 'role',
        type: 'propertyTag',
      },
      {
        label: 'Signed in',
        accessor: 'sessionAuthenticatedTimestamp',
        type: 'timeAgo',
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
      <div className="menu">
        <div onClick={handleExportClick}>
          <Icon name="Download"></Icon>Export
        </div>
        <div>
          <Icon name="MagnifyingGlass"></Icon>Filter
        </div>
      </div>
      <div className="inner">
        <Table
          ref={tableRef}
          id="sign-in-table"
          name="Sign-Ins"
          type="current sign-ins"
          keyField="emailAddress"
          columns={columns}
          sourceData={accounts}
          isPropertyBarVisible={false}
          onSearchTermsChange={null}
          onRowClick={null}
          initialSortColumn={'lastActiveTimestamp'}
        />
      </div>
    </>
  )
}

export default SignIns
