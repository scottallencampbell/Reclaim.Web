import { useEffect, useMemo, useState } from 'react'
import Table from 'components/Table'
import { Claim } from 'api/schema'
import CommandBar from 'components/CommandBar'
import { exportClaims } from 'helpers/exporter'
import { AdministratorContext } from 'contexts/AdministratorContext'

const Claims = () => {
  const [claims, setClaims] = useState<Claim[]>()
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

  /*
  const handleSearchTermsDebounce = async (inputValue: string) => {
    await search(inputValue)
      .then((result: Claim[]) => {
        setClaims(result);
      })
      .catch((error: any) => {
        console.log(JSON.stringify(error));
      });
  }
  */

  /*
  const handleSearchTermsChange = (terms: string) => {
    searchTermsDebouncer(terms);
  }
  */

  /*
  const handleRowClick = (clickedClaim: Claim) => {
    setEditClaim(Object.assign(new Claim(), clickedClaim));
    setIsPropertyBarVisible(true);
  }
  */

  /*
  const searchTermsDebouncer = useCallback(debounce(handleSearchTermsDebounce, 250), []);

  useEffect(() => {
    handleSearchTermsDebounce("");
  }, []);
  */

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
    <main>
      <CommandBar onExport={() => exportClaims(claims!)} onLogout={null}></CommandBar>
      <div id="overlay" className="wrapper">
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
            // onSearchTermsChange={handleSearchTermsChange}
            onRowClick={null}
            children={null}
          />
        </div>
      </div>
    </main>
  )
}

export default Claims
