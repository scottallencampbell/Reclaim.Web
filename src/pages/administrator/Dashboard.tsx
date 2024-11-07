import { AdministratorContext } from 'contexts/AdministratorContext'
import CommandBar from 'components/CommandBar'
import { useOutletContext } from 'react-router'
import { useEffect, useState } from 'react'
import { AdministratorDashboard } from 'api/schema'
import DashboardAggregateBox from 'components/DashboardAggregateBox'

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<AdministratorDashboard>()

  const logout = useOutletContext()
  const { getDashboard } = AdministratorContext()

  useEffect(() => {
    const asyncGetAllCustomers = async () => {
      await getDashboard()
        .then((result: AdministratorDashboard) => {
          setDashboard(result)
        })
        .catch((error: any) => {
          console.log(JSON.stringify(error))
        })
    }

    asyncGetAllCustomers()
  }, [getDashboard])

  return (
    <main>
      <CommandBar onLogout={logout}></CommandBar>
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
      </div>
    </main>
  )
}

export default Dashboard
