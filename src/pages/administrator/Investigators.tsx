import { useEffect, useMemo, useState } from 'react'
import Table from 'components/Table'
import PropertyBar from 'components/PropertyBar'
import TextInput from 'components/TextInput'
import { Investigator } from 'api/schema'
import moment from 'moment'
import Icon from 'components/Icon'
import CommandBar from 'components/CommandBar'
import { useOutletContext } from 'react-router'
import { exportInvestigators } from 'helpers/exporter'
import { AdministratorContext } from 'contexts/AdministratorContext'
import { postalCodeRegex } from 'helpers/constants'

const Investigators = () => {
  const [investigators, setInvestigators] = useState<Investigator[]>()
  const [editInvestigator, setEditInvestigator] = useState<Investigator>(
    {} as Investigator
  )
  const [isPropertyBarVisible, setIsPropertyBarVisible] = useState(false)
  const [groupError, setGroupError] = useState('')

  const { updateInvestigator, getAllInvestigators } = AdministratorContext()

  const logout = useOutletContext()

  const columns = useMemo(
    () => [
      {
        label: '',
        accessor: 'avatarUrl',
        type: 'avatar',
      },
      {
        label: 'Name',
        accessor: 'lastName',
        type: 'fullName',
      },
      {
        label: 'Email address',
        accessor: 'emailAddress',
      },
      {
        label: 'Address',
        accessor: 'address',
        type: 'addressAddress2',
      },
      {
        label: 'City',
        accessor: 'city',
        type: 'cityStatePostalCode',
      },
      {
        label: 'Telephone',
        accessor: 'telephone',
      },
      {
        label: 'Last active',
        accessor: 'lastActiveTimestamp',
        type: 'datetime',
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

  const handleCancel = () => {
    setIsPropertyBarVisible(false)
    setTimeout(() => {
      setEditInvestigator({} as Investigator)
    }, 500)
  }

  const handleInvestigatorUpdate = async () => {
    setGroupError('')

    await updateInvestigator(editInvestigator)
    var investigators = await getAllInvestigators()
    setInvestigators(investigators)
    // handleSearchTermsDebounce("");
  }

  const handleRowClick = (clickedInvestigator: Investigator) => {
    setEditInvestigator(clickedInvestigator)
    setIsPropertyBarVisible(true)
  }

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

  const handleAddInvestigator = () => {
    setEditInvestigator({} as Investigator)
    setIsPropertyBarVisible(true)
  }

  useEffect(() => {
    const asyncGetAllInvestigators = async () => {
      await getAllInvestigators()
        .then((result: Investigator[]) => {
          setInvestigators(result)
        })
        .catch((error: any) => {
          console.log(JSON.stringify(error))
        })
    }

    asyncGetAllInvestigators()
  }, [getAllInvestigators])

  return (
    <main>
      <CommandBar
        onExport={() => exportInvestigators(investigators!)}
        onLogout={logout}></CommandBar>
      <div id="overlay" className="wrapper">
        <div className="header">Investigators</div>
        <div className="inner">
          <Table
            id="investigator-table"
            type="investigators"
            keyField="uniqueID"
            columns={columns}
            sourceData={investigators}
            isPropertyBarVisible={isPropertyBarVisible}
            onSearchTermsChange={null}
            // onSearchTermsChange={handleSearchTermsChange}
            onRowClick={handleRowClick}
            initialSortColumn={'lastName'}>
            <Icon
              toolTip="Add investigator"
              className="context-icon"
              name="UserPlus"
              onClick={handleAddInvestigator}
            />
          </Table>
        </div>
        <PropertyBar
          entityID={editInvestigator.uniqueID ?? ''}
          isVisible={isPropertyBarVisible}
          onSave={handleInvestigatorUpdate}
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
                  entityID={editInvestigator.uniqueID?.toString()}
                  key={o.accessor}
                  type={o.type}
                  label={o.label}
                  name={o.accessor}
                  value={(editInvestigator as any)[o.accessor]}
                  required={o.required ?? false}
                  groupError={groupError}
                  columnSpec={o.columnSpec}
                  onChange={(value: string) =>
                    updateInvestigatorProperty(o.accessor, value, o.type)
                  }
                />
              )
            })}
          </>
        </PropertyBar>
        <button
          className="styled-button add"
          onClick={() => setIsPropertyBarVisible(true)}>
          Add investigator
        </button>
      </div>
    </main>
  )
}

export default Investigators
