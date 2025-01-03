import { useEffect, useMemo, useRef, useState } from 'react'
import Table from 'components/Table'
import { AdministratorClient, Job, JobStatus } from 'api/model'
import * as signalR from '@microsoft/signalr'
import moment from 'moment'
import Icon from 'components/Icon'

const Jobs = () => {
  const apiClient = useMemo(
    () => new AdministratorClient(process.env.REACT_APP_API_URL),
    []
  )

  const tableRef = useRef<{ handleExport: () => void } | null>(null)

  const handleExportClick = () => {
    if (tableRef.current) {
      tableRef.current.handleExport()
    }
  }

  const [jobs, setJobs] = useState<Job[]>()

  const columns = useMemo(
    () => [
      {
        label: 'Description',
        accessor: 'description',
      },
      {
        label: 'Status',
        accessor: 'status',
        type: 'propertyTag',
      },
      {
        label: 'Interval',
        accessor: 'interval',
        type: 'interval',
      },
      {
        label: 'Timeout',
        accessor: 'timeout',
        type: 'interval',
      },
      {
        label: 'Next run',
        accessor: 'nextEvent',
        type: 'timeAgo',
      },
    ],
    []
  )

  const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(process.env.REACT_APP_SIGNALR_URL + '/hub/job', {
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: true,
    })
    .configureLogging(signalR.LogLevel.Error)
    .withAutomaticReconnect()
    .build()

  hubConnection.start().catch((err) => console.log(err))

  hubConnection.onreconnected((connectionId) => {
    //console.log('Connection reconnected')
  })

  hubConnection.onreconnecting((error) => {
    //console.log('Connection reconnecting', error)
  })

  hubConnection.onclose((e) => {
    //console.log('Connection closed', e)
  })

  hubConnection.on('SetJobStatus', (id: number, status: string, nextEvent: string) => {
    const job = jobs?.find((x) => x.id === id)

    if (job) {
      nextEvent += 'Z' // booooo, can't add custom datetime formatter to signalr init on the backend :("
      console.log(
        `Updating jobStatus for ID ${id} to ${status} and nextEvent to ${nextEvent}`
      )

      setTimeout(
        () => {
          job.status = status as JobStatus
          job.nextEvent = moment(nextEvent)
          setJobs([...jobs!])
        },
        status === 'Pending' ? 2000 : 0
      )
    }
  })

  useEffect(() => {
    ;(async () => {
      try {
        const result = await apiClient.getAllJobs()
        setJobs(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

  return (
    <>
      <div className="header">Scheduled Jobs</div>
      <div className="menu">
        <div onClick={handleExportClick}>
          <Icon name="Download"></Icon>Export
        </div>
        <div>
          <Icon name="MagnifyingGlass"></Icon>Filter
        </div>
      </div>
      <div className="inner">
        <Table
          ref={tableRef}
          id="job-table"
          name="Jobs"
          type="jobs"
          keyField="id"
          columns={columns}
          sourceData={jobs}
          isPropertyBarVisible={false}
          onRowClick={null}
          onSearchTermsChange={null}
          children={undefined}
        />
      </div>
    </>
  )
}

export default Jobs
