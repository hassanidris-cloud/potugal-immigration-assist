-- Checklist Templates for Different Visa Types
-- Run this after schema.sql to populate checklist templates

-- D7 Visa (Passive Income / Retirement Visa)
INSERT INTO public.checklist_templates (visa_type, title, description, required, order_index) VALUES
('D7 Visa', 'Valid Passport', 'Passport valid for at least 3 months beyond intended stay, with at least 2 blank pages', true, 1),
('D7 Visa', 'Visa Application Form', 'Completed and signed National Visa application form', true, 2),
('D7 Visa', 'Passport Photos', 'Two recent passport-sized photos (35mm x 45mm) with white background', true, 3),
('D7 Visa', 'Proof of Income', 'Bank statements showing minimum €760/month (single) or €1,140/month (couple) for past 12 months', true, 4),
('D7 Visa', 'Proof of Address in Portugal', 'Rental agreement or property deed in Portugal', true, 5),
('D7 Visa', 'Criminal Record Certificate', 'Criminal background check from your home country (apostilled)', true, 6),
('D7 Visa', 'Health Insurance', 'Valid health insurance covering Portugal (minimum €30,000 coverage)', true, 7),
('D7 Visa', 'Medical Certificate', 'Medical certificate stating you have no contagious diseases', true, 8),
('D7 Visa', 'NIF (Tax Number)', 'Portuguese Tax Identification Number', true, 9),
('D7 Visa', 'Travel Insurance', 'Travel insurance valid for Schengen area', false, 10);

-- D1 Visa (Work Visa - Employed Workers)
INSERT INTO public.checklist_templates (visa_type, title, description, required, order_index) VALUES
('D1 Visa', 'Valid Passport', 'Passport valid for at least 3 months beyond intended stay', true, 1),
('D1 Visa', 'Visa Application Form', 'Completed and signed National Visa application form', true, 2),
('D1 Visa', 'Passport Photos', 'Two recent passport-sized photos (35mm x 45mm)', true, 3),
('D1 Visa', 'Employment Contract', 'Valid employment contract with Portuguese company', true, 4),
('D1 Visa', 'Work Authorization', 'IEFP authorization or manifestation of interest from Portuguese employer', true, 5),
('D1 Visa', 'Professional Qualifications', 'Diplomas, certificates, or proof of professional qualifications', true, 6),
('D1 Visa', 'Criminal Record Certificate', 'Criminal background check from your home country (apostilled)', true, 7),
('D1 Visa', 'Health Insurance', 'Valid health insurance covering Portugal', true, 8),
('D1 Visa', 'Proof of Accommodation', 'Rental agreement or hotel reservation in Portugal', true, 9),
('D1 Visa', 'NIF (Tax Number)', 'Portuguese Tax Identification Number', false, 10);

-- D2 Visa (Entrepreneur / Self-Employment)
INSERT INTO public.checklist_templates (visa_type, title, description, required, order_index) VALUES
('D2 Visa', 'Valid Passport', 'Passport valid for at least 3 months beyond intended stay', true, 1),
('D2 Visa', 'Visa Application Form', 'Completed and signed National Visa application form', true, 2),
('D2 Visa', 'Passport Photos', 'Two recent passport-sized photos', true, 3),
('D2 Visa', 'Business Plan', 'Detailed business plan for your entrepreneurial activity in Portugal', true, 4),
('D2 Visa', 'Proof of Funds', 'Bank statements showing sufficient capital to support yourself and business', true, 5),
('D2 Visa', 'Company Registration Documents', 'Certificate of incorporation or business registration in Portugal', true, 6),
('D2 Visa', 'Professional Qualifications', 'Proof of experience or qualifications relevant to your business', true, 7),
('D2 Visa', 'Criminal Record Certificate', 'Criminal background check from your home country (apostilled)', true, 8),
('D2 Visa', 'Health Insurance', 'Valid health insurance covering Portugal', true, 9),
('D2 Visa', 'Proof of Accommodation', 'Rental agreement or property deed in Portugal', true, 10),
('D2 Visa', 'NIF (Tax Number)', 'Portuguese Tax Identification Number', true, 11);

-- D3 Visa (Highly Qualified Activity / Tech Visa)
INSERT INTO public.checklist_templates (visa_type, title, description, required, order_index) VALUES
('D3 Visa', 'Valid Passport', 'Passport valid for at least 3 months beyond intended stay', true, 1),
('D3 Visa', 'Visa Application Form', 'Completed and signed National Visa application form', true, 2),
('D3 Visa', 'Passport Photos', 'Two recent passport-sized photos', true, 3),
('D3 Visa', 'Employment Contract', 'Contract with certified Tech Visa employer in Portugal', true, 4),
('D3 Visa', 'Academic Qualifications', 'University degree (Bachelor, Master, or PhD) relevant to tech sector', true, 5),
('D3 Visa', 'Professional Experience', 'CV showing at least 3 years experience in tech or highly qualified activity', true, 6),
('D3 Visa', 'Tech Visa Certification', 'Certification from IAPMEI confirming employer eligibility', true, 7),
('D3 Visa', 'Criminal Record Certificate', 'Criminal background check from your home country (apostilled)', true, 8),
('D3 Visa', 'Health Insurance', 'Valid health insurance covering Portugal', true, 9),
('D3 Visa', 'Proof of Accommodation', 'Rental agreement or hotel reservation', true, 10);

-- D7 Digital Nomad Visa
INSERT INTO public.checklist_templates (visa_type, title, description, required, order_index) VALUES
('D7 Digital Nomad', 'Valid Passport', 'Passport valid for at least 3 months beyond intended stay', true, 1),
('D7 Digital Nomad', 'Visa Application Form', 'Completed and signed National Visa application form', true, 2),
('D7 Digital Nomad', 'Passport Photos', 'Two recent passport-sized photos', true, 3),
('D7 Digital Nomad', 'Proof of Remote Work', 'Employment contract or client contracts showing remote work capability', true, 4),
('D7 Digital Nomad', 'Proof of Income', 'Bank statements showing minimum €3,040/month (4x Portugal minimum wage)', true, 5),
('D7 Digital Nomad', 'Tax Returns', 'Last 3 months of income tax returns or equivalent', true, 6),
('D7 Digital Nomad', 'Proof of Accommodation', 'Rental agreement or property proof in Portugal', true, 7),
('D7 Digital Nomad', 'Criminal Record Certificate', 'Criminal background check (apostilled)', true, 8),
('D7 Digital Nomad', 'Health Insurance', 'Valid health insurance covering Portugal', true, 9),
('D7 Digital Nomad', 'NIF (Tax Number)', 'Portuguese Tax Identification Number', true, 10);

-- Golden Visa
INSERT INTO public.checklist_templates (visa_type, title, description, required, order_index) VALUES
('Golden Visa', 'Valid Passport', 'Passport valid for at least 3 months', true, 1),
('Golden Visa', 'Visa Application Form', 'Completed Golden Visa application form', true, 2),
('Golden Visa', 'Passport Photos', 'Two recent passport-sized photos', true, 3),
('Golden Visa', 'Proof of Investment', 'Documentation of qualifying investment (property deed, fund certificate, etc.)', true, 4),
('Golden Visa', 'Criminal Record Certificate', 'Criminal background check from all countries of residence (apostilled)', true, 5),
('Golden Visa', 'Proof of Legal Entry', 'Valid Schengen visa or entry stamp', true, 6),
('Golden Visa', 'Health Insurance', 'Valid health insurance covering Portugal', true, 7),
('Golden Visa', 'Proof of Source of Funds', 'Bank statements and documentation showing legal origin of investment funds', true, 8),
('Golden Visa', 'Portuguese Address', 'Proof of address in Portugal (property or rental)', true, 9),
('Golden Visa', 'NIF (Tax Number)', 'Portuguese Tax Identification Number', true, 10),
('Golden Visa', 'Portuguese Bank Account', 'Proof of bank account in Portugal', true, 11);

-- Student Visa (D4)
INSERT INTO public.checklist_templates (visa_type, title, description, required, order_index) VALUES
('D4 Student Visa', 'Valid Passport', 'Passport valid for duration of studies plus 3 months', true, 1),
('D4 Student Visa', 'Visa Application Form', 'Completed and signed National Visa application form', true, 2),
('D4 Student Visa', 'Passport Photos', 'Two recent passport-sized photos', true, 3),
('D4 Student Visa', 'University Acceptance Letter', 'Official acceptance from Portuguese educational institution', true, 4),
('D4 Student Visa', 'Proof of Enrollment', 'Proof of enrollment and tuition payment or payment plan', true, 5),
('D4 Student Visa', 'Academic Records', 'Previous diplomas, transcripts, and academic certificates', true, 6),
('D4 Student Visa', 'Proof of Financial Means', 'Bank statements showing minimum €565/month for duration of studies', true, 7),
('D4 Student Visa', 'Proof of Accommodation', 'Dormitory confirmation, rental agreement, or host letter', true, 8),
('D4 Student Visa', 'Criminal Record Certificate', 'Criminal background check (apostilled)', true, 9),
('D4 Student Visa', 'Health Insurance', 'Valid health insurance covering Portugal', true, 10),
('D4 Student Visa', 'Travel Insurance', 'Travel insurance for initial entry', false, 11);

-- Family Reunification Visa (D6)
INSERT INTO public.checklist_templates (visa_type, title, description, required, order_index) VALUES
('D6 Family Reunification', 'Valid Passport', 'Passport valid for at least 3 months', true, 1),
('D6 Family Reunification', 'Visa Application Form', 'Completed and signed National Visa application form', true, 2),
('D6 Family Reunification', 'Passport Photos', 'Two recent passport-sized photos', true, 3),
('D6 Family Reunification', 'Proof of Relationship', 'Marriage certificate, birth certificate, or partnership proof', true, 4),
('D6 Family Reunification', 'Sponsor Residence Permit', 'Copy of family member residence permit in Portugal', true, 5),
('D6 Family Reunification', 'Sponsor Income Proof', 'Proof sponsor can financially support family (employment contract, income statements)', true, 6),
('D6 Family Reunification', 'Proof of Accommodation', 'Rental agreement or property deed showing adequate space', true, 7),
('D6 Family Reunification', 'Criminal Record Certificate', 'Criminal background check (apostilled)', true, 8),
('D6 Family Reunification', 'Health Insurance', 'Valid health insurance covering Portugal', true, 9),
('D6 Family Reunification', 'Sponsor Declaration', 'Signed declaration from sponsor accepting responsibility', true, 10);

-- Schengen Short-Stay Visa
INSERT INTO public.checklist_templates (visa_type, title, description, required, order_index) VALUES
('Schengen Visa', 'Valid Passport', 'Passport valid for at least 3 months beyond intended stay', true, 1),
('Schengen Visa', 'Visa Application Form', 'Completed Schengen visa application form', true, 2),
('Schengen Visa', 'Passport Photos', 'Two recent passport-sized photos', true, 3),
('Schengen Visa', 'Travel Itinerary', 'Flight reservations and detailed travel plan', true, 4),
('Schengen Visa', 'Accommodation Proof', 'Hotel bookings or invitation letter with host address', true, 5),
('Schengen Visa', 'Travel Insurance', 'Travel insurance minimum €30,000 coverage for all Schengen countries', true, 6),
('Schengen Visa', 'Proof of Financial Means', 'Bank statements showing €65/day for duration of stay', true, 7),
('Schengen Visa', 'Employment Letter', 'Letter from employer confirming employment and approved leave', true, 8),
('Schengen Visa', 'Proof of Ties to Home Country', 'Property deeds, family ties, or return flight tickets', true, 9),
('Schengen Visa', 'Visa Fee Payment', 'Receipt of visa application fee payment (€80)', true, 10);

-- Temporary Stay Visa
INSERT INTO public.checklist_templates (visa_type, title, description, required, order_index) VALUES
('Temporary Stay Visa', 'Valid Passport', 'Passport valid for at least 3 months', true, 1),
('Temporary Stay Visa', 'Visa Application Form', 'Completed temporary visa application form', true, 2),
('Temporary Stay Visa', 'Passport Photos', 'Two recent passport-sized photos', true, 3),
('Temporary Stay Visa', 'Purpose Documentation', 'Documentation supporting reason for stay (medical, research, seasonal work)', true, 4),
('Temporary Stay Visa', 'Accommodation Proof', 'Hotel reservation or rental agreement', true, 5),
('Temporary Stay Visa', 'Financial Proof', 'Bank statements showing ability to support yourself', true, 6),
('Temporary Stay Visa', 'Health Insurance', 'Valid health insurance covering Portugal', true, 7),
('Temporary Stay Visa', 'Return Ticket', 'Proof of return or onward travel', true, 8),
('Temporary Stay Visa', 'Criminal Record Certificate', 'Criminal background check if stay exceeds 3 months', false, 9);

COMMIT;
