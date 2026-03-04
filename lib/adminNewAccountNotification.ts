type NewAccountPayload = {
  userId: string
  email: string
  fullName?: string | null
  phone?: string | null
}

type NotificationResult = {
  sent: boolean
  issue?: string
}

const DEFAULT_ADMIN_NOTIFICATION_EMAIL = 'idris@winit.biz'

function getBaseUrl(): string {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    'http://localhost:3001'

  return rawBaseUrl.replace(/\/$/, '')
}

export async function notifyAdminOfNewAccount(
  payload: NewAccountPayload
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { sent: false, issue: 'missing_resend_api_key' }
  }

  const toEmail = (
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.CONTACT_TO_EMAIL ||
    DEFAULT_ADMIN_NOTIFICATION_EMAIL
  ).trim()

  if (!toEmail) {
    return { sent: false, issue: 'missing_admin_notification_email' }
  }

  const from =
    process.env.RESEND_FROM_EMAIL || 'WINIT Contact <onboarding@resend.dev>'
  const subject = `New WINIT account: ${payload.fullName?.trim() || payload.email}`
  const baseUrl = getBaseUrl()

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2 style="margin:0 0 12px">New client account created</h2>
      <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(payload.fullName?.trim() || '—')}</p>
      <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p style="margin:0 0 8px"><strong>Phone:</strong> ${escapeHtml(payload.phone?.trim() || '—')}</p>
      <p style="margin:0 0 16px"><strong>User ID:</strong> ${escapeHtml(payload.userId)}</p>
      <p style="margin:0 0 16px">
        Next step: send the invoice and, after payment, mark the user as paid to approve account access.
      </p>
      <p style="margin:0 0 8px">
        <a href="${baseUrl}/admin/users" style="display:inline-block;background:#0066cc;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600">
          Open clients dashboard
        </a>
      </p>
    </div>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [toEmail],
        subject,
        html,
        reply_to: payload.email,
      }),
    })

    const data = (await response.json().catch(() => ({}))) as {
      message?: string
    }

    if (!response.ok) {
      const message =
        typeof data.message === 'string'
          ? data.message
          : `resend_error_status_${response.status}`
      return { sent: false, issue: message }
    }

    return { sent: true }
  } catch (error) {
    console.error('New account admin notification error:', error)
    return { sent: false, issue: 'admin_notification_request_failed' }
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
