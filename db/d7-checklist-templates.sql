-- D7 Visa (Passive Income / Retirement) – phased checklist templates
-- Run after add-checklist-phase.sql. Deletes existing D7 Visa templates and inserts the full list.
-- Progress in the dashboard is driven by document uploads matching each item.

DELETE FROM public.checklist_templates WHERE visa_type = 'D7 Visa';

-- Phase 1: Pre-Application Requirements (In Portugal/Remotely)
INSERT INTO public.checklist_templates (visa_type, phase, title, description, required, order_index) VALUES
('D7 Visa', 'Phase 1: Pre-Application Requirements (In Portugal/Remotely)', 'NIF (Portuguese Tax Number)', 'Obtain a Número de Identificação Fiscal.', true, 1),
('D7 Visa', 'Phase 1: Pre-Application Requirements (In Portugal/Remotely)', 'Portuguese Bank Account', 'Open an account with a Portuguese bank (e.g., Millennium BCP, Novobanco).', true, 2),
('D7 Visa', 'Phase 1: Pre-Application Requirements (In Portugal/Remotely)', 'Proof of Funds (Deposit)', 'Deposit at least 12 months'' worth of the minimum income requirement into the Portuguese bank account (approx. €11,040 – €12,880+ for 2026).', true, 3),
('D7 Visa', 'Phase 1: Pre-Application Requirements (In Portugal/Remotely)', 'Proof of Accommodation (12 Months)', 'A rental contract, lease agreement, or property deed.', true, 4),
('D7 Visa', 'Phase 1: Pre-Application Requirements (In Portugal/Remotely)', 'Accommodation Declaration', 'A notarized statement confirming your housing address in Portugal.', true, 5),

-- Phase 2: Mandatory Documentation (In Country of Origin)
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'D7 Visa Application Form', 'Completed, signed, and dated.', true, 10),
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'Passport', 'Valid for at least 6 months beyond the visa validity, with at least two blank pages.', true, 11),
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'Passport Photos', 'Two recent, color, passport-sized photos.', true, 12),
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'Criminal Record Certificate (Apostilled)', 'Police clearance from your country of origin/residence (e.g., FBI background check for US citizens).', true, 13),
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'Request for Criminal Record Search', 'Signed authorization for SEF to review your Portuguese criminal record.', true, 14),
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'Proof of Passive Income', 'Documents proving income for the last 6–12 months (pension statements, rental contracts, dividend certificates, investment statements).', true, 15),
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'Tax Returns', 'Recent income tax returns (last 3 years often requested).', true, 16),
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'Bank Statements', '6–12 months of statements from your current country of residence showing consistent income flow.', true, 17),
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'Personal Cover Letter (Statement of Purpose)', 'A detailed letter explaining your background, why you want to live in Portugal, and your financial situation.', true, 18),
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'Travel Insurance', 'Valid for 12 months, covering urgent medical care and repatriation, with a minimum coverage of €30,000.', true, 19),
('D7 Visa', 'Phase 2: Mandatory Documentation (In Country of Origin)', 'Flight Reservation', 'A tentative, non-paid flight reservation to Portugal.', true, 20),

-- Phase 3: Submission
('D7 Visa', 'Phase 3: Submission', 'Appointment Confirmation', 'Printed confirmation of your appointment with VFS Global or the Consulate.', true, 30),
('D7 Visa', 'Phase 3: Submission', 'Application Fee', 'Proof of payment of visa fees.', true, 31),

-- Important Notes (informational; optional so progress not blocked)
('D7 Visa', 'Important Notes', 'Apostilles & Translations', 'All official documents (police check, birth certificates) must be legalized with the Hague Apostille. Documents not in Portuguese or English may require certified translation. Dependents require their own applications, marriage certificates (apostilled), and birth certificates (apostilled). D7 visa is typically valid for 4 months to enter Portugal, after which you exchange it for a 2-year residency permit.', false, 40);
