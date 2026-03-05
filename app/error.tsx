'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center font-sans">
      <h1 className="mb-2 text-3xl text-slate-800">
        Something went wrong
      </h1>
      <p className="mb-6 text-slate-500">
        An error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mr-2 rounded-lg bg-[#0066cc] px-4 py-2 font-semibold text-white transition hover:opacity-90"
      >
        Try again
      </button>
      <a href="/" className="font-semibold text-[#0066cc] hover:underline">Go back home</a>
    </div>
  )
}
