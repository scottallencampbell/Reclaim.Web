import { Claim, Document } from 'api/model'
import { useMemo, useRef } from 'react'
import Table from './Table'
import Icon from './Icon'
import { Link, useNavigate } from 'react-router-dom'

interface IClaimDocumentList {
  claim: Claim | undefined

  handleRowClick: (clickedDocument: Document) => void
}

const ClaimDocumentList = ({ claim, handleRowClick }: IClaimDocumentList) => {
  const tableRef = useRef<{ handleExport: () => void } | null>(null)

  const handleExportClick = () => {
    if (tableRef.current) {
      tableRef.current.handleExport()
    }
  }

  const columns = useMemo(
    () => [
      { label: '', accessor: 'type', type: 'documentType' },
      {
        label: 'Name / Type',
        accessor: 'name',
        type: 'document',
      },
      {
        label: 'Summary',
        accessor: 'summary',
      },
      {
        label: 'Path',
        accessor: 'path',
      },
      {
        label: 'Size',
        accessor: 'size',
        type: 'fileSize',
      },
      {
        label: 'Hash',
        accessor: 'hash',
      },
      {
        label: 'Originated',
        accessor: 'originatedTimestamp',
        type: 'datetime',
      },
      {
        label: 'Uploaded',
        accessor: 'uploadedTimestamp',
        type: 'datetime',
      },
    ],
    []
  )

  return (
    <>
      {claim ? (
        <>
          <div className="header">Documents for claim {claim.externalID}</div>
          <div className="menu">
            <Link to=".." relative="path">
              <Icon name="ArrowLeft"></Icon>
              Return to claim
            </Link>
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
              id="claim-documents-table"
              name="Claim documents"
              type="claim-documents"
              keyField="uniqueID"
              columns={columns}
              sourceData={claim?.documents}
              isPropertyBarVisible={false}
              onSearchTermsChange={null}
              onRowClick={handleRowClick}
              initialSortColumn={'name'}></Table>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default ClaimDocumentList
