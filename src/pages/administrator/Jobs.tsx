import { useCallback, useEffect, useMemo, useState } from "react"
import Table from "components/Table"
import { Job } from "models/Job"
import { JobContext } from "contexts/JobContext"
import * as signalR from "@microsoft/signalr";
import configSettings from "settings/config.json";
import CommandBar from "components/CommandBar"
import { useOutletContext } from "react-router"
import { exportJobs, exportSignins } from "helpers/exporter";

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>();
  const { getAll } = JobContext();

  const logout = useOutletContext();

  const columns = useMemo(
    () => [      
      {
        label: "Status",
        accessor: "status",
        type: "jobStatus"
      },
      {
        label: "Description",
        accessor: "description"        
      },
      {
        label: "Interval",
        accessor: "interval",
        type: "interval"
      },
      {
        label: "Next run",
        accessor: "nextEvent",
        type: "datetime"
      }
    ],
    [],
  );

  const handleRowClick = (clickedJob: Job) => {
  }

  const apiRootUrl = process.env.REACT_APP_API_SIGNALR_URL ? process.env.REACT_APP_API_SIGNALR_URL : configSettings.ApiSignalRUrl;

  const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(apiRootUrl + "/hub/job",
    {
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true
    })   
    .configureLogging(signalR.LogLevel.Trace)
    .withAutomaticReconnect()
    .build();
    
  hubConnection.start().catch((err) => console.log(err));
  
  hubConnection.onreconnected((connectionId) => {
    console.log('Connection reconnected');
  });

  hubConnection.onreconnecting((error) => {
    console.log('Connection reconnecting', error);
  });

  hubConnection.onclose((e) => {
    console.log('Connection closed', e);
  });

  hubConnection.on("SetJobStatus", (id: number, status: string, nextEvent: string) => {    
    var job = jobs?.find(x => x.id == id);

    if (job !== undefined) {  
      nextEvent += "Z"; // booooo, can't add custom datetime formatter to signalr init on the backend :("    
      console.log(`Updating jobStatus for ID ${id} to ${status} and nextEvent to ${nextEvent}`);
      
      setTimeout(() => {
        job!.status = status;
        job!.nextEvent = nextEvent;
        setJobs([...jobs!]);
      }, status == "Waiting" ? 2000 : 0);
    } 
  });

  useEffect(() => {    
    const asyncGetJobs = async () => {
      await getAll()
      .then(result => {
        setJobs(result.data);
      })
      .catch(error => {
        console.log(JSON.stringify(error));        
      });   
    }

    asyncGetJobs();
  }, []);

  return (
    <main>                    
      <CommandBar onExport={() => exportJobs(jobs!)}  onLogout={logout}></CommandBar>        
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
              onSearchTermsChange={null}>            
              </Table>
          </div>      
        </div>
      </main>
  );
}

export default Jobs