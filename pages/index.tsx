import OriginalLandingPage from '../components/landing/OriginalLandingPage'
import TemporaryLandingPage from '../components/landing/TemporaryLandingPage'

const LANDING_PAGE_VERSION =
  process.env.NEXT_PUBLIC_LANDING_PAGE_VERSION ?? 'temporary'

export default function Home() {
  if (LANDING_PAGE_VERSION === 'original') {
    return <OriginalLandingPage />
  }

  return <TemporaryLandingPage />
}
