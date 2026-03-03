-- D2 Visa (Entrepreneurs / Independent Professional Activity / StartUp Visa) – phased checklist templates
-- Based on VFS Global D2 checklist (e.g. Portugal–Goa): https://www.vfsglobal.com/one-pager/portugal/india/english/pdf/d2-goa-checklist.pdf
-- Run after add-checklist-phase.sql. Deletes existing D2 Visa templates and inserts the full list.

DELETE FROM public.checklist_templates WHERE visa_type = 'D2 Visa';

-- 1. Mandatory Administrative Documents
INSERT INTO public.checklist_templates (visa_type, phase, title, description, required, order_index) VALUES
('D2 Visa', '1. Mandatory Administrative Documents', 'National Visa Application Form', 'Duly filled out, dated, and signed. Free form: https://vistos.mne.gov.pt/images/formulario_visto_nacional_en.pdf — submit all pages. Each applicant submits a complete form individually.', true, 1),
('D2 Visa', '1. Mandatory Administrative Documents', 'Passport', 'Valid for at least 3 months after the planned return date; at least two blank pages; issued within the last 10 years. No observations on biographical data page; no handwritten passports or manual changes after 01/04/2010.', true, 2),
('D2 Visa', '1. Mandatory Administrative Documents', 'Passport Copies', 'Photocopies of the biographic data page and all previous, used pages (visas, stamps). If applicable: previous passports (bound with rubber band, not stapled); copies of previous Schengen, UK, USA or Canada visas.', true, 3),
('D2 Visa', '1. Mandatory Administrative Documents', 'Two Passport-Size Photos', 'Recent (not older than 6 months), white background, 35–40 mm width. One pasted on the application, one clipped on the last page of the passport. ICAO-compliant.', true, 4),
('D2 Visa', '1. Mandatory Administrative Documents', 'NIF (Número de Identificação Fiscal)', 'Portuguese tax number.', true, 5),
('D2 Visa', '1. Mandatory Administrative Documents', 'Proof of Legal Residence', 'If you are not applying from your country of nationality, evidence of legal residence (residence permit) in the country where you apply.', true, 6),
('D2 Visa', '1. Mandatory Administrative Documents', 'Criminal Record Certificate', 'Issued by the competent authority of your country of nationality or where you resided for over a year. Valid only up to 3 months from date of issue. Must be apostilled (Hague Apostille) where applicable.', true, 7),
('D2 Visa', '1. Mandatory Administrative Documents', 'Authorization for AIMA/SEF to Access Records', 'Request for criminal record enquiry by the Immigration and Border Services (SEF/AIMA).', true, 8),
('D2 Visa', '1. Mandatory Administrative Documents', 'Valid Travel Insurance', 'Original; minimum €30,000 coverage for medical expenses, repatriation, urgent medical attention and/or emergency hospital treatment; must cover entire stay in Portugal. Document must be original (with QR code where required).', true, 9),
('D2 Visa', '1. Mandatory Administrative Documents', 'Flight Reservation', 'Flight reservation with the traveller’s name showing the date of entry in Portugal. A tentative booking is sufficient.', true, 10),
('D2 Visa', '1. Mandatory Administrative Documents', 'Personal Covering Letter', 'Original letter introducing yourself, explaining reasons for applying for a D2 visa, and clearly identifying the area(s) and field(s) of work you have experience in. If applying under StartUp Visa, mention it. Include names, passport numbers and relation of accompanying travellers if any.', true, 11),
('D2 Visa', '1. Mandatory Administrative Documents', 'Previous Refused Visas (if any)', 'If you have been refused a visa by an Embassy or High Commission, a refusal notice or written explanation of the reasons for refusal.', false, 12),

-- 2. Proof of Accommodation in Portugal
('D2 Visa', '2. Proof of Accommodation in Portugal', 'Proof of Accommodation in Portugal', 'Supporting documents for private accommodation in Portugal for the period the visa will be valid (120 days). E.g. rental agreement/contract, property deed, or letter of invitation/accommodation from a resident (Termo de Responsabilidade).', true, 20),

-- 3. Proof of Means of Subsistence (Financial Stability)
('D2 Visa', '3. Proof of Means of Subsistence (Financial Stability)', 'Proof of Financial Resources (12 months)', 'Bank statements (stamped and signed by the bank) for the previous 12 months and ITRs for the previous three years. Alternatively: term of responsibility signed by a Portuguese citizen or foreigner legally resident in Portugal (duly recognised by lawyer/notary in Portugal).', true, 30),
('D2 Visa', '3. Proof of Means of Subsistence (Financial Stability)', 'Portuguese Bank Statement / Proof of Funds', 'A bank account in Portugal showing sufficient funds, generally at least one year of minimum guaranteed salary (€10,440+ as of 2025/2026). Proof of financial means available in Portugal and proof of intention to invest.', true, 31),

-- 4. Specific D2 Business Documentation
('D2 Visa', '4. Specific D2 Business Documentation', 'Valid Working Contract or Service Proposal', 'For independent professional activity: contract of employment or written service provider proposal for liberal professionals; if applicable, declaration from competent authorities certifying professional competence. For entrepreneurs: proof that investment operations were executed, proof of financial means in Portugal, and proof of intention to invest in Portugal.', true, 40),
('D2 Visa', '4. Specific D2 Business Documentation', 'Detailed Business Plan', 'A 3–5 year forecast (cash flow, profit/loss) demonstrating viability of the project.', true, 41),
('D2 Visa', '4. Specific D2 Business Documentation', 'Incorporation Documents (if company established)', 'Company registration (Constituent Agreement), tax registration, and social security registration.', true, 42),
('D2 Visa', '4. Specific D2 Business Documentation', 'Contracts / Invoices (Proof of Investment)', 'Proof of investments already made: e.g. lease agreement for office space; service contracts with local Portuguese partners or suppliers; invoices for equipment or setup costs.', true, 43),
('D2 Visa', '4. Specific D2 Business Documentation', 'StartUp Visa – IAPMEI Statement (if applicable)', 'If applying under the StartUp Visa program: valid StartUp Visa Program Statement form issued by IAPMEI, I.P. (valid 180 days from issue), certifying conclusion of a contract with a certified incubator. Applications to StartUp Visa are submitted to IAPMEI; the Statement is submitted with the D2 visa application.', false, 44),

-- 5. Application Submission Steps
('D2 Visa', '5. Application Submission Steps', 'Prepare & Legalize', 'Gather all documents; get required apostilles (e.g. criminal record) and translate documents into Portuguese or English if necessary.', true, 50),
('D2 Visa', '5. Application Submission Steps', 'Make an Appointment', 'Book an appointment with VFS Global or the Portuguese Consulate in your jurisdiction.', true, 51),
('D2 Visa', '5. Application Submission Steps', 'Submit & Biometrics', 'Submit the documents and have your biometric data taken.', true, 52),
('D2 Visa', '5. Application Submission Steps', 'Wait for Approval', 'Standard processing is typically 60 days (may be prolonged). Period starts when the application reaches the Consulate.', true, 53),
('D2 Visa', '5. Application Submission Steps', 'Receive Visa & AIMA Appointment', 'A 4-month (120-day) visa allows two entries into Portugal. Upon arrival, attend your AIMA (formerly SEF) appointment to receive your residency permit.', true, 54),

-- 6. Important Notes (informational; optional)
('D2 Visa', '6. Important Notes', 'Originals & Translations', 'Submit documents as originals and photocopies where required. All documents must be in Portuguese or English; others need certified translation. Non-compliance can lead to rejection. Birth certificate may be requested. Family members can apply together for accompanying family member visa (DF).', false, 60);
