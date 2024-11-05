import { HelmetProvider } from 'react-helmet-async'

interface ILandingLayout {
  children: any
  id: string
  image: string
}

export const LandingLayout = ({ children, id, image }: ILandingLayout) => {
  return (
    <>
      <HelmetProvider>
        <title>Reclaim</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;800;900"
          rel="preload prefetch stylesheet"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;800;900&display=swap"
          rel="preload prefetch stylesheet"
          media="print"
        />
      </HelmetProvider>
      <div id={id} className="landing" style={{ backgroundImage: 'url(' + image + ')' }}>
        <main>{children}</main>
      </div>
    </>
  )
}
