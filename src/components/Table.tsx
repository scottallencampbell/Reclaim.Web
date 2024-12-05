import { useEffect, useState } from 'react'
import Icon from './Icon'
import moment from 'moment'
import React from 'react'
import Avatar from './Avatar'
import { flatten } from 'helpers/json'
import { exportFile } from 'helpers/excel'
import PropertyTag from './PropertyTag'

interface ITable {
  children?: any
  id: string
  name: string
  type: string
  keyField: string
  ignoredFields?: string[]
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
  name,
  type,
  keyField,
  ignoredFields,
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
  const [data, setData] = useState<any[] | undefined>(undefined)
  const [isHoverable, setIsHoverable] = useState(true)
  const [searchTerms, setSearchTerms] = useState('')

  useEffect(() => {
    if (sortColumn === undefined || sortColumn === undefined) {
      setSortColumn(columns[0].accessor)
    }

    if (sortOrder === undefined || sortOrder === undefined) {
      setSortOrder('asc')
    }
    // eslint-disable-next-line
  }, [columns])

  useEffect(() => {
    if (sourceData === undefined || sortColumn === undefined || sortOrder === undefined) {
      return
    }

    const column = columns.find((x) => x.accessor === sortColumn)
    const sorted = sort(sourceData, sortColumn, sortOrder, column.type)

    setData(sorted!)
  }, [sourceData, columns, sortColumn, sortOrder])

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

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)

      if (sortOrder === 'desc') {
        setSortOrder('asc')
      }
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
    if (data === undefined) {
      return
    }

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
        let allTermsMatchCount = 0

        termsLower.forEach((term) => {
          let matchCount = 0

          columns.forEach((column) => {
            const value = getFromAccessor(item, column.type, column.accessor)
              ?.toString()
              ?.toLowerCase()

            if (value !== undefined && value.indexOf(term) >= 0) {
              matchCount++
              return false
            }
          })

          if (matchCount > 0) {
            allTermsMatchCount++
          }
        })

        item.isHidden = allTermsMatchCount !== termsLower.length
      })
    }
  }

  const handleMouseMove = (e: any) => {
    if (!isHoverable && !isPropertyBarVisible) {
      unselectAllRows()
      setIsHoverable(true)
    }
  }

  const handleExport = (name: string, ignoredFields: string[] | undefined) => {
    if (data === undefined) {
      return
    }

    if (!ignoredFields) {
      ignoredFields = []
    }

    ignoredFields.push('avatarUrl', 'uniqueID')
    const flattenedData = flatten(data, ignoredFields)
    exportFile(name, flattenedData)
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

  const sort = (
    items: any,
    newSortColumn: string,
    newSortOrder: string,
    type: string
  ) => {
    const column = columns.find((c) => c.accessor === newSortColumn)

    if (newSortColumn) {
      const sorted = [...items].sort((a, b) => {
        let [aItem] = getFromAccessor(a, column.type, newSortColumn)
        let [bItem] = getFromAccessor(b, column.type, newSortColumn)

        if (column.type === 'fullName' || column.type === 'fullNameAndEmailAddress') {
          aItem = a['lastName'] + ' ' + a['firstName']
          bItem = b['lastName'] + ' ' + b['firstName']
        }

        if (aItem === null) {
          return 1
        } else if (bItem === null) {
          return -1
        } else if (aItem === null && bItem === null) {
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
              aItem.toString().localeCompare(bItem.toString(), 'en', {
                numeric: true,
              }) * (newSortOrder === 'asc' ? 1 : -1)
            )
        }
      })

      return sorted
    }
  }

  const getFromAccessor = (item: any, type: string, accessor: string): any => {
    const parts = accessor.split('.')

    let value = item
    let obj = item

    for (let i = 0; i < parts.length; i++) {
      if (value === null) {
        return [null, null]
      }

      obj = value
      value = value[parts[i]]
    }

    if (type !== undefined) {
      switch (type) {
        case 'fullName':
          value = `${obj['firstName']} ${obj['lastName']}`
          break

        case 'fullNameAndEmailAddress':
          value = `${obj['firstName']} ${obj['lastName']} ${obj['emailAddress']}`
          break

        case 'claimExternalIDAndValue':
          value = `${obj['externalID']} ${obj['amountSubmitted']}`
          break

        case 'customerNameAndCode':
          value = `${obj['name']} ${obj['code']}`
          break

        case 'cityState':
          value = `${obj['city']}, ${obj['state']}`
          break

        case 'fullAddress':
          value = `${obj['address']} ${obj['address2']} ${obj['city']} ${obj['state']} ${obj['postalCode']}`
          break

        case 'date':
          value = moment.utc(value).format('MMM DD, YYYY')
          break

        case 'datetime':
          value = moment(value).format('MMM DD, YYYY [at] hh:mma')
          break

        case 'fileSize':
          value = getFileSize(value)
          break

        case 'hash':
          value =
            value.length > 8
              ? value.substring(0, 4) + ' ... ' + value.substring(value.length - 4)
              : value
          break

        case 'interval':
          value = formatDuration(value * 1000) ?? ''
          break
      }
    }

    return [value, obj]
  }

  return data === undefined ? (
    <></>
  ) : (
    <>
      {data.length === 0 ? (
        <div className="no-data">No {type} were found</div>
      ) : (
        <div className={`table${isHoverable ? ' is-hoverable' : ''}`}>
          <div className="table-controls">
            <div className="search-bar">
              <div className="search-bar-buttons">
                <Icon name="Search" className="left"></Icon>
              </div>
              <input
                type="text"
                value={searchTerms}
                onChange={(e) => handleSearchTermsChange(e.target.value)}></input>
            </div>
            <div className="children">
              <Icon
                toolTip="Export"
                name="Download"
                onClick={() => handleExport(name, ignoredFields)}
              />
              {children}
            </div>
          </div>
          <table id={id}>
            <thead>
              <tr>
                {columns.map(({ label, accessor, sortable, type }) => {
                  const labelParts = label.split('/')
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
                      onClick={() => handleSort(accessor)}>
                      <div>
                        {labelParts.length === 1 ? (
                          <span>{label}</span>
                        ) : (
                          <span>
                            {labelParts[0]} / <span>{labelParts[1]}</span>
                          </span>
                        )}
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
                    {columns.map(({ accessor, type, override }) => {
                      let cell = '-'
                      let tag = undefined
                      let [value, obj] = getFromAccessor(item, type, accessor)

                      if (override !== undefined) {
                        value = override
                      }

                      if (value) {
                        switch (type) {
                          case 'propertyTag':
                            tag = <PropertyTag name={value} />
                            break

                          case 'fullNameAndEmailAddress':
                            tag = (
                              <div className="full-name">
                                <div>
                                  {obj['firstName']} {obj['lastName']}
                                </div>
                                <div>{obj['emailAddress']}</div>
                              </div>
                            )
                            break

                          case 'customerNameAndCode':
                            tag = (
                              <div className="customer-name-and-code">
                                <div>{obj['name']}</div>
                                <div>{obj['code']}</div>
                              </div>
                            )
                            break

                          case 'claimExternalIDAndValue':
                            tag = (
                              <div className="claim-externalid-and-value">
                                <div>{obj['externalID']}</div>
                                <div>${obj['amountSubmitted']}</div>
                              </div>
                            )
                            break

                          case 'fullAddress':
                            tag = (
                              <div className="full-address">
                                <div>
                                  {obj['address']} {obj['address2']}
                                </div>
                                <div>
                                  {obj['city']}, {obj['state']} {obj['postalCode']}
                                </div>
                              </div>
                            )
                            break

                          case 'avatar':
                            tag = <Avatar url={value} name={''} />
                            break

                          case 'jobStatus':
                            tag = <div className={`job-status ${value}`}></div>
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
                            let name = ''
                            if (
                              Object.prototype.hasOwnProperty.call(item, 'firstName') &&
                              Object.prototype.hasOwnProperty.call(item, 'lastName')
                            ) {
                              name = `${item['firstName']} ${item['lastName']}`
                            } else if (
                              Object.prototype.hasOwnProperty.call(item, 'emailAddress')
                            ) {
                              name = item['emailAddress']
                            }
                            tag = <Avatar name={name} url="" />
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

                      return (
                        <td key={accessor}>
                          <p>{tag === undefined ? cell : tag}</p>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Table
