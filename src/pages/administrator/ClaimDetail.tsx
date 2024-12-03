import { useEffect, useMemo, useState } from 'react'
import { AdministratorClient, Claim } from 'api/api'
import { useParams } from 'react-router-dom'
import PropertyTag from 'components/PropertyTag'
import Icon from 'components/Icon'

const ClaimDetail = () => {
  const { uniqueID } = useParams()
  const fileTypes = {
    DOCX: 'FileWord',
    PDF: 'FilePdf',
    JPG: 'FileImage',
    XLSX: 'FileExcel',
    MP4: 'FileVideo',
    PNG: 'FileImage',
  } as const

  const apiClient = useMemo(
    () => new AdministratorClient(process.env.REACT_APP_API_URL),
    []
  )

  const [claim, setClaim] = useState<Claim>()
  const [isPropertyBarVisible] = useState(false)

  useEffect(() => {
    if (uniqueID === undefined) {
      return
    }

    ;(async () => {
      try {
        const result = await apiClient.getClaim(uniqueID)
        setClaim(result)
        console.log(result)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    })()
  }, [apiClient])

  return (
    <>
      {claim ? (
        <>
          <div className="header">Claim {claim.externalID}</div>
          <div className="inner">
            <div className="row">
              <div className="col-md-6 info-box">
                <div>
                  <span className="header">Claim detail</span>
                  <div className="cols">
                    <p>
                      <span>Type</span>
                      <PropertyTag name={claim.type} />
                    </p>
                    <p>
                      <span>Status</span>
                      <PropertyTag name={claim.status} />
                    </p>
                    <p>
                      <span>Disposition</span>
                      <PropertyTag name={claim.disposition} />
                    </p>
                    <p>
                      <span>Event date</span>
                      <div>{claim.eventDate.format('MM/DD/YYYY')}</div>
                    </p>
                    <p>
                      <span>Ingested timestamp</span>
                      <div>{claim.ingestedTimestamp?.format('MM/DD/YYYY hh:mmA')}</div>
                    </p>
                    <p>
                      <span>Amount submitted</span>
                      <div>${claim.amountSubmitted}</div>
                    </p>
                    <p>
                      <span>Amount paid</span>
                      <div>${claim.amountPaid}</div>
                    </p>
                    <p>
                      <span>Amount adjudicated</span>
                      <div>${claim.amountAdjusted}</div>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 info-box">
                <div>
                  <span className="header">Policy detail</span>
                  <div className="cols">
                    <p>
                      <span>Policyholder</span>
                      <div>
                        {claim.policy.firstName} {claim.policy.lastName}
                      </div>
                    </p>
                    <p>
                      <span>Address</span>
                      <div>
                        {claim.policy.address} {claim.policy.address2}
                        <br></br>
                        {claim.policy.city}, {claim.policy.state}{' '}
                        {claim.policy.postalCode}
                      </div>
                    </p>
                    <p>
                      <span>Carrier</span>
                      <div>{claim.policy.customer.name}</div>
                    </p>
                    <p>
                      <span>ID</span>
                      <div>{claim.policy.externalID}</div>
                    </p>
                    <p>
                      <span>Annual premium</span>
                      <div>
                        {claim.policy.annualPremium ? (
                          <>${claim.policy.annualPremium}</>
                        ) : (
                          <>Unknown</>
                        )}
                      </div>
                    </p>
                    <p>
                      <span>Property type</span>
                      <PropertyTag name={claim.policy.propertyType} />
                    </p>
                    <p>
                      <span>Ownership type</span>
                      <PropertyTag name={claim.policy.ownershipType} />
                    </p>
                    <p>
                      <span>Residence detail</span>
                      <div>
                        {claim.policy.bedrooms} BR / {claim.policy.bathrooms ?? 'unknown'}{' '}
                        BA
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 info-box">
                <div>
                  <span className="header">Attachments</span>
                  <div className="attachments">
                    {claim.attachments.map((attachment, index) => (
                      <div>
                        <Icon
                          style="regular"
                          className="property-tag"
                          name={fileTypes[attachment.type]}
                        />
                        <div className="details">
                          {attachment.description}
                          <br></br>
                          <span>{attachment.uploadedTimestamp.format('MM/DD/YYYY')}</span>
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
                    <div>
                      <Icon style="regular" className="property-tag" name="Bell" />
                      <div className="details">
                        Event occurred<br></br>
                        <span>
                          {claim.eventDate.format('MM/DD/yyyy')} -{' '}
                          {claim.policy.firstName} {claim.policy.lastName}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Icon className="property-tag" name="Upload" />
                      <div className="details">
                        Claim submitted
                        <br></br>
                        <span>
                          {claim.eventDate.add('d', 7).format('MM/DD/yyyy')} -{' '}
                          {claim.policy.customer.name}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Icon className="property-tag" name="Gears" />
                      <div className="details">
                        Claim ingested
                        <br></br>
                        <span>{claim.ingestedTimestamp?.format('MM/DD/yyyy')}</span>
                      </div>
                    </div>
                    {claim.investigator ? (
                      <div>
                        <Icon style="regular" className="property-tag" name="Clipboard" />
                        <div className="details">
                          Investigation started
                          <br></br>
                          <span>
                            {claim.eventDate.add('d', 50).format('MM/DD/yyyy')} -{' '}
                            {claim.investigator?.firstName} {claim.investigator?.lastName}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {claim.investigator && claim.adjudicatedTimestamp ? (
                      <div>
                        <Icon className="property-tag" name="Gavel" />
                        <div className="details">
                          Investigation completed
                          <br></br>
                          <span>
                            {claim.adjudicatedTimestamp?.format('MM/DD/yyyy')} -{' '}
                            {claim.investigator?.firstName} {claim.investigator?.lastName}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default ClaimDetail
