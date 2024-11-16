import { useEffect, useMemo, useState } from 'react'
import Table from 'components/Table'
import { Claim } from 'api/schema'
import SearchBar from 'components/SearchBar'
import { AdministratorContext } from 'contexts/AdministratorContext'
import { template } from 'lodash'

const Claims = () => {
  const [allClaims, setAllClaims] = useState<Claim[]>()
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>()
  const [isPropertyBarVisible] = useState(false)

  const { getAllClaims } = AdministratorContext()

  const columns = useMemo(
    () => [
      {
        label: 'Address',
        accessor: 'policy.address',
        type: 'addressAddress2',
      },
      {
        label: 'City',
        accessor: 'policy.city',
        type: 'cityStatePostalCode',
      },
      {
        label: 'Date',
        accessor: 'eventDate',
        type: 'date',
      },
      {
        label: 'External ID',
        accessor: 'externalID',
      },
      {
        label: 'Type',
        accessor: 'type',
      },
      {
        label: 'Status',
        accessor: 'status',
      },
      {
        label: 'Disposition',
        accessor: 'disposition',
      },
    ],
    []
  )

  useEffect(() => {
    ;(async () => {
      try {
        const result = await getAllClaims()
        setAllClaims(result)
        setFilteredClaims(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [getAllClaims])

  return (
    <>
      <div className="header">Claims</div>
      <div className="inner">
        <Table
          id="claims-table"
          type="claims"
          keyField="uniqueID"
          columns={columns}
          sourceData={filteredClaims}
          isPropertyBarVisible={isPropertyBarVisible}
          onSearchTermsChange={null}
          onRowClick={null}
          children={null}
        />
      </div>
    </>
  )
}

export default Claims
