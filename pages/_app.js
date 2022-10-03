import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
        <title>SQL QUERY</title>
        <meta name="description" content="Used to make sql queries" />
    </Head>
    <Component {...pageProps} />
    </>
  )

}

export default MyApp
