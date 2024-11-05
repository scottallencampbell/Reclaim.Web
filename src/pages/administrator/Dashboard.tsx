import CommandBar from 'components/CommandBar'
import { useOutletContext } from 'react-router'

const Dashboard = () => {
  const logout = useOutletContext()

  return (
    <main>
      <CommandBar onLogout={logout}></CommandBar>
      <div id="overlay" className="wrapper">
        <div className="header">Dashboard</div>
        <div className="row no-gutter"></div>
      </div>
    </main>
  )
}

export default Dashboard
