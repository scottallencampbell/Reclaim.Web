import { useEffect, useMemo, useState } from 'react'
import Table from 'components/Table'
import { AdministratorClient, Claim } from 'api/api'
import { lowerCase, startCase, upperFirst } from 'lodash'
import moment from 'moment'

const Claims = () => {
  const apiClient = useMemo(
    () => new AdministratorClient(process.env.REACT_APP_API_URL),
    []
  )

  const [claims, setClaims] = useState<Claim[]>()
  const [isPropertyBarVisible] = useState(false)

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
        const result = await apiClient.getClaims()
        setClaims(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

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
          isPropertyBarVisible={isPropertyBarVisible}
          onSearchTermsChange={null}
          ignoredFields={['attachments']}
          onRowClick={null}></Table>
      </div>
    </>
  )
}

export default Claims
