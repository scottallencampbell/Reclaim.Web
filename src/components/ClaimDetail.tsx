import * as Api from 'api/model'
import PropertyTag from './PropertyTag'
import Icon from './Icon'
import Avatar from './Avatar'
import { useState } from 'react'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'

interface IClaimDetail {
  claim: Api.Claim
  handleDocumentDownload: (document: Api.Document) => Promise<any>
  handleDocumentUpload: (
    document: Api.FileParameter,
    timestamp: moment.Moment
  ) => Promise<any>
}

const ClaimDetail = ({
  claim,
  handleDocumentDownload,
  handleDocumentUpload,
}: IClaimDetail) => {
  const [selectedFile, setSelectedFile] = useState<File>()
  const navigate = useNavigate()

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0])
  }

  const handleDownload = async (document: Api.Document) => {
    try {
      const response = await handleDocumentDownload(document)
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

  const handleUpload = async () => {
    if (selectedFile) {
      let fileParameter: Api.FileParameter = {
        data: selectedFile,
        fileName: selectedFile.name ?? 'Unknown',
      }

      try {
        await handleDocumentUpload(fileParameter, moment(selectedFile.lastModified))
      } catch (error: any) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          return
        }
        const apiError = JSON.parse(error.response)

        switch (apiError?.errorCodeName) {
          case Api.ErrorCode.DocumentHashAlreadyExists:
            alert('A file with that hash already exists')
            break
        }
      }
    }
  }

  return (
    <>
      {claim ? (
        <>
          <div className="header">Claim {claim.externalID}</div>
          <div className="menu">
            <Link to=".." relative="path">
              <Icon name="ArrowLeft"></Icon> Return to claims list
            </Link>
            <Link to="documents">
              <Icon name="SquarePlus"></Icon> Add document
            </Link>
            <div>
              <Icon name="WandMagicSparkles"></Icon>Query documents
            </div>
            <div>
              <Icon name="Cogs"></Icon>Set status
            </div>
            <div>
              <Icon name="Gavel"></Icon>Set disposition
            </div>
          </div>
          <div className="inner no-table">
            <div className="row">
              <div className="col-md-6 info-box">
                <div>
                  <span className="header">Claim detail</span>
                  <div className="cols-2">
                    {
                      // prettier-ignore
                      [
                        ['Type', <PropertyTag name={claim.type} />],
                        ['Status', <PropertyTag name={claim.status} />],
                        ['Disposition', <PropertyTag name={claim.disposition} />],
                        ['Event date', claim.eventDate.format('MM/DD/YYYY')],
                        ['Ingested timestamp', claim.ingestedTimestamp?.format('MM/DD/YYYY hh:mmA')],
                        ['Amount submitted', `$${claim.amountSubmitted}`],
                        ['Amount paid', `$${claim.amountPaid}`],
                        ['Amount adjudicated', `$${claim.amountAdjusted}`],
                      ].map(([label, value], index) => (
                        <p key={index}>
                          <span>{label}</span>
                          <div>{value}</div>
                        </p>
                      ))
                    }
                  </div>
                </div>
              </div>
              <div className="col-md-6 info-box">
                <div>
                  <span className="header">Policy detail</span>
                  <div className="cols-2">
                    {
                      // prettier-ignore
                      [
                        ['Policyholder', `${claim.policy.firstName} ${claim.policy.lastName}`],
                        ['Address', <>{claim.policy.address} {claim.policy.address2}<br />{claim.policy.city}, {claim.policy.state} {claim.policy.postalCode}</>],
                        ['Carrier', claim.policy.customer.name],
                        ['ID', claim.policy.externalID],
                        ['Annual premium', claim.policy.annualPremium ? `$${claim.policy.annualPremium}` : 'Unknown'],
                        ['Property type', <PropertyTag name={claim.policy.propertyType} />],
                        ['Ownership type', <PropertyTag name={claim.policy.ownershipType} />],
                        ['Residence detail', `${claim.policy.bedrooms} BR / ${claim.policy.bathrooms ?? 'unknown'} BA`],
                      ].map(([label, value], index) => (
                        <p key={index}>
                        <span>{label}</span>
                        <div>{value}</div>
                        </p>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
            {claim.investigator && (
              <div className="row">
                <div className="col-md-12 info-box">
                  <div>
                    <span className="header">Investigator detail</span>
                    <div className="claim-detail-avatar">
                      <Avatar
                        className="extra-large"
                        url={claim.investigator.avatarUrl}
                        name={`${claim.investigator.firstName} ${claim.investigator.lastName}`}
                      />
                    </div>
                    <div className="cols-3 claim-detail-avatar-detail">
                      {
                        // prettier-ignore
                        [
                          ['Name', `${claim.investigator.firstName} ${claim.investigator.lastName}`],
                          ['Address', <>{claim.investigator.address} {claim.investigator.address2}<br />{claim.investigator.city}, {claim.investigator.state} {claim.investigator.postalCode}</>],
                          ['Email address', <>{claim.investigator.emailAddress }</>],
                          ['Telephone', claim.investigator.telephone],
                          ['Status', <PropertyTag name={claim.investigator.status} />],
                          ['Unique ID', claim.investigator.uniqueID.substring(0, 23)],
                      ].map(([label, value], index) => (
                        <p key={index}>
                          <span>{label}</span>
                          <div>{value}</div>
                        </p>
                      ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}{' '}
            <div className="row">
              <div className="col-md-6 info-box">
                <div>
                  <span className="header">documents</span>
                  <div className="documents">
                    {claim.documents.map((document, index) => (
                      <div>
                        <img
                          alt={document.name}
                          className="document-icon"
                          src={`/images/filetypes/${document.type.toLowerCase()}.svg`}></img>
                        <div className="details">
                          // eslint-disable-next-line
                          <a
                            href="#"
                            onClick={async (e) => {
                              e.preventDefault()
                              handleDownload(document)
                            }}>
                            {document.description}
                            <br></br>
                            <span>{document.uploadedTimestamp.format('MM/DD/YYYY')}</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6 info-box">
                <div>
                  <span className="header">Status</span>
                  <div className="statuses">
                    {
                      // prettier-ignore
                      [
                          ['Bell', 'Event occurred', `${claim.eventDate.format('MM/DD/yyyy')} - ${claim.policy.firstName} ${claim.policy.lastName}`],
                          ['Upload', 'Claim submitted', `${claim.eventDate.add('d', 7).format('MM/DD/yyyy')} - ${claim.policy.customer.name}`],
                          ['Gears', 'Claim ingested', `${claim.ingestedTimestamp?.format('MM/DD/yyyy')}`],
                          claim.investigator && ['Clipboard', 'Investigation started', `${claim.eventDate.add('d', 50).format('MM/DD/yyyy')} - ${claim.investigator?.firstName} ${claim.investigator?.lastName}`],
                          claim.investigator && claim.adjudicatedTimestamp && ['Gavel', 'Investigation completed', `${claim.adjudicatedTimestamp?.format('MM/DD/yyyy')} - ${claim.investigator?.firstName} ${claim.investigator?.lastName}`]
                          ].filter((item): item is [string, string, string] => Boolean(item)).map(([icon, label, details], index) => (
                        <div key={index}>
                          <Icon className="property-tag" name={icon} />
                          <div className="details">
                          {label}
                          <br></br>
                          <span>{details}</span>
                          </div>
                        </div>
                        ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!selectedFile}>
            Upload
          </button>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default ClaimDetail
