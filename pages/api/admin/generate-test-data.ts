import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Create Supabase client with service role key (this bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return res.status(500).json({ error: 'Missing Supabase credentials' })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { type, userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    // Verify user is admin (using service role, RLS bypassed)
    console.log('Checking if user is admin:', userId)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    console.log('User check result:', { user, userError })

    if (userError || !user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    if (type === 'full') {
      // Create case
      console.log('Creating test case for user:', userId)
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          user_id: userId,
          case_type: 'Immigration Application',
          visa_type: 'D7 Visa',
          country_of_origin: 'United States',
          target_visa_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          status: 'in_progress',
        })
        .select()
        .single()

      console.log('Case creation result:', { caseData, caseError })

      if (caseError) {
        console.error('Case creation error:', caseError)
        throw caseError
      }

      // Create checklist
      const checklistItems = [
        {
          title: 'Valid Passport',
          description: 'Passport valid for at least 6 months',
          order_index: 0,
          completed: true,
        },
        {
          title: 'Proof of Income',
          description: 'Bank statements or pension proof',
          order_index: 1,
          completed: true,
        },
        {
          title: 'Criminal Record',
          description: 'From country of origin',
          order_index: 2,
          completed: false,
        },
        {
          title: 'Health Insurance',
          description: 'Valid in Portugal',
          order_index: 3,
          completed: false,
        },
        {
          title: 'Accommodation Proof',
          description: 'Rental agreement or property deed',
          order_index: 4,
          completed: true,
        },
      ]

      const itemsWithCase = checklistItems.map((item) => ({
        ...item,
        case_id: caseData.id,
      }))

      const { error: checklistError } = await supabase
        .from('case_checklist')
        .insert(itemsWithCase)

      if (checklistError) throw checklistError

      // Create documents
      const documentTypes = [
        { title: 'Passport Copy', description: 'All pages', status: 'approved' },
        {
          title: 'Bank Statement',
          description: 'Last 6 months',
          status: 'approved',
        },
        {
          title: 'Criminal Record',
          description: 'From home country',
          status: 'pending',
        },
      ]

      const docs = documentTypes.map((doc, index) => ({
        case_id: caseData.id,
        title: doc.title,
        description: doc.description,
        file_path: `test/${Date.now()}-${index}.pdf`,
        file_name: `${doc.title}.pdf`,
        file_size: Math.floor(Math.random() * 5000000) + 100000,
        mime_type: 'application/pdf',
        uploaded_by: userId,
        status: doc.status,
        admin_notes:
          doc.status === 'approved'
            ? 'Document approved - Test Mode'
            : null,
      }))

      const { error: docsError } = await supabase
        .from('documents')
        .insert(docs)

      if (docsError) throw docsError

      // Create invoice
      const { error: invoiceError } = await supabase.from('invoices').insert({
        case_id: caseData.id,
        amount: '599.99',
        currency: 'EUR',
        description: 'Immigration Services - Full Package (Test)',
        status: 'pending',
      })

      if (invoiceError) throw invoiceError

      res.status(200).json({
        success: true,
        message: 'Full test environment created',
        caseId: caseData.id,
      })
    } else if (type === 'case') {
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          user_id: userId,
          case_type: 'Immigration Application',
          visa_type: 'D7 Visa',
          country_of_origin: 'United States',
          target_visa_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          status: 'in_progress',
        })
        .select()
        .single()

      if (caseError) throw caseError

      // Create checklist
      const checklistItems = [
        {
          title: 'Valid Passport',
          description: 'Passport valid for at least 6 months',
          order_index: 0,
          completed: false,
        },
        {
          title: 'Proof of Income',
          description: 'Bank statements or pension proof',
          order_index: 1,
          completed: false,
        },
        {
          title: 'Criminal Record',
          description: 'From country of origin',
          order_index: 2,
          completed: false,
        },
        {
          title: 'Health Insurance',
          description: 'Valid in Portugal',
          order_index: 3,
          completed: false,
        },
        {
          title: 'Accommodation Proof',
          description: 'Rental agreement or property deed',
          order_index: 4,
          completed: false,
        },
      ]

      const itemsWithCase = checklistItems.map((item) => ({
        ...item,
        case_id: caseData.id,
      }))

      await supabase.from('case_checklist').insert(itemsWithCase)

      res.status(200).json({
        success: true,
        message: 'Test case created',
        caseId: caseData.id,
      })
    } else if (type === 'documents' && req.body.caseId) {
      const documentTypes = [
        { title: 'Passport Copy', description: 'All pages', status: 'approved' },
        {
          title: 'Bank Statement',
          description: 'Last 6 months',
          status: 'approved',
        },
        {
          title: 'Criminal Record',
          description: 'From home country',
          status: 'pending',
        },
        {
          title: 'Health Insurance',
          description: 'Valid insurance proof',
          status: 'needs_revision',
        },
      ]

      const docs = documentTypes.map((doc, index) => ({
        case_id: req.body.caseId,
        title: doc.title,
        description: doc.description,
        file_path: `test/${Date.now()}-${index}.pdf`,
        file_name: `${doc.title}.pdf`,
        file_size: Math.floor(Math.random() * 5000000) + 100000,
        mime_type: 'application/pdf',
        uploaded_by: userId,
        status: doc.status,
        admin_notes:
          doc.status === 'approved'
            ? 'Approved'
            : doc.status === 'needs_revision'
              ? 'Please provide certified translation'
              : null,
      }))

      const { error: docsError } = await supabase
        .from('documents')
        .insert(docs)

      if (docsError) throw docsError

      res.status(200).json({
        success: true,
        message: 'Test documents created',
        count: docs.length,
      })
    } else if (type === 'invoice' && req.body.caseId) {
      const { error: invoiceError } = await supabase.from('invoices').insert({
        case_id: req.body.caseId,
        amount: (Math.random() * 1000 + 200).toFixed(2),
        currency: 'EUR',
        description: 'Immigration Services (Test)',
        status: ['pending', 'paid'][Math.floor(Math.random() * 2)],
      })

      if (invoiceError) throw invoiceError

      res.status(200).json({
        success: true,
        message: 'Test invoice created',
      })
    }
  } catch (error: any) {
    console.error('Test data generation error:', error)
    res.status(500).json({ error: error.message || 'Failed to generate test data' })
  }
}
