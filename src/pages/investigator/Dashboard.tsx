import { useEffect, useState } from 'react'
import { AccountManagementContext } from 'contexts/AccountManagementContext'
import CommandBar from 'components/CommandBar'
import { useOutletContext } from 'react-router'

const Dashboard = () => {
  const logout = useOutletContext()
  const [content, setContent] = useState('')
  const { getMe } = AccountManagementContext()

  useEffect(() => {
    const asyncGetDashboard = async () => {
      await getMe()
        .then((result) => {
          setContent(JSON.stringify(result))
        })
        .catch((error) => {
          setContent(JSON.stringify(error))
        })
    }

    asyncGetDashboard()
  }, [getMe])

  return (
    <main>
      <CommandBar onLogout={logout}></CommandBar>
      <div id="overlay" className="wrapper">
        <div className="header">Dashboard</div>
        <div className="row no-gutter">{content}</div>
      </div>
    </main>
  )
}

export default Dashboard
