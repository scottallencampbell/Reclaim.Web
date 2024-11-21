import { AuthenticationContext } from '../contexts/AuthenticationContext'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import IdlePopup from '../components/IdlePopup'
import NavBar from '../components/NavBar'
import { HelmetProvider } from 'react-helmet-async'
import configSettings from 'settings/config.json'
import { Outlet } from 'react-router'
import Avatar from '../components/Avatar'
import { Popover } from 'react-tiny-popover'
import Icon from 'components/Icon'

interface IAuthenticatedLayout {
  header?: any
}

export const AuthenticatedLayout = ({ header }: IAuthenticatedLayout) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isIdlePopupOpen, setIsIdlePopupOpen] = useState(false)
  const [lastActiveTime, setLastActiveTime] = useState(Date.now())
  const [idleLifeRemaining, setIdleLifeRemaining] = useState(100)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [theme, setTheme] = useState('light')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const {
    redirectUnauthenticated,
    jwtAccessTokenLifeRemaining,
    clearIdentity,
    getIdentity,
  } = AuthenticationContext()

  const domEvents = useMemo(() => ['click', 'scroll', 'keypress'], [])
  //const domEvents = ["click", "scroll", "keypress", "mousemove"];

  let idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const validateIdentity = useCallback(() => {
    const identity = getIdentity()

    if (!identity) {
      return false
    }

    setRole(identity.role)
    setEmailAddress(identity.emailAddress)

    const parts = window.location.pathname.split('/').slice(1)

    if (parts.length === 0) {
      return false
    } else if (parts.length === 1) {
      return true
    }

    return parts[0].toLowerCase() === identity.role.toLowerCase()
  }, [getIdentity, setRole])

  const resetIdleTimer = useCallback(() => {
    const now = Date.now()
    setLastActiveTime(now)

    idleTimer.current = setInterval(() => {
      const secondsRemaining =
        Number(configSettings.IdleTimeout) - Math.round((Date.now() - now) / 1000)
      const percentTimeRemaining =
        (100 * secondsRemaining) / Number(configSettings.IdleTimeout)
      setIdleLifeRemaining(percentTimeRemaining)
    }, 1000)
  }, [])

  const signout = () => {
    clearIdentity()

    if (idleTimer.current) {
      clearInterval(idleTimer.current)
    }
    redirectUnauthenticated(false)
  }

  const onIdlePopupClose = useCallback(
    (isLogout: boolean) => {
      setIsIdlePopupOpen(false)
      if (idleTimer.current) {
        clearInterval(idleTimer.current)
        idleTimer.current = null
      }

      if (isLogout) {
        clearIdentity()
        redirectUnauthenticated(true)
      } else {
        setLastActiveTime(Date.now())
      }
    },
    [clearIdentity, redirectUnauthenticated]
  )

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    const id = setTimeout(
      () => {
        setIsIdlePopupOpen(true)
      },
      Number(configSettings.IdleTimeout) * 1000
    )

    return clearTimeout.bind(null, id)
  }, [lastActiveTime])

  useEffect(() => {
    domEvents.forEach((event: any) => document.addEventListener(event, resetIdleTimer))

    return () => {
      domEvents.forEach((event: any) =>
        document.removeEventListener(event, resetIdleTimer)
      )
    }
  }, [domEvents, resetIdleTimer])

  useEffect(() => {
    const identity = getIdentity()

    if (identity) {
      setName(identity.name ?? '')
      setAvatarUrl(identity.avatarUrl ?? '')
    }
  }, [getIdentity])

  useEffect(() => {
    if (idleTimer.current) {
      clearInterval(idleTimer.current)
    }

    if (validateIdentity()) {
      setIsAuthenticated(true)
      resetIdleTimer()
    } else {
      setIsAuthenticated(false)
      redirectUnauthenticated(true)
    }
  }, [redirectUnauthenticated, resetIdleTimer, validateIdentity])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')

    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  return (
    <>
      <HelmetProvider>
        <title>Reclaim SIU</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="preload prefetch stylesheet"
        />
      </HelmetProvider>
      <div className={`auth-container ${isAuthenticated ? '' : 'not-authenticated'}`}>
        <IdlePopup isOpen={isIdlePopupOpen} onClose={onIdlePopupClose}></IdlePopup>
        <div className="auth-timeout-bar">
          <div style={{ width: `${jwtAccessTokenLifeRemaining}%` }}></div>
        </div>
        <div className="outer">
          <NavBar
            role={role}
            jwtAccessTokenLifeRemaining={jwtAccessTokenLifeRemaining}
            idleLifeRemaining={idleLifeRemaining}></NavBar>
          <main>
            <div id="overlay" className="wrapper">
              <div className="auth-account">
                {header}
                <Icon name="Inbox"></Icon>
                <Popover
                  containerClassName="popover"
                  isOpen={isPopoverOpen}
                  content={
                    <div
                      className={`popover-content fade-in ${isPopoverOpen ? 'show' : ''}`}>
                      <span>{emailAddress}</span>
                      <hr></hr>
                      <div>
                        <Icon name="User" />
                        Profile
                      </div>
                      <div
                        onClick={() => {
                          toggleTheme()
                          setIsPopoverOpen(false)
                        }}>
                        {theme === 'light' ? (
                          <div>
                            <Icon name="Moon" />
                            Dark mode
                          </div>
                        ) : (
                          <div>
                            <Icon name="Sun" />
                            Light mode
                          </div>
                        )}
                      </div>
                      <div>
                        <Icon name="Gear" />
                        Settings
                      </div>
                      <div onClick={signout}>
                        <Icon name="SignOut" />
                        Sign out
                      </div>
                    </div>
                  }
                  positions={['bottom']}
                  onClickOutside={() => setIsPopoverOpen(false)}
                  align="start">
                  <Avatar url={avatarUrl} name={name} />
                </Popover>
              </div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
