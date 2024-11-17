import { AuthenticationContext } from '../contexts/AuthenticationContext'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import IdlePopup from '../components/IdlePopup'
import NavBar from '../components/NavBar'
import { HelmetProvider } from 'react-helmet-async'
import configSettings from 'settings/config.json'
import { Outlet } from 'react-router'
import Avatar from '../components/Avatar'

interface IAuthenticatedLayout {
  header?: string
  children?: any
}

export const AuthenticatedLayout = ({ header, children }: IAuthenticatedLayout) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isIdlePopupOpen, setIsIdlePopupOpen] = useState(false)
  const [lastActiveTime, setLastActiveTime] = useState(Date.now())
  const [idleLifeRemaining, setIdleLifeRemaining] = useState(100)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [role, setRole] = useState('')

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

  const logout = () => {
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
      setAvatarUrl(identity.avatarUrl)
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

  return (
    <>
      <HelmetProvider>
        <title>Reclaim</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="preload prefetch stylesheet"
        />
      </HelmetProvider>
      <IdlePopup isOpen={isIdlePopupOpen} onClose={onIdlePopupClose}></IdlePopup>
      <div className="auth-timeout-bar">
        <div style={{ width: `${jwtAccessTokenLifeRemaining}%` }}></div>
      </div>
      <div className={`auth-container ${isAuthenticated ? '' : 'not-authenticated'}`}>
        <div className="outer">
          <NavBar
            role={role}
            jwtAccessTokenLifeRemaining={jwtAccessTokenLifeRemaining}
            idleLifeRemaining={idleLifeRemaining}></NavBar>
          <main>
            <div id="overlay" className="wrapper">
              <div className="auth-account">
                <Avatar
                  url={`${process.env.REACT_APP_API_URL}/content${avatarUrl}`}
                  initials={undefined}
                />
              </div>
              <Outlet context={logout} />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
