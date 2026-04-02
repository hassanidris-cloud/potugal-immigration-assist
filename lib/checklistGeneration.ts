import type { SupabaseClient } from '@supabase/supabase-js'

const checklistVisaTypeAliases: Record<string, string[]> = {
  'D8 Visa': ['D7 Digital Nomad'],
  'D7 Digital Nomad': ['D8 Visa'],
}

type ChecklistTemplate = {
  id: string
  phase?: string | null
  title: string
  description?: string | null
  required?: boolean | null
  order_index: number
}

export async function fetchChecklistTemplatesForVisa(
  supabase: SupabaseClient,
  visaType: string
): Promise<ChecklistTemplate[]> {
  const candidateVisaTypes = Array.from(
    new Set([visaType, ...(checklistVisaTypeAliases[visaType] || [])].filter(Boolean))
  )

  for (const candidateVisaType of candidateVisaTypes) {
    const { data, error } = await supabase
      .from('checklist_templates')
      .select('*')
      .eq('visa_type', candidateVisaType)
      .order('order_index')

    if (error) throw error
    if (data && data.length > 0) return data as ChecklistTemplate[]
  }

  return []
}

export async function generateChecklistForCase(
  supabase: SupabaseClient,
  caseId: string,
  visaType: string,
  replaceExisting = false
): Promise<number> {
  if (replaceExisting) {
    const { error: deleteError } = await supabase
      .from('case_checklist')
      .delete()
      .eq('case_id', caseId)

    if (deleteError) throw deleteError
  }

  const templates = await fetchChecklistTemplatesForVisa(supabase, visaType)
  if (templates.length === 0) return 0

  const checklistItems = templates.map((template) => ({
    case_id: caseId,
    template_id: template.id,
    title: template.title,
    description: template.description,
    required: template.required !== false,
    order_index: template.order_index,
    completed: false,
    ...(template.phase != null && { phase: template.phase }),
  }))

  const { error: insertError } = await supabase
    .from('case_checklist')
    .insert(checklistItems)

  if (insertError) throw insertError

  return checklistItems.length
}
