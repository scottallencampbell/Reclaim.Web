import { useEffect, useState } from 'react'
import Icon from './Icon'
import moment from 'moment'
import React from 'react'
import Avatar from './Avatar'

interface ITable {
  children: any
  id: string
  type: string
  keyField: string
  columns: any[]
  sourceData: any[] | undefined
  isPropertyBarVisible: boolean
  initialSortColumn?: string
  initialSortOrder?: string
  onSearchTermsChange: Function | null
  onRowClick: Function | null
}

const Table = ({
  children,
  id,
  type,
  keyField,
  columns,
  sourceData,
  isPropertyBarVisible,
  initialSortColumn,
  initialSortOrder,
  onSearchTermsChange,
  onRowClick,
}: ITable) => {
  const [sortColumn, setSortColumn] = useState(initialSortColumn)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  const [data, setData] = useState<any>([])
  const [isHoverable, setIsHoverable] = useState(true)
  const [searchTerms, setSearchTerms] = useState('')

  useEffect(() => {
    if (sourceData == null) {
      return
    }

    setData(sourceData)

    if (sortColumn === null || sortColumn === '') {
      setSortColumn(columns[0].accessor)
    }

    if (sortOrder === null || sortOrder === '') {
      setSortOrder('asc')
    }
  }, [sourceData])

  const unselectAllRows = () => {
    var elements = document.getElementById(id)!.getElementsByClassName('selected')
    while (elements.length > 0) {
      elements[0].classList.remove('selected')
    }
  }

  const selectRow = (id: any) => {
    unselectAllRows()

    const row = document.getElementById(`row-${id}`)

    if (row) {
      row.classList.add('selected')
    }
  }

  const handleRowClick = (item: any) => {
    setIsHoverable(false)
    selectRow(item.id)

    if (onRowClick != null) {
      onRowClick(item)
    }
  }

  const handleSearchTermsChange = (terms: string) => {
    setSearchTerms(terms)

    if (onSearchTermsChange != null) {
      onSearchTermsChange(terms)
    } else if (terms.length === 0) {
      data.forEach((item: any) => {
        item.isHidden = false
      })
    } else {
      const termsLower = terms.toLowerCase().split(' ')
      data.forEach((item: any) => {
        let matchCount = 0

        termsLower.forEach((term) => {
          columns.forEach((column) => {
            if (item[column.accessor].toString().toLowerCase().indexOf(term) >= 0) {
              matchCount++
              return false
            }
          })
        })

        item.isHidden = matchCount !== termsLower.length
      })
    }
  }

  const handleMouseMove = (e: any) => {
    if (!isHoverable && !isPropertyBarVisible) {
      unselectAllRows()
      setIsHoverable(true)
    }
  }

  const getFileSize = (bytes: number, decimals = 1) => {
    if (!+bytes) {
      return '0 B'
    }

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const formatDuration = (period: number) => {
    let parts = []
    const duration = moment.duration(period)

    // return nothing when the duration is falsy or not correctly parsed (P0D)
    if (!duration || duration.toISOString() === 'P0D') {
      return
    }

    if (duration.years() >= 1) {
      const years = Math.floor(duration.years())
      parts.push(years + ' ' + (years > 1 ? 'years' : 'year'))
    }

    if (duration.months() >= 1) {
      const months = Math.floor(duration.months())
      parts.push(months + ' ' + (months > 1 ? 'months' : 'month'))
    }

    if (duration.days() >= 1) {
      const days = Math.floor(duration.days())
      parts.push(days + ' ' + (days > 1 ? 'days' : 'day'))
    }

    if (duration.hours() >= 1) {
      const hours = Math.floor(duration.hours())
      parts.push(hours + ' ' + (hours > 1 ? 'hours' : 'hour'))
    }

    if (duration.minutes() >= 1) {
      const minutes = Math.floor(duration.minutes())
      parts.push(minutes + ' ' + (minutes > 1 ? 'minutes' : 'minute'))
    }

    if (duration.seconds() >= 1) {
      const seconds = Math.floor(duration.seconds())
      parts.push(seconds + ' ' + (seconds > 1 ? 'seconds' : 'second'))
    }

    return parts.join(', ')
  }

  const sort = (newSortColumn: string, currentSortOrder: string, type: string) => {
    let newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'

    if (newSortColumn !== sortColumn) {
      newSortOrder = 'asc'
    }

    setSortOrder(newSortOrder)
    setSortColumn(newSortColumn)

    if (newSortColumn) {
      const sorted = [...data].sort((a, b) => {
        if (a[newSortColumn] === null) {
          return 1
        } else if (b[newSortColumn] === null) {
          return -1
        } else if (a[newSortColumn] === null && b[newSortColumn] === null) {
          return 0
        }

        switch (type) {
          case 'lastNameFirstName':
            return (
              (a.lastName + ' ' + a.firstName)
                .toString()
                .localeCompare((b.lastName + ' ' + b.firstName).toString(), 'en') *
              (newSortOrder === 'asc' ? 1 : -1)
            )

          default:
            return (
              a[newSortColumn]
                .toString()
                .localeCompare(b[newSortColumn].toString(), 'en', {
                  numeric: true,
                }) * (newSortOrder === 'asc' ? 1 : -1)
            )
        }
      })

      setData(sorted)
    }
  }

  const getFromAccessor = (obj: any, accessor: string): any => {
    const parts = accessor.split('.')

    let value = obj

    for (let i = 0; i < parts.length; i++) {
      if (value == null) {
        return null
      }

      value = value[parts[i]]
    }

    return value
  }

  const getCityStatePostalCodeFromAccessor = (obj: any, accessor: string): string => {
    const parts = accessor.split('.')

    let value = obj

    for (let i = 0; i < parts.length - 1; i++) {
      value = value[parts[i]]
    }

    return `${value['city']}, ${value['state']} ${value['postalCode']}`
  }

  const getAddressAddress2FromAccessor = (obj: any, accessor: string): string => {
    const parts = accessor.split('.')

    let value = obj

    for (let i = 0; i < parts.length - 1; i++) {
      value = value[parts[i]]
    }

    if (value['address2'] === null || value['address2'] === '') {
      return value['address']
    } else {
      return `${value['address']} ${value['address2']}`
    }
  }

  return sourceData == null ? (
    <></>
  ) : sourceData.length === 0 ? (
    <div className="no-data">No {type} were found</div>
  ) : (
    <div className={`table${isHoverable ? ' is-hoverable' : ''}`}>
      <div className="table-options">
        {children}
        <input
          type="text"
          className="search-terms"
          value={searchTerms}
          onChange={(e) => handleSearchTermsChange(e.target.value)}></input>
        <Icon name="Search" className="search-terms-icon"></Icon>
      </div>
      <table id={id}>
        <thead>
          <tr>
            {columns.map(({ label, accessor, sortable, type }) => {
              const cl =
                sortable !== false
                  ? sortColumn === accessor && sortOrder === 'asc'
                    ? 'Up'
                    : sortColumn === accessor && sortOrder === 'desc'
                      ? 'Down'
                      : 'Default'
                  : ''
              return (
                <th
                  key={accessor}
                  className={`${cl} ${type}-header`}
                  onClick={() => sort(accessor, sortOrder!, type)}>
                  <div>
                    <span>{label}</span>
                    {sortColumn === accessor && cl !== 'Default' ? (
                      <Icon name={`Caret${cl}`} className="sort-icon"></Icon>
                    ) : (
                      <></>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody onMouseMove={(ev) => handleMouseMove(ev)}>
          {data.map((item: any) => {
            return (
              <tr
                id={`row-${item[keyField]}`}
                key={item[keyField]}
                className={item.isHidden ? 'hidden' : ''}
                onClick={() => handleRowClick(item)}>
                {columns.map(({ accessor, type }) => {
                  let cell = '-'
                  let tag = undefined
                  const value = getFromAccessor(item, accessor)

                  if (value) {
                    switch (type) {
                      case 'avatar':
                        tag = (
                          <Avatar
                            url={`${process.env.REACT_APP_API_URL}/content${value}`}
                            initials=""
                          />
                        )
                        break

                      case 'cityStatePostalCode':
                        if (value != null && value !== '') {
                          cell = getCityStatePostalCodeFromAccessor(item, accessor)
                        }
                        break

                      case 'addressAddress2':
                        cell = getAddressAddress2FromAccessor(item, accessor)
                        break

                      case 'date':
                        cell = moment.utc(value).format('MM/DD/YYYY')
                        break

                      case 'datetime':
                        cell = moment(value).format('MM/DD/YYYY [at] hh:mma')
                        break

                      case 'fileSize':
                        cell = getFileSize(value)
                        break

                      case 'hash':
                        cell =
                          value.length > 8
                            ? value.substring(0, 4) +
                              ' ... ' +
                              value.substring(value.length - 4)
                            : value
                        break

                      case 'interval':
                        cell = formatDuration(value * 1000) ?? ''
                        break

                      case 'jobStatus':
                        tag = <div className={`job-status ${value}`}></div>
                        break

                      case 'fullName':
                        cell = `${item['firstName']} ${item['lastName']}`
                        break

                      case 'thumbnail':
                        if (value !== null && value !== '') {
                          tag = (
                            <div
                              style={{ backgroundImage: `url(${value})` }}
                              className="thumbnail"></div>
                          )
                        }
                        break

                      default:
                        cell = value
                        break
                    }
                  } else {
                    switch (type) {
                      case 'avatar':
                        let initials = '??'
                        if (
                          Object.prototype.hasOwnProperty.call(item, 'firstName') &&
                          Object.prototype.hasOwnProperty.call(item, 'lastName')
                        ) {
                          initials =
                            `${item['firstName'].charAt(0)}${item['lastName'].charAt(0)}`.toUpperCase()
                        } else if (
                          Object.prototype.hasOwnProperty.call(item, 'emailAddress')
                        ) {
                          initials = item['emailAddress'].slice(0, 2).toUpperCase()
                        }
                        tag = <Avatar initials={initials} />
                        break

                      case 'thumbnail2':
                        if (item['extension'] != null && item['extension'] !== '') {
                          tag = (
                            <div
                              style={{
                                backgroundImage: `url(/filetypes/${item['extension'].split('.').pop()}.png)`,
                              }}
                              className="thumbnail-icon"></div>
                          )
                        }
                        break
                    }
                  }

                  return <td key={accessor}>{tag === undefined ? cell : tag}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
