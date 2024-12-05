import { useEffect, useMemo, useState } from 'react'
import { CustomerClient, CustomerDashboard } from 'api/api'
import AggregateBox from 'components/AggregateBox'
import Map from 'components/Map'
import News from 'components/News'
import StackedBarChart from 'components/StackedBarChart'

const Dashboard = () => {
  const apiClient = useMemo(() => new CustomerClient(process.env.REACT_APP_API_URL), [])

  const [dashboard, setDashboard] = useState<CustomerDashboard>()

  useEffect(() => {
    ;(async () => {
      try {
        const result = await apiClient.getDashboard()
        setDashboard(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

  return (
    <div className="dashboard">
      <div className="header">Dashboard</div>
      <div className={dashboard === undefined ? 'element-loading' : 'element-loaded'}>
        <div className="row no-gutter aggregates">
          <AggregateBox title={'Lifetime savings'} data={dashboard?.lifetimeSavings} />
          <AggregateBox title={'Recovery rate'} data={dashboard?.recoveryRate} />
          <AggregateBox
            title={'Claims under investigation'}
            data={dashboard?.claimsValueUnderInvestigation}
          />
          <AggregateBox title={'New orders'} data={dashboard?.newOrders} />
        </div>
        <div className="dashboard-chart">
          <span className="header">Monthly Investigations</span>
          <StackedBarChart data={dashboard?.claimsByMonth} />
        </div>
        <div className="row no-gutter">
          <div className="col-lg-6">
            <div className="dashboard-news">
              <span className="header">News</span>
              <News />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="dashboard-map">
              <span className="header">Investigations by state</span>
              <Map data={dashboard?.claimsByState} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
