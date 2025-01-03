import { useEffect, useMemo, useState } from 'react'
import { Claim, AdministratorClient, Document } from 'api/model'
import { useNavigate, useParams } from 'react-router-dom'
import ClaimDocumentsList from 'components/ClaimDocumentList'

const ClaimDocuments = () => {
  const apiClient = useMemo(
    () => new AdministratorClient(process.env.REACT_APP_API_URL),
    []
  )

  const [claim, setClaim] = useState<Claim>()

  const navigate = useNavigate()
  const { uniqueID } = useParams()

  const handleRowClick = async (document: Document) => {
    try {
      const response = await apiClient.download(claim!.uniqueID, document.uniqueID)
      const a = window.document.createElement('a')
      a.href = window.URL.createObjectURL(response.data)
      a.download = document.name
      window.document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error: any) {
      console.log(JSON.stringify(error))
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        if (!uniqueID) {
          return
        }

        const result = await apiClient.getClaim(uniqueID)
        setClaim(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

  return (
    <>
      {claim ? (
        <ClaimDocumentsList
          claim={claim}
          handleRowClick={handleRowClick}></ClaimDocumentsList>
      ) : (
        <></>
      )}
    </>
  )
}

export default ClaimDocuments
