import { useEffect, useMemo, useState } from 'react'
import Table from 'components/Table'
import { Job, JobStatus } from 'api/schema'
import { JobContext } from 'contexts/JobContext'
import * as signalR from '@microsoft/signalr'
import CommandBar from 'components/CommandBar'
import { useOutletContext } from 'react-router'
import { exportJobs } from 'helpers/exporter'

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>()
  const { getAll } = JobContext()

  const logout = useOutletContext()

  const columns = useMemo(
    () => [
      {
        label: 'Status',
        accessor: 'status',
        type: 'jobStatus',
      },
      {
        label: 'Description',
        accessor: 'description',
      },
      {
        label: 'Interval',
        accessor: 'interval',
        type: 'interval',
      },
      {
        label: 'Next run',
        accessor: 'nextEvent',
        type: 'datetime',
      },
    ],
    []
  )

  const handleRowClick = (clickedJob: Job) => {}

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
    console.log('Connection reconnected')
  })

  hubConnection.onreconnecting((error) => {
    console.log('Connection reconnecting', error)
  })

  hubConnection.onclose((e) => {
    console.log('Connection closed', e)
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
          job.nextEvent = new Date(nextEvent)
          setJobs([...jobs!])
        },
        status === 'Waiting' ? 2000 : 0
      )
    }
  })

  useEffect(() => {
    const asyncGetJobs = async () => {
      await getAll()
        .then((result) => {
          setJobs(result)
        })
        .catch((error) => {
          console.log(JSON.stringify(error))
        })
    }

    asyncGetJobs()
  }, [getAll])

  return (
    <main>
      <CommandBar onExport={() => exportJobs(jobs!)} onLogout={logout}></CommandBar>
      <div id="overlay" className="wrapper">
        <div className="header">Scheduled Jobs</div>
        <div className="inner">
          <Table
            id="job-table"
            type="jobs"
            keyField="id"
            columns={columns}
            sourceData={jobs}
            isPropertyBarVisible={false}
            onRowClick={handleRowClick}
            onSearchTermsChange={null}
            children={undefined}
          />
        </div>
      </div>
    </main>
  )
}

export default Jobs
