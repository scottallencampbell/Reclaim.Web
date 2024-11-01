import "bootstrap/dist/css/bootstrap.css"
import { useEffect, useMemo, useState } from "react"
import Table from "components/Table"
import { Account } from "models/Account"
import { AdministratorContext } from "contexts/AdministratorContext"
import CommandBar from "components/CommandBar"
import { useOutletContext } from "react-router"
import { exportSignins } from "helpers/exporter"

const SignIns = () => {
  const [accounts, setAccounts] = useState<Account[]>();
  const { getAuthenticatedAccounts } = AdministratorContext();

  const logout = useOutletContext();

  const columns = useMemo(
    () => [      
      {
        label: "",
        accessor: "avatarUrl",
        type: "avatar"
      },
      {
        label: "Email address",
        accessor: "emailAddress"
      },
      {
        label: "Role",
        accessor: "role"
      },      
      {
        label: "Signed in",
        accessor: "sessionAuthenticatedTimestamp",
        type: "datetime"
      },
      {
        label: "Last active",
        accessor: "lastActiveTimestamp",
        type: "datetime"
      }
    ],
    [],
  );

  useEffect(() => {    
    const asyncGetAuthenticatedAccounts = async () => {
      await getAuthenticatedAccounts()
      .then(result => {
        setAccounts(result.data);
      })
      .catch(error => {
        console.log(JSON.stringify(error));        
      });   
    }

    asyncGetAuthenticatedAccounts();
  }, []);

  return (
    <main>                    
      <CommandBar onExport={() => exportSignins(accounts!)} onLogout={logout}></CommandBar>        
      <div id="overlay" className="wrapper">      
        <div className="header">Sign-ins</div>
          <div className="inner">
            <Table
              id="sign-in-table"
              type="current sign-ins"
              keyField="emailAddress"
              columns={columns}
              sourceData={accounts}
              isPropertyBarVisible={false}
              onSearchTermsChange={null}
              onRowClick={null}
              initialSortColumn={"emailAddress"}  >         
            </Table>
        </div>
      </div>
    </main>
  );
}

export default SignIns