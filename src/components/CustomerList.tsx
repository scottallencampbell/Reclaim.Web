import { Customer } from 'api/api'
import { useMemo, useState } from 'react'
import Table from './Table'
import PropertyBar from './PropertyBar'
import TextInput from './TextInput'
import Icon from './Icon'
import moment from 'moment'
import { postalCodeRegex } from 'helpers/constants'

interface ICustomerList {
  customers: Customer[] | undefined
  handleUpdateCustomer?: (editCustomer: Customer) => Promise<void> | undefined
}

const CustomerList = ({ customers, handleUpdateCustomer }: ICustomerList) => {
  const [editCustomer, setEditCustomer] = useState<Customer>(new Customer())
  const [isPropertyBarVisible, setIsPropertyBarVisible] = useState(false)

  const columns = useMemo(
    () => [
      {
        label: 'Name / Code',
        accessor: 'name',
        type: 'customerNameAndCode',
      },
      {
        label: 'Contact / Email',
        accessor: 'lastName',
        type: 'fullNameAndEmailAddress',
      },
      {
        label: 'Address',
        accessor: 'address',
        type: 'fullAddress',
      },
      {
        label: 'Status',
        accessor: 'status',
        type: 'propertyTag',
      },
      {
        label: 'Last active',
        accessor: 'lastActiveTimestamp',
        type: 'timeAgo',
      },
    ],
    []
  )

  const fields = useMemo(
    () => [
      {
        label: 'Name',
        accessor: 'name',
        type: 'text',
        required: true,
      },
      {
        label: 'Code',
        accessor: 'code',
        type: 'text',
        required: true,
        formatting: 'uppercase',
      },
      {
        label: 'Contact first name',
        accessor: 'firstName',
        type: 'text',
        required: true,
        columnSpec: '2',
      },
      {
        label: 'Contact last name',
        accessor: 'lastName',
        type: 'text',
        required: true,
        columnSpec: '2-last',
      },
      {
        label: 'Email address',
        accessor: 'emailAddress',
        type: 'text',
        required: true,
      },
      {
        label: 'Address',
        accessor: 'address',
        type: 'text',
        required: true,
      },
      {
        label: 'Apartment, suite, etc.',
        accessor: 'address2',
        type: 'text',
      },
      {
        label: 'City',
        accessor: 'city',
        type: 'text',
        required: true,
      },
      {
        label: 'State',
        accessor: 'state',
        type: 'state',
        columnSpec: '2',
        required: true,
      },
      {
        label: 'Postal code',
        accessor: 'postalCode',
        type: 'text',
        regex: postalCodeRegex,
        columnSpec: '2-last',
        required: true,
      },
      {
        label: 'Telephone',
        accessor: 'telephone',
        type: 'telephone',
        required: true,
      },
    ],
    []
  )

  const updateCustomerProperty = (prop: string, value: string, type: string) => {
    switch (type) {
      case 'date':
        try {
          const date = moment.utc(value, 'MM/DD/YYYY').format()
          ;(editCustomer as any)[prop] = date
        } catch {}
        break

      default:
        ;(editCustomer as any)[prop] = value
        break
    }
  }

  const handleCancel = () => {
    setIsPropertyBarVisible(false)
    setTimeout(() => {
      setEditCustomer(new Customer())
    }, 500)
  }

  const handleRowClick = (clickedCustomer: Customer) => {
    setEditCustomer(Object.assign(new Customer(), clickedCustomer))
    setIsPropertyBarVisible(true)
  }

  return (
    <>
      <div className="header">Customers</div>
      <div className="inner">
        <Table
          id="customer-table"
          name="Customers"
          type="customers"
          keyField="uniqueID"
          columns={columns}
          sourceData={customers}
          isPropertyBarVisible={isPropertyBarVisible}
          onSearchTermsChange={null}
          onRowClick={handleUpdateCustomer ? handleRowClick : null}>
          <Icon
            toolTip="Add customer"
            name="SquarePlus"
            onClick={() => {
              setEditCustomer(new Customer())
              setIsPropertyBarVisible(true)
            }}
          />
        </Table>
      </div>
      {handleUpdateCustomer ? (
        <PropertyBar
          entityID={editCustomer.uniqueID ?? ''}
          isVisible={isPropertyBarVisible}
          onSave={() => handleUpdateCustomer(editCustomer)}
          onCancel={handleCancel}>
          <>
            <div className="caption">
              {editCustomer.uniqueID === undefined ? 'New customer' : 'Edit customer'}
            </div>
            {fields.map((o, i) => {
              return (
                <TextInput
                  entityID={editCustomer.uniqueID?.toString()}
                  key={o.accessor}
                  type={o.type}
                  label={o.label}
                  name={o.accessor}
                  value={(editCustomer as any)[o.accessor]}
                  required={o.required ?? false}
                  regex={o.regex}
                  columnSpec={o.columnSpec}
                  formatting={o.formatting}
                  onChange={(value: string) =>
                    updateCustomerProperty(o.accessor, value, o.type)
                  }
                />
              )
            })}
          </>
        </PropertyBar>
      ) : (
        <></>
      )}
    </>
  )
}

export default CustomerList
