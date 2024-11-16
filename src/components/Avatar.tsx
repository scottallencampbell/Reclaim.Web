import Icon from './Icon'

interface IAvatar {
  url?: string
  initials?: string
}

const Avatar = ({ url, initials }: IAvatar) => {
  console.log('Avatar', url === undefined, initials === undefined)
  return (
    <div className="avatar">
      {url === undefined || url.length === 0 ? (
        initials === undefined || initials.length === 0 ? (
          <div className="initials">
            <Icon name="User"></Icon>
          </div>
        ) : (
          <div className="initials">{initials}</div>
        )
      ) : (
        <img alt="" src={url} />
      )}
    </div>
  )
}

export default Avatar
