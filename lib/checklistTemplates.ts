import type { SupabaseClient } from '@supabase/supabase-js'

type ChecklistTemplateRow = {
  id: string
  visa_type: string
  phase: string | null
  title: string
  description: string | null
  required: boolean | null
  order_index: number | null
}

const VISA_TYPE_ALIASES: Record<string, string[]> = {
  'D7 Digital Nomad': ['D8 Visa'],
  'D8 Visa': ['D7 Digital Nomad'],
}

function getCandidateVisaTypes(visaType: string): string[] {
  const normalized = visaType.trim()
  const aliases = VISA_TYPE_ALIASES[normalized] || []
  return [normalized, ...aliases]
}

export async function getChecklistTemplatesForVisaType(
  supabase: SupabaseClient,
  visaType: string
): Promise<{ templates: ChecklistTemplateRow[]; matchedVisaType: string | null }> {
  const candidates = getCandidateVisaTypes(visaType)

  for (const candidate of candidates) {
    const { data, error } = await supabase
      .from('checklist_templates')
      .select('id, visa_type, phase, title, description, required, order_index')
      .eq('visa_type', candidate)
      .order('order_index')

    if (error) {
      throw error
    }

    const templates = (data || []) as ChecklistTemplateRow[]
    if (templates.length > 0) {
      return { templates, matchedVisaType: candidate }
    }
  }

  return { templates: [], matchedVisaType: null }
}

export function buildChecklistItems(
  caseId: string,
  templates: ChecklistTemplateRow[]
) {
  return templates.map((template) => ({
    case_id: caseId,
    template_id: template.id,
    title: template.title,
    description: template.description,
    required: template.required !== false,
    order_index: template.order_index ?? 0,
    completed: false,
    ...(template.phase != null && { phase: template.phase }),
  }))
}
