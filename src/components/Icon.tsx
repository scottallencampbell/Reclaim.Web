import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(fas, far)

interface IIcon {
  name: any
  className?: string
  style?: string
  toolTip?: string
  onClick?: any
  children?: any
}

const Icon = ({
  name,
  className = '',
  style = '',
  toolTip,
  onClick,
  children,
}: IIcon) => {
  return (
    <span className={`icon ${className} icon-${name}`}>
      <FontAwesomeIcon
        title={toolTip}
        icon={style === 'regular' ? far['fa' + name] : fas['fa' + name]}
        onClick={onClick}
      />
      {children}
    </span>
  )
}

export default Icon
