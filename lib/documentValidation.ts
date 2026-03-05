/**
 * Server-side document type validation using OCR text.
 * Maps checklist item titles to keywords that should appear in the document.
 * Used to reduce bypass risk (e.g. renaming an empty PDF to "Passport").
 */

export interface ValidationResult {
  valid: boolean
  reason?: string
  matchedKeyword?: string
}

/** Normalize title for lookup (lowercase, remove parentheticals). */
function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim()
}

/**
 * Keywords that should appear in OCR text for a given document type.
 * Key: normalized checklist item title (or a substring that matches).
 * Value: array of keywords; at least one must appear (case-insensitive).
 */
const DOCUMENT_KEYWORDS: Record<string, string[]> = {
  passport: ['passport', 'passeport', 'pasaporte', 'république', 'república', 'identity', 'nationality', 'date of birth', 'place of birth'],
  'passport copy': ['passport', 'passeport', 'pasaporte', 'identity', 'nationality'],
  'valid passport': ['passport', 'passeport', 'pasaporte', 'valid', 'identity'],
  'passport copies': ['passport', 'passeport', 'pasaporte', 'identity'],
  'passport photos': ['photo', 'photograph', 'biometric', '35x45', '45x35'],
  'passport-size photos': ['photo', 'photograph', 'biometric'],
  nif: ['nif', 'número de identificação fiscal', 'tax identification', 'contribuinte', 'portugal'],
  'nif (tax number)': ['nif', 'número de identificação fiscal', 'tax', 'contribuinte'],
  'criminal record': ['criminal', 'police', 'certificate', 'clearance', 'no criminal', 'good conduct', 'antecedentes', 'apostille', 'apostila', 'certificate of good conduct', 'certificate of no criminal record', 'fbi', 'background check', 'police clearance'],
  'criminal record certificate': ['criminal', 'police', 'certificate', 'clearance', 'good conduct', 'apostille', 'certificate of good conduct', 'no criminal'],
  'apostille': ['apostille', 'apostila', 'certificate', 'legalization', 'authentification'],
  'apostilles': ['apostille', 'apostila', 'certificate', 'legalization'],
  'criminal background check': ['criminal', 'police', 'clearance', 'good conduct', 'background', 'fbi', 'certificate'],
  'proof of income': ['income', 'salary', 'pension', 'bank', 'statement', 'employment', 'revenue', 'rendimento'],
  'proof of remote income': ['income', 'salary', 'employment', 'remote', 'bank', 'statement', 'revenue'],
  'proof of accommodation': ['accommodation', 'rental', 'lease', 'housing', 'address', 'landlord', 'alojamento'],
  'travel insurance': ['insurance', 'health', 'medical', 'coverage', 'seguro'],
  'health insurance': ['insurance', 'health', 'medical', 'coverage'],
  'application form': ['application', 'form', 'visa', 'solicitação', 'candidatura'],
  'visa application form': ['application', 'form', 'visa', 'national visa'],
  'proof of remote work': ['employment', 'contract', 'remote', 'work', 'employer', 'client'],
  'proof of savings': ['bank', 'savings', 'account', 'balance', 'statement', 'saldo'],
  'tax residency': ['tax', 'residency', 'resident', 'fiscal', 'contribuinte'],
  'motivation letter': ['letter', 'motivation', 'reason', 'portugal', 'application'],
  'employment contract': ['contract', 'employment', 'employer', 'salary', 'work'],
  'bank statement': ['bank', 'statement', 'account', 'balance', 'transaction'],
  'rental agreement': ['rental', 'lease', 'agreement', 'landlord', 'accommodation'],
  'birth certificate': ['birth', 'certificate', 'born', 'nascimento'],
  'marriage certificate': ['marriage', 'certificate', 'married', 'matrimônio', 'matrimonio'],
  other: [], // no keyword check for "other"
}

/** Find the best keyword set for a checklist title (exact or partial match). */
function getKeywordsForTitle(checklistTitle: string): string[] {
  const normalized = normalizeTitle(checklistTitle)
  if (DOCUMENT_KEYWORDS[normalized]) return DOCUMENT_KEYWORDS[normalized]
  for (const [key, keywords] of Object.entries(DOCUMENT_KEYWORDS)) {
    if (key.length > 2 && normalized.includes(key)) return keywords
  }
  // Fallback: use first few words of title as weak keywords so we don't block everything
  const words = normalized.split(/\s+/).filter(w => w.length > 2).slice(0, 4)
  return words.length ? words : []
}

/**
 * Validate that OCR-extracted text is consistent with the expected document type.
 * Returns valid: true if at least one keyword is found (or no keywords defined); false otherwise.
 */
export function validateDocumentText(ocrText: string, checklistItemTitle: string): ValidationResult {
  const text = (ocrText || '').toLowerCase()
  if (!text.trim()) {
    return { valid: false, reason: 'No text could be extracted from the document. Please upload a clear, readable file.' }
  }
  const keywords = getKeywordsForTitle(checklistItemTitle)
  if (keywords.length === 0) {
    return { valid: true, reason: 'Document type has no keyword rules; upload accepted.' }
  }
  const found = keywords.find(kw => text.includes(kw.toLowerCase()))
  if (found) {
    return { valid: true, matchedKeyword: found }
  }
  return {
    valid: false,
    reason: `Document content does not appear to match "${checklistItemTitle}". Expected to find terms such as: ${keywords.slice(0, 3).join(', ')}. Please upload the correct document type.`,
  }
}
