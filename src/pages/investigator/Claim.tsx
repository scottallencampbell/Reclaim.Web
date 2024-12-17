import { useEffect, useMemo, useState } from 'react'
import * as Api from 'api/model'
import { useParams } from 'react-router-dom'
import ClaimDetail from 'components/ClaimDetail'

const Claim = () => {
  const { uniqueID } = useParams()

  const apiClient = useMemo(
    () => new Api.InvestigatorClient(process.env.REACT_APP_API_URL),
    []
  )

  const [claim, setClaim] = useState<Api.Claim>()

  useEffect(() => {
    if (uniqueID === undefined) {
      return
    }

    ;(async () => {
      try {
        const result = await apiClient.getClaim(uniqueID)
        setClaim(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient, uniqueID])

  return claim ? <ClaimDetail claim={claim} /> : null
}

export default Claim
