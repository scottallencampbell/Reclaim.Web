import NavItemList from './NavItemList'

interface INavBar {
  role: string
  jwtAccessTokenLifeRemaining: number
  idleLifeRemaining: number
}

const NavBar = ({ role, jwtAccessTokenLifeRemaining, idleLifeRemaining }: INavBar) => {
  return (
    <nav id="nav-bar" className="nav-bar">
      <div className="position-sticky pt-md-5">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
        </div>
        <NavItemList role={role}></NavItemList>
      </div>
    </nav>
  )
}

export default NavBar
