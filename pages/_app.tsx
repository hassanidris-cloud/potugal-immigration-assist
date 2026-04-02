import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import ErrorBoundary from '../components/ErrorBoundary'
import FadeInScroll from '../components/FadeInScroll'
import GlobalCaseChatWidget from '../components/GlobalCaseChatWidget'
import { getSiteCopy } from '../lib/getSiteCopy'

const defaultCopy = getSiteCopy().home

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <FadeInScroll />
      <Head>
        <title>{defaultCopy.meta_title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content={defaultCopy.meta_description} />
        <meta name="robots" content="index, follow" />
        <meta name="format-detection" content="telephone=no" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="WINIT Portugal Immigration" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
      <GlobalCaseChatWidget />
    </ErrorBoundary>
  )
}
