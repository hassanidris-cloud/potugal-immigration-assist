import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../../lib/supabaseClient'
import Link from 'next/link'
import { getVisaPersonalization } from '../../../lib/visaPersonalization'
import CaseChat from '../../../components/CaseChat'

export default function CaseChecklist() {
  const router = useRouter()
  const { id } = router.query
  const [caseData, setCaseData] = useState<any>(null)
  const [checklist, setChecklist] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    if (id) {
      loadChecklist()
    }
  }, [id])

  const loadChecklist = async () => {
    try {
      // Fetch case
      const { data: caseData } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single()

      setCaseData(caseData)

      // Fetch checklist
      const { data: checklistData } = await supabase
        .from('case_checklist')
        .select('*')
        .eq('case_id', id)
        .order('order_index')

      setChecklist(checklistData || [])

      // Fetch documents
      const { data: documentsData } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', id)

      setDocuments(documentsData || [])
    } catch (error) {
      console.error('Error loading checklist:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleChecklistItem = async (itemId: string, itemTitle: string, completed: boolean) => {
    try {
      // If trying to check (not uncheck), verify document is uploaded
      if (!completed) {
        const hasDocument = documents.some(doc => 
          doc.title.toLowerCase().includes(itemTitle.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase())
        )
        
        if (!hasDocument) {
          alert(`⚠️ Please upload the "${itemTitle}" document before marking it as complete.\n\nGo to Upload Documents section to add this file.`)
          return
        }
      }

      const { error } = await supabase
        .from('case_checklist')
        .update({
          completed: !completed,
          completed_at: !completed ? new Date().toISOString() : null,
        })
        .eq('id', itemId)

      if (error) throw error

      // Reload checklist
      loadChecklist()
    } catch (error) {
      console.error('Error updating checklist:', error)
    }
  }

  const regenerateChecklist = async () => {
    if (!caseData || !id) return
    
    setRegenerating(true)
    try {
      // Delete existing checklist items
      await supabase
        .from('case_checklist')
        .delete()
        .eq('case_id', id)

      // Get templates for this visa type
      const { data: templates } = await supabase
        .from('checklist_templates')
        .select('*')
        .eq('visa_type', caseData.visa_type)
        .order('order_index')

      if (templates && templates.length > 0) {
        const checklistItems = templates.map((template: any) => ({
          case_id: id,
          template_id: template.id,
          title: template.title,
          description: template.description,
          required: template.required,
          order_index: template.order_index,
          completed: false,
        }))

        await supabase.from('case_checklist').insert(checklistItems)
      }

      // Reload checklist
      loadChecklist()
    } catch (error) {
      console.error('Error regenerating checklist:', error)
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (!caseData) return <div style={{ padding: '2rem' }}>Case not found</div>

  const completedCount = checklist.filter(item => item.completed).length
  const totalCount = checklist.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const visaInfo = getVisaPersonalization(caseData?.visa_type || '')
  const requiredItems = checklist.filter(item => item.required !== false)
  const optionalItems = checklist.filter(item => item.required === false)
  const requiredCompleted = requiredItems.filter(item => item.completed).length

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <Link href="/dashboard" style={{ color: '#0066cc', fontSize: '0.95rem', textDecoration: 'none' }}>← Back to Dashboard</Link>
        </header>

        {/* Case Info Card */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#1e293b' }}>📋 Your Document Checklist</h1>
          </div>
          
          {caseData && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <span style={{ 
                padding: '0.5rem 1rem', 
                background: 'linear-gradient(135deg, #0066cc, #00c896)', 
                color: 'white', 
                borderRadius: '20px', 
                fontSize: '0.875rem', 
                fontWeight: '600' 
              }}>
                {caseData.visa_type}
              </span>
              <span style={{ 
                padding: '0.5rem 1rem', 
                background: '#f1f5f9', 
                color: '#475569', 
                borderRadius: '20px', 
                fontSize: '0.875rem', 
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {caseData.status.replace('_', ' ')}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>Overall Progress</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0066cc' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #0066cc, #00c896)', 
                transition: 'width 0.5s ease',
                borderRadius: '6px'
              }} />
            </div>
            <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              {completedCount} of {totalCount} items completed • {requiredCompleted} of {requiredItems.length} required items ✓
            </p>
          </div>

          {/* Warning if not all required items complete */}
          {requiredCompleted < requiredItems.length && (
            <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginTop: '1rem' }}>
              <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>
                ⚠️ <strong>{requiredItems.length - requiredCompleted} required documents</strong> still needed. Complete these before submitting your application.
              </p>
            </div>
          )}
        </div>

        {/* Checklist Items */}
        <div style={{ marginBottom: '2rem' }}>
          {checklist.length === 0 ? (
            <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
              <p style={{ fontSize: '1.1rem', color: '#64748b', margin: '0 0 1.5rem 0' }}>
                No checklist items found for your {caseData?.visa_type}.
              </p>
              <button
                onClick={regenerateChecklist}
                disabled={regenerating}
                style={{
                  padding: '0.9rem 2rem',
                  background: 'linear-gradient(135deg, #0066cc, #00c896)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: regenerating ? 'not-allowed' : 'pointer',
                  opacity: regenerating ? 0.7 : 1
                }}
              >
                {regenerating ? '⏳ Generating...' : '🔄 Generate Checklist'}
              </button>
            </div>
          ) : (
            <>
              {/* Required Items */}
              {requiredItems.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>⭐</span> Required Documents
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {requiredItems.map((item) => {
                      const hasDocument = documents.some(doc => 
                        doc.title.toLowerCase().includes(item.title.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase())
                      )
                      
                      return (
                        <div key={item.id} style={{ 
                          background: 'white', 
                          padding: '1.5rem', 
                          borderRadius: '12px', 
                          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                          border: item.completed ? '2px solid #10b981' : '2px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          transition: 'all 0.3s'
                        }}>
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklistItem(item.id, item.title, item.completed)}
                            style={{ 
                              width: '24px', 
                              height: '24px', 
                              marginTop: '0.25rem', 
                              cursor: 'pointer',
                              accentColor: '#10b981'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h3 style={{ 
                              margin: '0 0 0.5rem 0', 
                              fontSize: '1.1rem',
                              textDecoration: item.completed ? 'line-through' : 'none', 
                              color: item.completed ? '#94a3b8' : '#1e293b' 
                            }}>
                              {item.title}
                            </h3>
                            {item.description && (
                              <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                {item.description}
                              </p>
                            )}
                            
                            {/* Document upload status */}
                            <div style={{ marginTop: '0.5rem' }}>
                              {hasDocument ? (
                                <span style={{ 
                                  fontSize: '0.8rem', 
                                  color: '#059669', 
                                  background: '#d1fae5', 
                                  padding: '0.25rem 0.75rem', 
                                  borderRadius: '12px',
                                  fontWeight: '600'
                                }}>
                                  📎 Document Uploaded
                                </span>
                              ) : (
                                <span style={{ 
                                  fontSize: '0.8rem', 
                                  color: '#dc2626', 
                                  background: '#fee2e2', 
                                  padding: '0.25rem 0.75rem', 
                                  borderRadius: '12px',
                                  fontWeight: '600'
                                }}>
                                  📤 Upload Required
                                </span>
                              )}
                            </div>
                            
                            {item.completed_at && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <span style={{ 
                                  fontSize: '0.8rem', 
                                  color: '#10b981', 
                                  background: '#dcfce7', 
                                  padding: '0.25rem 0.75rem', 
                                  borderRadius: '12px',
                                  fontWeight: '600'
                                }}>
                                  ✓ Completed {new Date(item.completed_at).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Optional Items */}
              {optionalItems.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>💼</span> Optional Documents (Recommended)
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {optionalItems.map((item) => {
                      const hasDocument = documents.some(doc => 
                        doc.title.toLowerCase().includes(item.title.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase())
                      )
                      
                      return (
                        <div key={item.id} style={{ 
                          background: 'white', 
                          padding: '1.5rem', 
                          borderRadius: '12px', 
                          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                          border: item.completed ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          opacity: 0.9
                        }}>
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklistItem(item.id, item.title, item.completed)}
                            style={{ 
                              width: '24px', 
                              height: '24px', 
                              marginTop: '0.25rem', 
                              cursor: 'pointer',
                              accentColor: '#3b82f6'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h3 style={{ 
                              margin: '0 0 0.5rem 0', 
                              fontSize: '1.1rem',
                              textDecoration: item.completed ? 'line-through' : 'none', 
                              color: item.completed ? '#94a3b8' : '#475569' 
                            }}>
                              {item.title} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>(Optional)</span>
                            </h3>
                            {item.description && (
                              <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                {item.description}
                              </p>
                            )}
                            
                            {/* Document upload status */}
                            <div style={{ marginTop: '0.5rem' }}>
                              {hasDocument ? (
                                <span style={{ 
                                  fontSize: '0.8rem', 
                                  color: '#059669', 
                                  background: '#d1fae5', 
                                  padding: '0.25rem 0.75rem', 
                                  borderRadius: '12px',
                                  fontWeight: '600'
                                }}>
                                  📎 Document Uploaded
                                </span>
                              ) : (
                                <span style={{ 
                                  fontSize: '0.8rem', 
                                  color: '#f59e0b', 
                                  background: '#fef3c7', 
                                  padding: '0.25rem 0.75rem', 
                                  borderRadius: '12px',
                                  fontWeight: '600'
                                }}>
                                  📤 Not Yet Uploaded
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link 
            href={`/case/${id}/documents`} 
            style={{ 
              padding: '1rem 2rem', 
              background: 'linear-gradient(135deg, #0066cc, #00c896)', 
              color: 'white', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)',
              transition: 'transform 0.2s'
            }}
          >
            📤 Upload Documents
          </Link>
          <Link 
            href={`/case/${id}/edit`} 
            style={{ 
              padding: '1rem 2rem', 
              background: '#f8fafc', 
              color: '#475569', 
              border: '2px solid #e2e8f0',
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: '600'
            }}
          >
            ✏️ Edit Case
          </Link>
          <Link 
            href="/dashboard" 
            style={{ 
              padding: '1rem 2rem', 
              background: 'white', 
              color: '#0066cc', 
              border: '2px solid #0066cc',
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            Return to Dashboard
          </Link>
        </div>

        {caseData && id && (
          <div style={{ marginTop: '2rem' }}>
            <CaseChat
              caseId={id as string}
              caseUserId={caseData.user_id}
              isSpecialist={false}
              title="Message your specialist"
            />
          </div>
        )}
      </div>
    </div>
  )
}
