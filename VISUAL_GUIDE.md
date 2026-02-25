# Visual Guide: Document Upload & Checklist Flow

## Before & After Comparison

### BEFORE (Old System)
- ❌ Users could check items without uploading
- ❌ No visual indication of upload status
- ❌ Generic checklist for all visa types
- ❌ Limited document guidance

### AFTER (New System)
- ✅ **Must upload document before checking**
- ✅ **Clear upload status badges**
- ✅ **Personalized checklist per visa type**
- ✅ **Detailed document descriptions**

---

## Visual Flow

### 1. Checklist Page Display
```
┌─────────────────────────────────────────────┐
│ 📋 Your Document Checklist                  │
│                                             │
│ D7 Visa    In Progress                      │
│                                             │
│ Overall Progress                        75% │
│ ████████████████████░░░░░░                  │
│ 8 of 10 items completed • 7 of 9 required  │
│                                             │
│ ⚠️ 2 required documents still needed.       │
│    Complete these before submitting.        │
└─────────────────────────────────────────────┘
```

### 2. Required Document Item (Not Uploaded)
```
┌─────────────────────────────────────────────┐
│ ☐ Valid Passport                            │
│                                             │
│ Passport valid for minimum 3 months beyond  │
│ planned stay, with at least 2 blank pages.  │
│ Include photocopy of biographical page.     │
│                                             │
│ [📤 Upload Required] ← RED BADGE            │
└─────────────────────────────────────────────┘
```

### 3. Required Document Item (Uploaded, Not Checked)
```
┌─────────────────────────────────────────────┐
│ ☐ Valid Passport                            │
│                                             │
│ Passport valid for minimum 3 months beyond  │
│ planned stay, with at least 2 blank pages.  │
│ Include photocopy of biographical page.     │
│                                             │
│ [📎 Document Uploaded] ← GREEN BADGE        │
└─────────────────────────────────────────────┘
```

### 4. Completed Document
```
┌─────────────────────────────────────────────┐
│ ☑ Valid Passport                            │
│                                             │
│ Passport valid for minimum 3 months beyond  │
│ planned stay, with at least 2 blank pages.  │
│ Include photocopy of biographical page.     │
│                                             │
│ [📎 Document Uploaded]                      │
│ [✓ Completed 2/3/2026]                      │
└─────────────────────────────────────────────┘
```

### 5. Optional Document (Not Uploaded)
```
┌─────────────────────────────────────────────┐
│ ☐ Proof of Income Source (Optional)         │
│                                             │
│ Documentation proving source of passive     │
│ income: pension award letter, investment    │
│ portfolio statements, property rental...    │
│                                             │
│ [📤 Not Yet Uploaded] ← YELLOW BADGE        │
└─────────────────────────────────────────────┘
```

---

## Alert Messages

### When User Tries to Check Without Upload:
```
┌───────────────────────────────────────┐
│          ⚠️ Alert                     │
├───────────────────────────────────────┤
│ Please upload the "Valid Passport"    │
│ document before marking it as         │
│ complete.                             │
│                                       │
│ Go to Upload Documents section to     │
│ add this file.                        │
│                                       │
│                    [OK]               │
└───────────────────────────────────────┘
```

---

## Complete Visa-Specific Examples

### D7 Visa Checklist (10 items)
1. ☐ Completed National Visa Application
2. ☐ 2 Passport Photos
3. ☐ Valid Passport
4. ☐ Travel Insurance
5. ☐ Proof of Accommodation in Portugal
6. ☐ Proof of Passive Income ⭐
7. ☐ Bank Statements (Last 6 Months) ⭐
8. ☐ Criminal Record Certificate
9. ☐ Portuguese Tax Number (NIF) ⭐
10. ☐ Proof of Income Source (Optional)

### D2 Entrepreneur Visa Checklist (11 items)
1. ☐ Completed National Visa Application
2. ☐ 2 Passport Photos
3. ☐ Valid Passport
4. ☐ Travel Insurance
5. ☐ Proof of Accommodation
6. ☐ Detailed Business Plan ⭐
7. ☐ Proof of Investment Capital ⭐
8. ☐ Company Registration Documents ⭐
9. ☐ Criminal Record Certificate
10. ☐ Portuguese Tax Number (NIF) ⭐
11. ☐ Professional Experience Documentation (Optional)

### Golden Visa Checklist (11 items)
1. ☐ Completed National Visa Application
2. ☐ 2 Passport Photos
3. ☐ Valid Passport
4. ☐ Travel Insurance
5. ☐ Proof of Accommodation
6. ☐ Proof of Investment ⭐
7. ☐ Source of Funds Declaration ⭐
8. ☐ Bank Statements ⭐
9. ☐ Criminal Record Certificate
10. ☐ Portuguese Tax Number (NIF) ⭐
11. ☐ Investment Documentation (Optional)

---

## Action Buttons
```
┌─────────────────────────────────────────────┐
│ [📤 Upload Documents]  ← Primary Action     │
│ [✏️ Edit Case]        ← Secondary Action   │
│ [Return to Dashboard] ← Tertiary Action     │
└─────────────────────────────────────────────┘
```

---

## Color Coding

| Status | Color | Badge | Meaning |
|--------|-------|-------|---------|
| **Uploaded** | 🟢 Green | 📎 Document Uploaded | File is in system |
| **Upload Required** | 🔴 Red | 📤 Upload Required | Required doc missing |
| **Not Yet Uploaded** | 🟡 Yellow | 📤 Not Yet Uploaded | Optional doc missing |
| **Completed** | 🟢 Green | ✓ Completed [Date] | Item checked off |

---

## User Journey

```
1. Sign Up → 2. Create Case → 3. View Checklist
                ↓
        Select Visa Type
                ↓
    System generates 9-11 items
                ↓
4. See personalized documents
                ↓
5. Try to check item → ⚠️ Alert!
                ↓
6. Click "Upload Documents"
                ↓
7. Upload file with matching title
                ↓
8. Return to checklist
                ↓
9. Badge changes: 📤 → 📎
                ↓
10. Check item ✓ (now allowed)
                ↓
11. Progress bar updates
                ↓
12. Complete all items → Submit case
```

---

## Technical Details

### Document Matching Logic
- System compares document title with checklist item title
- Uses first 3 words for matching (case-insensitive)
- Example: "Valid Passport" matches "valid_passport.pdf" or "Passport Document.pdf"

### Database Queries
```sql
-- Get checklist for case
SELECT * FROM case_checklist WHERE case_id = ?

-- Get uploaded documents
SELECT * FROM documents WHERE case_id = ?

-- Check if document exists for item
WHERE document.title ILIKE '%passport%'
```

---

## For Demo/Client Presentation

### Key Talking Points:
1. **"We enforce document uploads"** - Users can't skip steps
2. **"Personalized to visa type"** - Each visa has specific requirements
3. **"Based on official requirements"** - All from Portugal SEF/ACM
4. **"Visual progress tracking"** - Users see exactly where they are
5. **"Clear guidance"** - Detailed descriptions for each document

### Demo Script:
1. Create new case with D7 Visa
2. Navigate to checklist
3. Show personalized documents (10 items)
4. Try to check an item → Show alert
5. Go to upload section
6. Upload "Valid Passport" document
7. Return to checklist → Show green badge
8. Check the item → Success!
9. Show progress bar update

---

**Result**: Professional, compliant, user-friendly document management system that guides users through Portugal immigration requirements while enforcing proper workflow.
