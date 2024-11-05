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
}

const Icon = ({ name, className = '', style = '', toolTip, onClick }: IIcon) => {
  return (
    <span className={`icon fa-${className} icon-${name}`}>
      <FontAwesomeIcon
        title={toolTip}
        icon={style === 'regular' ? far['fa' + name] : fas['fa' + name]}
        onClick={onClick}
      />
    </span>
  )
}

export default Icon
