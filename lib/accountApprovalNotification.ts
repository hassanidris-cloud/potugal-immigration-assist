import type { SupabaseClient } from '@supabase/supabase-js'

type UserApprovalRow = {
  id: string
  email: string | null
  full_name: string | null
  role: string
  paid_at: string | null
}

export type ApprovalStatus =
  | 'approved_now'
  | 'already_approved'
  | 'not_found'
  | 'admin_skipped'

export type ApprovalResult = {
  status: ApprovalStatus
  emailSent: boolean
  emailIssue?: string
}

type EmailResult = {
  sent: boolean
  issue?: string
}

function getBaseUrl(): string {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    'http://localhost:3001'

  return rawBaseUrl.replace(/\/$/, '')
}

async function sendAccountApprovedEmail(
  user: Pick<UserApprovalRow, 'email' | 'full_name'>
): Promise<EmailResult> {
  if (!user.email) {
    return { sent: false, issue: 'missing_user_email' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { sent: false, issue: 'missing_resend_api_key' }
  }

  const from =
    process.env.RESEND_FROM_EMAIL || 'WINIT Contact <onboarding@resend.dev>'
  const subject = 'Your WINIT account is now approved'
  const dashboardUrl = `${getBaseUrl()}/dashboard`
  const displayName = user.full_name?.trim() || 'there'

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2 style="margin:0 0 12px">Great news, ${escapeHtml(displayName)}!</h2>
      <p style="margin:0 0 12px">Your payment has been confirmed and your WINIT account is now approved.</p>
      <p style="margin:0 0 18px">You can now access your dashboard and continue your Portugal immigration process.</p>
      <p style="margin:0 0 18px">
        <a href="${dashboardUrl}" style="display:inline-block;background:#0066cc;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600">
          Open my dashboard
        </a>
      </p>
      <p style="margin:0;color:#475569">If you have any questions, just reply to this email and our team will help you.</p>
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
        to: [user.email],
        subject,
        html,
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
    console.error('Approval email error:', error)
    return { sent: false, issue: 'approval_email_request_failed' }
  }
}

export async function approveUserAndNotify(
  supabase: SupabaseClient,
  userId: string
): Promise<ApprovalResult> {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name, role, paid_at')
    .eq('id', userId)
    .maybeSingle()

  if (userError) {
    throw userError
  }

  const user = userData as UserApprovalRow | null
  if (!user) {
    return { status: 'not_found', emailSent: false }
  }

  if (user.role === 'admin') {
    return { status: 'admin_skipped', emailSent: false }
  }

  if (user.paid_at) {
    return { status: 'already_approved', emailSent: false }
  }

  const approvedAt = new Date().toISOString()
  const { data: updatedUserData, error: updateError } = await supabase
    .from('users')
    .update({ paid_at: approvedAt })
    .eq('id', userId)
    .is('paid_at', null)
    .select('id, email, full_name, role, paid_at')
    .maybeSingle()

  if (updateError) {
    throw updateError
  }

  if (!updatedUserData) {
    return { status: 'already_approved', emailSent: false }
  }

  const updatedUser = updatedUserData as UserApprovalRow
  const emailResult = await sendAccountApprovedEmail(updatedUser)

  return {
    status: 'approved_now',
    emailSent: emailResult.sent,
    ...(emailResult.issue ? { emailIssue: emailResult.issue } : {}),
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
