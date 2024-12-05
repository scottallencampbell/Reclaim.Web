import { useEffect, useMemo, useState } from 'react'
import { Claim, CustomerClient } from 'api/api'
import { useNavigate } from 'react-router-dom'
import ClaimsList from 'components/ClaimList'

const Claims = () => {
  const apiClient = useMemo(() => new CustomerClient(process.env.REACT_APP_API_URL), [])

  const [claims, setClaims] = useState<Claim[]>()

  const navigate = useNavigate()

  const handleRowClick = (clickedClaim: Claim) => {
    navigate('/customer/claims/' + clickedClaim.uniqueID)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const result = await apiClient.getClaims()
        setClaims(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

  return <ClaimsList claims={claims} handleRowClick={handleRowClick}></ClaimsList>
}

export default Claims
