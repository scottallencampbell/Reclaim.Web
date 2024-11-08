import { AdministratorContext } from 'contexts/AdministratorContext'
import { useEffect, useState } from 'react'
import { AdministratorDashboard } from 'api/schema'
import DashboardAggregateBox from 'components/DashboardAggregateBox'
import Map from 'components/Map'
import News from 'components/News'

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<AdministratorDashboard>()

  const { getDashboard } = AdministratorContext()

  // todo apply this elsewhere

  useEffect(() => {
    ;(async () => {
      try {
        const result = await getDashboard()
        setDashboard(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [getDashboard])

  return (
    <main>
      <div id="overlay" className="wrapper">
        <div className="header">Dashboard</div>
        <div className="row no-gutter">
          <DashboardAggregateBox
            title={'Claims under investigation'}
            data={dashboard?.claimsValueUnderInvestigation}
          />
          <DashboardAggregateBox
            title={'Monthly revenue'}
            data={dashboard?.monthlyRevenue}
          />
          <DashboardAggregateBox title={'New orders'} data={dashboard?.newOrders} />
          <DashboardAggregateBox
            title={'Unique signins'}
            data={dashboard?.uniqueLogins}
          />
        </div>
        <div className="row dashboard-spacer"></div>
        <div className="row no-gutter">
          <div className="col-lg-6">
            <div className="dashboard-news">
              <span>News</span>
              <News />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="dashboard-map">
              <span>Claims by state</span>
              <Map data={dashboard?.claimsByState} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
