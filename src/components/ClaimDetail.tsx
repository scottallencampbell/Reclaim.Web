import * as Api from '@/api/model'
import PropertyTag from './PropertyTag'
import Icon from './Icon'
import Avatar from './Avatar'

interface IClaimDetail {
  claim: Api.Claim
}

const ClaimDetail = ({ claim }: IClaimDetail) => {
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
                          className="document-icon"
                          src={`/images/filetypes/${document.type.toLowerCase()}.svg`}></img>
                        <div className="details">
                          {document.description}
                          <br></br>
                          <span>{document.uploadedTimestamp.format('MM/DD/YYYY')}</span>
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
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default ClaimDetail
