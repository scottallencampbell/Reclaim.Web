import configSettings from "settings/config.json";
import Icon from "./Icon";

interface ICommandBar {
  onExport?: any,
  onLogout: any
}

const CommandBar = ({ onExport = undefined, onLogout }: ICommandBar) => {  
  return (
    <div className="command-bar">
    <div className="command-bar-buttons">
      <input type="text" className="search-bar"></input>              
      <Icon name="search" className="left"></Icon>
      { onExport === undefined ? <></> : <Icon name="download" onClick={onExport}></Icon> }
      <Icon name="paper-plane"></Icon>
      <Icon name="gear" onClick={onLogout}></Icon>
    </div>
  </div>
  )
}

export default CommandBar 