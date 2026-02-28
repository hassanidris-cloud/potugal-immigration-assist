import type { NextApiRequest, NextApiResponse } from 'next'

const SYSTEM_PROMPT = `You are a helpful AI assistant for WINIT, a Portugal immigration support platform. Your role is to answer questions about moving to Portugal and the visa programs WINIT supports.

**Programs WINIT supports (only these three):**
1. **D2 (Entrepreneur)** – For people who want to start a business, invest in an existing Portuguese company, or work as independent professionals/freelancers with Portuguese clients. Requires company registration, business plan, NIF, bank account, accommodation, ~€11,040 financial means, clean criminal record. Initial visa 4 months, then 2-year residence permit.
2. **D7 (Passive Income)** – For people with stable recurring income from outside Portugal (pension, rentals, dividends, royalties). Main applicant needs ~€11,040/year (2026). Requires long-term accommodation, NIF, clean criminal record. Good for retirees, landlords, investors living off income.
3. **D8 (Digital Nomad)** – For remote workers or freelancers with clients/employers outside Portugal. Income requirement ~€3,680/month (4× minimum wage). Requires proof of remote work, 12 months of funds, accommodation, NIF, clean criminal record.

**Guidelines:**
- Be friendly, clear, and concise. Use short paragraphs or bullet points when helpful.
- If the user's situation does NOT fit D2, D7, or D8 (e.g. they want a work visa with a Portuguese employer, student visa, Golden Visa, or other pathways), say clearly that WINIT focuses only on D2, D7, and D8. Suggest they check AIMA or their consulate for other options, or contact WINIT to see if we can point them in the right direction.
- Do not give legal advice. For official rules, always recommend AIMA (aima.gov.pt) and the relevant consulate.
- Encourage signing up or contacting WINIT for personalized guidance when their question is complex or case-specific.
- Keep answers focused on Portugal residency and these three visa types. If asked off-topic, gently steer back to how WINIT can help with Portugal immigration.`

function buildGeminiContents(messages: { role: string; content: string }[]) {
  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
  for (const m of messages) {
    const role = m.role === 'assistant' ? 'model' : 'user'
    const text = String(m.content || '').slice(0, 4000)
    if (!text) continue
    contents.push({ role, parts: [{ text }] })
  }
  return contents
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const geminiKey = process.env.GEMINI_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  if (!geminiKey && !openaiKey) {
    console.error('Neither GEMINI_API_KEY nor OPENAI_API_KEY is set')
    return res.status(503).json({
      error: 'AI assistant is not configured. Please add GEMINI_API_KEY or OPENAI_API_KEY to use this feature.',
    })
  }

  const { messages } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const maxMessages = 20
  const trimmed = messages.slice(-maxMessages).map((m: { role: string; content: string }) => ({
    role: m.role,
    content: String(m.content || '').slice(0, 4000),
  }))

  try {
    if (geminiKey) {
      const contents = buildGeminiContents(trimmed)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.6,
            },
          }),
        }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const errMsg = data.error?.message || data.message || 'AI request failed'
        console.error('Gemini API error', response.status, errMsg)
        return res.status(response.status >= 500 ? 502 : 400).json({
          error: response.status === 429 ? 'Too many requests. Please wait a moment and try again.' : errMsg,
        })
      }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (typeof text !== 'string') {
        return res.status(502).json({ error: 'Invalid response from AI' })
      }
      return res.status(200).json({ message: text })
    }

    const apiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...trimmed.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: m.content,
      })),
    ]
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        max_tokens: 800,
        temperature: 0.6,
      }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const errMsg = data.error?.message || data.message || 'AI request failed'
      console.error('OpenAI API error', response.status, errMsg)
      return res.status(response.status >= 500 ? 502 : 400).json({
        error: response.status === 429 ? 'Too many requests. Please wait a moment and try again.' : errMsg,
      })
    }
    const content = data.choices?.[0]?.message?.content
    if (typeof content !== 'string') {
      return res.status(502).json({ error: 'Invalid response from AI' })
    }
    return res.status(200).json({ message: content })
  } catch (err) {
    console.error('AI chat error', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' })
  }
}
