import { useEffect, useMemo, useState } from 'react'
import Table from 'components/Table'
import { Claim } from 'api/schema'
import { AdministratorContext } from 'contexts/AdministratorContext'

const Claims = () => {
  const [claims, setClaims] = useState<Claim[]>()
  const [isPropertyBarVisible] = useState(false)

  const { getAllClaims } = AdministratorContext()

  const columns = useMemo(
    () => [
      {
        label: 'ID',
        accessor: 'externalID',
        type: 'claimExternalIDAndValue',
      },
      {
        label: 'Address',
        accessor: 'policy.address',
        type: 'fullAddress',
      },
      {
        label: 'Date',
        accessor: 'eventDate',
        type: 'date',
      },
      {
        label: 'Type',
        accessor: 'type',
      },
      {
        label: 'Status',
        accessor: 'status',
        type: 'status',
      },
      {
        label: 'Disposition',
        accessor: 'disposition',
        type: 'status',
      },
    ],
    []
  )

  useEffect(() => {
    ;(async () => {
      try {
        const result = await getAllClaims()
        setClaims(result)
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
          sourceData={claims}
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
