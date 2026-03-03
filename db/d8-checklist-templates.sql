-- D8 Visa (Digital Nomad / Remote Work) – phased checklist templates
-- visa_type = 'D7 Digital Nomad' (matches onboarding dropdown for D8 option)
-- Run after add-checklist-phase.sql. Deletes existing D7 Digital Nomad templates and inserts the full list.

DELETE FROM public.checklist_templates WHERE visa_type = 'D7 Digital Nomad';

-- I. Preliminary Requirements (Before Gathering Documents)
INSERT INTO public.checklist_templates (visa_type, phase, title, description, required, order_index) VALUES
('D7 Digital Nomad', 'I. Preliminary Requirements (Before Gathering Documents)', 'NIF (Número de Identificação Fiscal)', 'Portuguese tax ID number, required to open a bank account and lease property.', true, 1),
('D7 Digital Nomad', 'I. Preliminary Requirements (Before Gathering Documents)', 'Open a Portuguese Bank Account', 'Needed to prove financial stability.', true, 2),
('D7 Digital Nomad', 'I. Preliminary Requirements (Before Gathering Documents)', 'Secure Accommodation in Portugal', 'A 12-month lease agreement, hotel booking, or notarized host letter.', true, 3),

-- II. The Document Checklist (In Order of Assembly)
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'D8 Visa Application Form', 'Completed, signed, and dated.', true, 10),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Passport', 'Valid for at least 6 months beyond the intended stay, with 2+ blank pages.', true, 11),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Passport Copies', 'Photocopy of the biographical page and all previous visas.', true, 12),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Passport Photos', 'Two recent, color, biometric-compliant, 35x45mm photos.', true, 13),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Criminal Record Certificate', 'From your home country (and any country lived in for >1 year in the last 5 years), issued within 90 days of application.', true, 14),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Apostille & Translation (Criminal Record)', 'The criminal record must be Apostilled (Hague Convention) and translated into Portuguese by a certified translator.', true, 15),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Proof of Remote Income', 'Employees: Employment contract (signed/active 3+ months) stating remote capability, plus last 3–6 months payslips. Freelancers: Service contracts with non-Portuguese clients and invoices for last 3–6 months.', true, 16),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Proof of Savings', 'Bank statements showing at least €11,040 (12× minimum wage) in a personal account.', true, 17),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Tax Residency Proof', 'Tax returns or proof of tax residency from your current country.', true, 18),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Motivation Letter', 'A letter detailing your remote work and why you want to live in Portugal.', true, 19),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Travel Insurance / Health Insurance', 'Valid for 12 months, covering emergency medical care and repatriation (minimum €30,000 coverage).', true, 20),
('D7 Digital Nomad', 'II. The Document Checklist (In Order of Assembly)', 'Travel Booking', 'Proof of flight booking to Portugal (a reservation is often sufficient).', true, 21),

-- III. Submission and Post-Submission Process
('D7 Digital Nomad', 'III. Submission and Post-Submission Process', 'Book VFS Global Appointment', 'Schedule an appointment at the VFS Global center assigned to your jurisdiction.', true, 30),
('D7 Digital Nomad', 'III. Submission and Post-Submission Process', 'Submit Application', 'Present all original documents and copies at the VFS appointment.', true, 31),
('D7 Digital Nomad', 'III. Submission and Post-Submission Process', 'Wait for Approval', 'Processing takes approximately 60–90 days, sometimes longer.', true, 32),
('D7 Digital Nomad', 'III. Submission and Post-Submission Process', 'Enter Portugal & AIMA Appointment', 'Receive your passport with the 120-day D8 visa stamp (valid for two entries). Upon arrival, attend your pre-assigned AIMA (formerly SEF) appointment to exchange the visa for a 2-year residence permit card.', true, 33),

-- IV. Additional Information (informational; optional)
('D7 Digital Nomad', 'IV. Additional Information', 'Family Members & Translations', 'Family members can apply simultaneously; requires proof of relationship (marriage/birth certificates, apostilled) and an additional 50% income for a spouse and 30% per child. All non-English/Portuguese documents must be translated. Common error: failing to show a 12-month lease or a 12-month remote work contract.', false, 40);
