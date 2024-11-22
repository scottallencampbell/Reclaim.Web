import { useEffect, useState } from 'react'
import Icon from './Icon'

interface IAvatar {
  url: string
  name: string
  onClick?: () => void
}

const Avatar = ({ url, name, onClick }: IAvatar) => {
  const [initials, setInitials] = useState('??')

  useEffect(() => {
    if (name !== undefined && name.length > 0) {
      const parts = name.toUpperCase().split(' ')
      if (parts.length > 1) {
        setInitials(parts[0][0] + parts[1][0])
      } else if (parts.length > 1) {
        setInitials(parts[0][0] + parts[0][1])
      } else {
        setInitials(parts[0][0])
      }
    }
  }, [name])

  return (
    <div className="avatar" onClick={onClick}>
      {url.length === 0 ? (
        name.length === 0 ? (
          <div className="name">
            <Icon name="User"></Icon>
          </div>
        ) : (
          <div className="initials">{initials}</div>
        )
      ) : (
        <img alt="" src={`${process.env.REACT_APP_API_URL}${url}`} />
      )}
    </div>
  )
}

export default Avatar
