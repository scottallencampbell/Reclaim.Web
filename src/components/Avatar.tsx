interface IAvatar {
  url?: string
  initials: string
}

const Avatar = ({ url, initials }: IAvatar) => {
  return (
    <div className="avatar">
      {url === undefined ? (
        <div className="initials">{initials}</div>
      ) : (
        <img alt="" src={url} />
      )}
    </div>
  )
}

export default Avatar
