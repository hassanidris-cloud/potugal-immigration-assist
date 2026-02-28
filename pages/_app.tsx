import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import ErrorBoundary from '../components/ErrorBoundary'
import AIChatWidget from '../components/AIChatWidget'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#0066cc" />
        <meta name="description" content="WINIT — Portugal immigration support. D2, D7, and D8 visa applications with document checklist, expert help, and progress tracking." />
        <meta name="robots" content="index, follow" />
      </Head>
      <Component {...pageProps} />
      <AIChatWidget />
    </ErrorBoundary>
  )
}
