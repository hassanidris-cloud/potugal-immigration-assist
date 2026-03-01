import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../../lib/supabaseClient'
import Link from 'next/link'

export default function AdminClientInvoices() {
  const router = useRouter()
  const { id: userId } = router.query
  const [client, setClient] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [accessOk, setAccessOk] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  useEffect(() => {
    if (accessOk && userId && typeof userId === 'string') {
      loadClientAndInvoices()
    }
  }, [accessOk, userId])

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth/login')
        return
      }
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role !== 'admin') {
        router.replace('/dashboard')
        return
      }
      setAccessOk(true)
    } catch {
      router.replace('/dashboard')
    }
  }

  const loadClientAndInvoices = async () => {
    if (!userId || typeof userId !== 'string') return
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      setClient(userData || null)

      const { data: invData } = await supabase
        .from('user_invoices')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false })
      setInvoices(invData || [])
    } catch (error) {
      console.error('Error loading client/invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userId || typeof userId !== 'string') return
    const form = e.currentTarget
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]')
    const file = fileInput?.files?.[0]
    if (!file) {
      alert('Please select a PDF file')
      return
    }
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }
    setUploading(true)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${userId}/${Date.now()}-${safeName}`

      const { error: storageError } = await supabase.storage
        .from('invoices')
        .upload(filePath, file, { contentType: 'application/pdf', upsert: false })

      if (storageError) throw storageError

      const { data: { user } } = await supabase.auth.getUser()
      const { error: insertError } = await supabase
        .from('user_invoices')
        .insert({
          user_id: userId,
          file_path: filePath,
          file_name: file.name,
          uploaded_by: user?.id ?? null,
        })

      if (insertError) throw insertError
      await loadClientAndInvoices()
      form.reset()
    } catch (err: any) {
      console.error('Upload error:', err)
      alert(err.message || 'Upload failed. Ensure the "invoices" storage bucket exists and you have upload permission.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (invoiceId: string, filePath: string) => {
    if (!confirm('Remove this invoice? The file will remain in storage until you delete it there.')) return
    try {
      await supabase.from('user_invoices').delete().eq('id', invoiceId)
      await supabase.storage.from('invoices').remove([filePath])
      await loadClientAndInvoices()
    } catch (err: any) {
      console.error('Delete error:', err)
      alert(err.message || 'Delete failed')
    }
  }

  const handleDownload = async (invoiceId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) return
      const res = await fetch(`/api/invoices/download?id=${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Download failed')
      window.open(data.url, '_blank')
    } catch (err: any) {
      alert(err.message || 'Download failed')
    }
  }

  if (!accessOk || loading) {
    return (
      <div style={{ padding: '2rem' }}>Loading...</div>
    )
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/admin/users" style={{ color: '#0070f3' }}>← Back to Clients</Link>
        <h1 style={{ marginTop: '1rem' }}>Client invoice</h1>
        {client && (
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            {client.full_name || '—'} · {client.email}
          </p>
        )}
      </header>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Upload PDF invoice</h2>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
          <input
            type="file"
            accept="application/pdf"
            required
            style={{ padding: '0.5rem' }}
          />
          <button
            type="submit"
            disabled={uploading}
            style={{
              padding: '0.5rem 1rem',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? 'Uploading…' : 'Upload invoice'}
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Invoices for this client</h2>
        {invoices.length === 0 ? (
          <p style={{ color: '#64748b' }}>No invoices yet. Upload one above.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {invoices.map((inv) => (
              <li
                key={inv.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                }}
              >
                <span style={{ fontWeight: '500' }}>{inv.file_name}</span>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  {inv.uploaded_at ? new Date(inv.uploaded_at).toLocaleString() : ''}
                </span>
                <span style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleDownload(inv.id)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: '#0066cc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(inv.id, inv.file_path)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
