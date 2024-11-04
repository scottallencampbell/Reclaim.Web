import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import Table from "components/Table"
import { debounce } from "lodash"
import PropertyBar from "components/PropertyBar"
import TextInput from "components/TextInput"
import { Customer } from "api/schema";
import { ErrorCode } from "helpers/errorcodes"
import { postalCodeRegex } from "helpers/constants"
import moment from "moment"
import Icon from "components/Icon"
import CommandBar from "components/CommandBar"
import { useOutletContext } from "react-router"
import { exportCustomers } from "helpers/exporter"
import { AdministratorContext } from "contexts/AdministratorContext"

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>();
  const [editCustomer, setEditCustomer] = useState<Customer>(new Customer());
  const [isPropertyBarVisible, setIsPropertyBarVisible] = useState(false);

  const { getAllCustomers, updateCustomer } = AdministratorContext();
  
  const logout = useOutletContext();

  const columns = useMemo(
    () => [          
      {
        label: "Name",
        accessor: "name",
      }, 
      {
        label: "Code",
        accessor: "code"
      },
      {
        label: "Email address",
        accessor: "emailAddress"
      },
      {
        label: "Telephone",
        accessor: "telephone"
      },  
      {
        label: "Address",
        accessor: "address",
        type: "addressAddress2"
      }, 
      {
        label: "City",
        accessor: "city",
        type: "cityStatePostalCode"
      },
      {
        label: "Last active",
        accessor: "lastActiveTimestamp",
        type: "datetime"
      }
    ],
    [],
  );

  const fields = useMemo(
    () => [      
      {
        label: "Name",
        accessor: "name",
        type: "text",
        required: true
      },
      {
        label: "Code",
        accessor: "code",
        type: "text",
        required: true
      },
      {
        label: "Email address",
        accessor: "emailAddress",
        type: "text",
        required: true
      },
      {
        label: "Address",
        accessor: "address",
        type: "text",
        required: true
      },
      {
        label: "Apartment, suite, etc.",
        accessor: "address2",
        type: "text"
      },
      {
        label: "City",
        accessor: "city",
        type: "text",
        required: true
      },
      {
        label: "State",
        accessor: "state",
        type: "state",
        columnSpec: "2",
        required: true
      },
      {
        label: "Postal code",
        accessor: "postalCode",
        type: "text",
        regex: postalCodeRegex,
        columnSpec: "2-last",
        required: true
      },
      {
        label: "Telephone",
        accessor: "telephone",
        type: "telephone",
        required: true
      }
    ],
    [],
  );

  const handleCancel = () => {
    setIsPropertyBarVisible(false);
    setTimeout(() => { setEditCustomer(new Customer()); }, 500)
  }

  /*
  const handleSearchTermsDebounce = async (inputValue: string) => {
    await search(inputValue)
      .then((result: { data: SetStateAction<Customer[] | undefined> }) => {
        setCustomers(result.data);
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

  const handleRowClick = (clickedCustomer: Customer) => {
    setEditCustomer(Object.assign(new Customer(), clickedCustomer));
    setIsPropertyBarVisible(true);
  }

  const updateCustomerProperty = (prop: string, value: string, type: string) => {  
    switch (type) {
      case "date":
        try {
          const date = moment.utc(value, "MM/DD/YYYY").format();
          (editCustomer as any)[prop] = date;
        } catch {}
        break;

      default:
        (editCustomer as any)[prop] = value;
        break; 
    }    
  }

  const handleAddCustomer = () => {
    setEditCustomer(new Customer());
    setIsPropertyBarVisible(true);
  }

  const handleCustomerUpdate = async () => {
    await updateCustomer(editCustomer);
    var customers = await getAllCustomers();
    setCustomers(customers);
    // handleSearchTermsDebounce(""); 
  }
  /*
  const searchTermsDebouncer = useCallback(debounce(handleSearchTermsDebounce, 250), []);

  useEffect(() => {
    handleSearchTermsDebounce("");
  }, []);
  */

  useEffect(() => {    
    const asyncGetAllCustomers = async () => {
      await getAllCustomers()
      .then((result: Customer[]) => {
        setCustomers(result);
      })    
      .catch((error: any) => {
        console.log(JSON.stringify(error));        
      });   
    }

    asyncGetAllCustomers();
  }, []);

  return (
    <main>                    
      <CommandBar onExport={() => exportCustomers(customers!)} onLogout={logout}></CommandBar>        
      <div id="overlay" className="wrapper"> 
        <div className="header">Customers</div>
          <div className="inner">
            <Table
              id="customer-table"
              type="customers"
              keyField="uniqueID"
              columns={columns}
              sourceData={customers}
              isPropertyBarVisible={isPropertyBarVisible}
              onSearchTermsChange={null}
              // onSearchTermsChange={handleSearchTermsChange}
              onRowClick={handleRowClick}>
              <Icon toolTip="Add customer" className="context-icon" name="UserPlus" onClick={handleAddCustomer} />
              </Table>
          </div>
          <PropertyBar entityID={editCustomer.uniqueID ?? ""} isVisible={isPropertyBarVisible} onSave={handleCustomerUpdate} onCancel={handleCancel}>
            <>                  
              <div className="caption">{editCustomer.uniqueID == undefined ? "New customer" : "Edit customer"}</div>
              {fields.map((o, i) => {          
                return <TextInput
                  entityID={editCustomer.uniqueID?.toString()}
                  key={o.accessor}
                  type={o.type}
                  label={o.label}
                  name={o.accessor}
                  value={(editCustomer as any)[o.accessor]}
                  required={o.required ?? false}
                  regex={o.regex}
                  columnSpec={o.columnSpec}
                  onChange={(value: string) => updateCustomerProperty(o.accessor, value, o.type)} />
              })}
            </>
          </PropertyBar>
          <button className="styled-button add" onClick={() => setIsPropertyBarVisible(true)}>Add customer</button>
        </div>
      </main>
  );
}

export default Customers