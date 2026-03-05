import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

type Review = {
  id: string
  content: string
  rating: number | null
  created_at: string
  author_name: string
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [rating, setRating] = useState<number | ''>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null))
  }, [])

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews)
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('You must be signed in to submit a review.')
      return
    }
    if (!content.trim()) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: content.trim(),
          rating: rating === '' ? undefined : Number(rating),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Failed to submit review')
        return
      }
      setContent('')
      setRating('')
      setReviews((prev) => [
        {
          id: data.review.id,
          content: data.review.content,
          rating: data.review.rating ?? null,
          created_at: data.review.created_at,
          author_name: 'You',
        },
        ...prev,
      ])
    } catch {
      setError('Could not submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 className="defesa-section-title home-trusted-reviews-title" style={{ color: '#fff' }}>
        What Clients Say
      </h2>
      <p className="defesa-section-sub" style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>
        Reviews from signed-in clients. We&apos;re building our success stories—share yours below.
      </p>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Only logged-in users can leave a review.
      </p>

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
          {reviews.slice(0, 5).map((r) => (
            <li
              key={r.id}
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1rem',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {r.rating != null && (
                <div style={{ color: '#fbbf24', marginBottom: '0.5rem' }} aria-hidden>
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
              )}
              <p style={{ color: 'rgba(255,255,255,0.95)', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
                &ldquo;{r.content}&rdquo;
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: 0 }}>
                — {r.author_name}
                {r.created_at && (
                  <span> · {new Date(r.created_at).toLocaleDateString()}</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
          No reviews yet. Be the first to share your experience.
        </p>
      )}

      <div
        style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 1rem 0' }}>Write a review</h3>
        {!user ? (
          <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>
            Only signed-in users can leave a review.{' '}
            <Link href="/auth/login" style={{ color: '#93c5fd', fontWeight: 600 }}>
              Sign in
            </Link>
            {' or '}
            <Link href="/auth/signup" style={{ color: '#93c5fd', fontWeight: 600 }}>
              create an account
            </Link>
            {' to share your experience.'}
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="review-content" style={{ display: 'block', color: 'rgba(255,255,255,0.9)', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                Your review (min 10 characters)
              </label>
              <textarea
                id="review-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                minLength={10}
                rows={3}
                placeholder="Share your experience with WINIT..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.95)',
                  color: '#1e293b',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="review-rating" style={{ display: 'block', color: 'rgba(255,255,255,0.9)', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                Rating (optional)
              </label>
              <select
                id="review-rating"
                value={rating}
                onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.95)',
                  color: '#1e293b',
                }}
              >
                <option value="">No rating</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} ★</option>
                ))}
              </select>
            </div>
            {error && (
              <p style={{ color: '#fca5a5', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting || content.trim().length < 10}
              style={{
                padding: '0.6rem 1.25rem',
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting || content.trim().length < 10 ? 0.7 : 1,
              }}
            >
              {submitting ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
