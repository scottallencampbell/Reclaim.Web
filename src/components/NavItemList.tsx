import NavItem from './NavItem'

interface INavItemList {
  role: string
}

const NavItemList = ({ role }: INavItemList) => {
  switch (role) {
    case 'Administrator':
      return (
        <ul className="nav flex-column">
          <NavItem
            label="Dashboard"
            icon="Home"
            href="/administrator/dashboard"></NavItem>
          <NavItem
            label="Claims"
            icon="FolderOpen"
            href="/administrator/claims"></NavItem>
          <NavItem
            label="Investigators"
            icon="Clipboard"
            href="/administrator/investigators"></NavItem>
          <NavItem
            label="Customers"
            icon="University"
            href="/administrator/customers"></NavItem>
          <NavItem
            label="Current sign-ins"
            icon="NetworkWired"
            href="/administrator/signins"></NavItem>
          <NavItem
            label="Scheduled jobs"
            icon="PersonDigging"
            href="/administrator/jobs"></NavItem>
        </ul>
      )

    case 'Investigator':
      return (
        <ul className="nav flex-column">
          <NavItem label="Dashboard" icon="Home" href="/investigator/dashboard"></NavItem>
          <NavItem label="Claims" icon="FolderOpen" href="/investigator/claims"></NavItem>
        </ul>
      )

    case 'Customer':
      return (
        <ul className="nav flex-column">
          <NavItem label="Dashboard" icon="Home" href="/customer/dashboard"></NavItem>
          <NavItem label="Claims" icon="FolderOpen" href="/customer/claims"></NavItem>
        </ul>
      )

    default:
      return <></>
  }
}

export default NavItemList
