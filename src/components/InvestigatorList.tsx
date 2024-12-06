import { Investigator } from 'api/api'
import { useMemo, useState } from 'react'
import Table from './Table'
import PropertyBar from './PropertyBar'
import TextInput from './TextInput'
import Icon from './Icon'
import moment from 'moment'
import { postalCodeRegex } from 'helpers/constants'

interface IInvestigatorList {
  investigators: Investigator[] | undefined
  handleUpdateInvestigator?: (editInvestigator: Investigator) => Promise<void> | undefined
}

const InvestigatorList = ({
  investigators,
  handleUpdateInvestigator,
}: IInvestigatorList) => {
  const [isPropertyBarVisible, setIsPropertyBarVisible] = useState(false)
  const [editInvestigator, setEditInvestigator] = useState<Investigator>(
    {} as Investigator
  )

  const columns = useMemo(
    () => [
      {
        label: '',
        accessor: 'avatarUrl',
        type: 'avatar',
      },
      {
        label: 'Name / Email',
        accessor: 'lastName',
        type: 'fullNameAndEmailAddress',
      },
      {
        label: 'Address',
        accessor: 'address',
        type: 'fullAddress',
      },
      {
        label: 'Telephone',
        accessor: 'telephone',
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
        label: 'First name',
        accessor: 'firstName',
        type: 'text',
        required: true,
        columnSpec: '2',
      },
      {
        label: 'Last name',
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

  const updateInvestigatorProperty = (prop: string, value: string, type: string) => {
    switch (type) {
      case 'date':
        try {
          const date = moment.utc(value, 'MM/DD/YYYY').format()
          ;(editInvestigator as any)[prop] = date
        } catch {}
        break

      default:
        ;(editInvestigator as any)[prop] = value
        break
    }
  }

  const handleCancel = () => {
    setIsPropertyBarVisible(false)
    setTimeout(() => {
      setEditInvestigator(new Investigator())
    }, 500)
  }

  const handleRowClick = (clickedInvestigator: Investigator) => {
    setEditInvestigator(Object.assign(new Investigator(), clickedInvestigator))
    setIsPropertyBarVisible(true)
  }

  return (
    <>
      <div className="header">Investigators</div>
      <div className="inner">
        <Table
          id="investigator-table"
          name="Investigators"
          type="investigators"
          keyField="uniqueID"
          columns={columns}
          sourceData={investigators}
          isPropertyBarVisible={
            handleUpdateInvestigator !== undefined && isPropertyBarVisible
          }
          onSearchTermsChange={null}
          onRowClick={handleUpdateInvestigator ? handleRowClick : null}
          initialSortColumn={'lastName'}>
          {handleUpdateInvestigator ? (
            <Icon
              toolTip="Add investigator"
              name="SquarePlus"
              onClick={() => {
                setEditInvestigator(new Investigator())
                setIsPropertyBarVisible(true)
              }}
            />
          ) : (
            <></>
          )}
        </Table>
      </div>
      {editInvestigator && handleUpdateInvestigator ? (
        <PropertyBar
          entityID={editInvestigator.uniqueID ?? ''}
          isVisible={isPropertyBarVisible}
          onSave={() => handleUpdateInvestigator(editInvestigator)}
          onCancel={handleCancel}>
          <>
            <div className="caption">
              {editInvestigator.uniqueID === undefined
                ? 'New investigator'
                : 'Edit investigator'}
            </div>
            {fields.map((o, i) => {
              return (
                <TextInput
                  entityID={editInvestigator?.uniqueID?.toString()}
                  key={o.accessor}
                  type={o.type}
                  label={o.label}
                  name={o.accessor}
                  value={(editInvestigator as any)[o.accessor]}
                  required={o.required ?? false}
                  columnSpec={o.columnSpec}
                  onChange={(value: string) =>
                    updateInvestigatorProperty(o.accessor, value, o.type)
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

export default InvestigatorList
