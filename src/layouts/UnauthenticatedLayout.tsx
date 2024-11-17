import HTMLReactParser from 'html-react-parser'
import { HelmetProvider } from 'react-helmet-async'
import { useEffect, useState } from 'react'

interface IUnauthenticatedLayout {
  children: any
  id: string
  title: string
  message: string
  errorMessage: string
  reversed?: boolean
}

export const UnauthenticatedLayout = ({
  children,
  id,
  title,
  message,
  errorMessage,
  reversed = false,
}: IUnauthenticatedLayout) => {
  const [randomColor, setRandomColor] = useState(0)

  useEffect(() => {
    setRandomColor(Math.random() * 360)
  }, [])

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
      <div id={id} className={`unauth-container`}>
        <div className="container-fluid">
          <div className="row no-gutter">
            {reversed ? (
              <></>
            ) : (
              <div
                className="col-md-lg-6 d-none d-md-flex bg-image"
                style={{
                  filter: `hue-rotate(${randomColor}deg)`,
                  backgroundImage: `url("/unauthenticated/${id}.jpg")`,
                }}></div>
            )}
            <div className="col-md-lg-6 bg-light-ex">
              <div className="sign-in d-flex align-items-center py-5">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-10 col-xl-7 mx-auto">
                      <h3 className="display-4">{HTMLReactParser(title)}</h3>
                      <p className={'muted mb-4'}>{HTMLReactParser(message)}</p>
                      <div className="error-message">{HTMLReactParser(errorMessage)}</div>
                      <main>{children}</main>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!reversed ? (
              <></>
            ) : (
              <div
                className="col-md-lg-6 d-none d-md-flex bg-image"
                style={{
                  filter: `hue-rotate(${randomColor}deg)`,
                  background: `url("/unauthenticated/${id}.jpg")`,
                }}></div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
