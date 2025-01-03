import { Claim } from '@/api/model'
import { useMemo, useRef } from 'react'
import Table from './Table'
import Icon from './Icon'

interface IClaimList {
  claims: Claim[] | undefined
  handleRowClick: (clickedClaim: Claim) => void
}
const ClaimList = ({ claims, handleRowClick }: IClaimList) => {
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

  const tableRef = useRef<{ handleExport: () => void } | null>(null)

  const handleExportClick = () => {
    if (tableRef.current) {
      tableRef.current.handleExport()
    }
  }

  return (
    <>
      <div className="header">Claims</div>
      <div className="menu">
        <div>
          <Icon name="SquarePlus"></Icon>Add claim
        </div>
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
          id="claims-table"
          name="Claims"
          type="claims"
          keyField="uniqueID"
          columns={columns}
          sourceData={claims}
          isPropertyBarVisible={false}
          onSearchTermsChange={null}
          ignoredExportFields={['documents']}
          onRowClick={handleRowClick}></Table>
      </div>
    </>
  )
}

export default ClaimList
