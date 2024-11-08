import { useEffect, useState } from 'react'
import { AccountManagementContext } from 'contexts/AccountManagementContext'
import CommandBar from 'components/CommandBar'

const Dashboard = () => {
  const [content, setContent] = useState('')
  const { getMe } = AccountManagementContext()

  useEffect(() => {
    ;(async () => {
      try {
        const result = await getMe()
        setContent(JSON.stringify(result))
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [getMe])

  return (
    <main>
      <CommandBar onLogout={null}></CommandBar>
      <div id="overlay" className="wrapper">
        <div className="header">Dashboard</div>
        <div className="row no-gutter">{content}</div>
      </div>
    </main>
  )
}

export default Dashboard
