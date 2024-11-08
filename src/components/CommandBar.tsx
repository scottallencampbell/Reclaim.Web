import Icon from './Icon'

interface ICommandBar {
  onExport?: any
  onLogout: any
}

const CommandBar = ({ onExport = undefined, onLogout }: ICommandBar) => {
  return (
    <div className="command-bar">
      <div className="command-bar-buttons">
        <input type="text" className="search-bar"></input>
        <Icon name="Search" className="left"></Icon>
        {onExport === undefined ? (
          <></>
        ) : (
          <Icon name="Download" onClick={onExport}></Icon>
        )}
        <Icon name="PaperPlane"></Icon>
        <Icon name="Gear" onClick={onLogout}></Icon>
      </div>
    </div>
  )
}

export default CommandBar
