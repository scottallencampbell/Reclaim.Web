import { useEffect, useMemo, useState, useRef } from 'react'
import Table from 'components/Table'
import { Administrator, AdministratorClient } from 'api/model'
import Icon from 'components/Icon'

const Administrators = () => {
  const apiClient = useMemo(
    () => new AdministratorClient(process.env.REACT_APP_API_URL),
    []
  )
  const tableRef = useRef<{ handleExport: () => void } | null>(null)

  const handleExportClick = () => {
    console.log(tableRef)
    if (tableRef.current) {
      tableRef.current.handleExport()
    }
  }

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
