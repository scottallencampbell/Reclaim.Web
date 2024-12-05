import * as Api from '@/api/api'
import { useMemo } from 'react'
import Table from './Table'

interface IClaimList {
  claims: Api.Claim[] | undefined
  handleRowClick: (clickedClaim: Api.Claim) => void
}

const Claims = ({ claims, handleRowClick }: IClaimList) => {
  const columns = useMemo(
    () => [
      {
        label: 'ID / Value',
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
        type: 'propertyTag',
      },
      {
        label: 'Disposition',
        accessor: 'disposition',
        type: 'propertyTag',
      },
    ],
    []
  )

  return (
    <>
      <div className="header">Claims</div>
      <div className="inner">
        <Table
          id="claims-table"
          name="Claims"
          type="claims"
          keyField="uniqueID"
          columns={columns}
          sourceData={claims}
          isPropertyBarVisible={false}
          onSearchTermsChange={null}
          ignoredFields={['attachments']}
          onRowClick={handleRowClick}></Table>
      </div>
    </>
  )
}

export default Claims
