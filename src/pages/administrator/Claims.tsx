import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import Table from "components/Table"
import PropertyBar from "components/PropertyBar"
import TextInput from "components/TextInput"
import { Claim } from "api/schema";
import { ErrorCode } from "helpers/errorcodes"
import { postalCodeRegex } from "helpers/constants"
import moment from "moment"
import Icon from "components/Icon"
import CommandBar from "components/CommandBar"
import { useOutletContext } from "react-router"
import { exportClaims } from "helpers/exporter"
import { AdministratorContext } from "contexts/AdministratorContext"

const Claims = () => {
  const [claims, setClaims] = useState<Claim[]>();
  const [isPropertyBarVisible, setIsPropertyBarVisible] = useState(false);

  const { getAllClaims } = AdministratorContext();
  
  const logout = useOutletContext();

  const columns = useMemo(
    () => [          
      {
        label: "Address",
        accessor: "policy.address",
        type: "addressAddress2"
      }, 
      {
        label: "City",
        accessor: "policy.city",
        type: "cityStatePostalCode"
      },
      {
        label: "Date",
        accessor: "eventDate",
        type: "date"
      },
      {
        label: "External ID",
        accessor: "externalID"
      },
      {
        label: "Type",
        accessor: "type"
      },
      {
        label: "Status",
        accessor: "status"
      },
      {
        label: "Disposition",
        accessor: "disposition"
      }
    ],
    [],
  );

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
    const asyncGetAllClaims = async () => {
      await getAllClaims()
      .then((result: Claim[]) => {
        setClaims(result);
      })
      .catch((error: any) => {
        console.log(JSON.stringify(error));        
      });   
    }

    asyncGetAllClaims();
  }, []);

  return (
    <main>                    
      <CommandBar onExport={() => exportClaims(claims!)} onLogout={logout}></CommandBar>        
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
              children={null} />
          </div>          
        </div>
      </main>
  );
}

export default Claims