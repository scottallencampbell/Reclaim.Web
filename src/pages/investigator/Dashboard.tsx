import { useEffect, useMemo, useState } from 'react'
import { AccountClient } from 'api/schema'

const Dashboard = () => {
  const apiClient = useMemo(() => new AccountClient(process.env.REACT_APP_API_URL), [])

  const [content, setContent] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const result = await apiClient.me()
        setContent(JSON.stringify(result))
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

  return (
    <>
      <div className="header">Dashboard</div>
      <div className="row no-gutter">{content}</div>
    </>
  )
}

export default Dashboard
