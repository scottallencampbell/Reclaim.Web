import NavItem from "./NavItem";

interface INavItemList {
  role: string
}

const NavItemList = ({ role }: INavItemList) => {
  switch (role) {
    case "Administrator":
      return (
        <ul className="nav flex-column">
          <NavItem label="Dashboard" icon="home" href="/administrator/dashboard"></NavItem>
          <NavItem label="Investigators" icon="users" href="/administrator/investigators"></NavItem>
          <NavItem label="Customers" icon="building" href="/administrator/customers"></NavItem>
          <NavItem label="Current sign-ins" icon="network-wired" href="/administrator/signins"></NavItem>  
          <NavItem label="Jobs" icon="person-digging" href="/administrator/jobs"></NavItem>          
        </ul>
      )
      
    case "Investigator":
      return (
        <ul className="nav flex-column">
          <NavItem label="Dashboard" icon="home" href="/investigator/dashboard"></NavItem>        
        </ul>
      )

    case "Customer":
      return (
        <ul className="nav flex-column">
          <NavItem label="Dashboard" icon="home" href="/customer/dashboard"></NavItem>        
        </ul>
      )
    
    default: 
        return <></>
  }
}

export default NavItemList