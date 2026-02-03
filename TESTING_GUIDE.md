# Quick Testing Guide - Personalization Features

## 🧪 How to Test Each Feature

### 1. Test Visa-Specific Onboarding

1. Go to http://localhost:3000/auth/signup
2. Create a new account (or login if you have one)
3. Navigate to "Create New Case" or `/onboarding`
4. **Try this**:
   - Select "D7 Visa" from the dropdown
   - Click "▶ Show details about selected visa"
   - Notice the personalized information appears
   - Try selecting "Golden Visa" - see how the information changes
   - Try "D3 Visa" - notice different processing times and tips

**What to look for**:
- ✓ Each visa shows different processing time (D3: 30-60 days, Golden: 6-12 months)
- ✓ Different success rates (Golden Visa: 95%, D2 Visa: 75%)
- ✓ Visa-specific requirements and tips
- ✓ Smooth animation when info panel appears

---

### 2. Test Personalized Dashboard

1. After creating a case, go to `/dashboard`
2. **What you'll see**:
   - Your visa type displayed in a colored badge
   - "Your [Visa Type] Journey" section
   - Processing time and success rate specific to your visa
   - "What You Need Next" with 3 personalized next steps
   - "Pro Tips for Your Visa" with visa-specific advice

**Try with different visas**:
- **D7 Visa**: See tips about gathering 12 months of bank statements
- **Golden Visa**: See tips about hiring specialized lawyer
- **Student Visa**: See tips about university dormitories

---

### 3. Test Visa-Specific Checklist

1. From dashboard, click on your case
2. Click "View Checklist" or navigate to `/case/[id]/checklist`
3. **What to look for**:
   - Overall progress bar at the top
   - Required documents section (⭐)
   - Optional documents section (💼) if applicable
   - Each document has detailed description
   - Check/uncheck items to see completion update

**Compare different visa types**:
- **D7 Visa**: 10 items (9 required, 1 optional - "Travel Insurance")
- **Golden Visa**: 11 items (all required) - includes "Source of Funds"
- **Student Visa**: 11 items - includes "University Acceptance Letter"
- **Schengen Visa**: 10 items - includes "Travel Itinerary"

---

## 📋 Test Scenarios

### Scenario 1: Retirement to Portugal (D7 Visa)
1. Create account → Onboarding
2. Select "D7 Visa"
3. See: €760/month income requirement
4. Complete case creation
5. Dashboard shows: "Get your NIF (Portuguese tax number)"
6. Checklist shows: 9 required documents including "Proof of Income" for 12 months

### Scenario 2: Tech Professional (D3 Visa)
1. Create account → Onboarding
2. Select "D3 Visa"
3. See: 30-60 days processing (fastest!)
4. See: 90% success rate
5. Dashboard tip: "Check if your employer is Tech Visa certified"
6. Checklist: "Tech Visa Certification" from IAPMEI

### Scenario 3: Investor (Golden Visa)
1. Create account → Onboarding
2. Select "Golden Visa"
3. See: 6-12 months processing
4. See: 95% success rate (highest!)
5. Dashboard: "Choose your investment vehicle"
6. Checklist includes: "Proof of Source of Funds"

### Scenario 4: Student
1. Create account → Onboarding
2. Select "D4 Student Visa"
3. See: €565/month living expense requirement
4. Dashboard tip: "Student visa allows 20 hours/week part-time work"
5. Checklist: "University Acceptance Letter" + "Academic Records"

---

## 🎯 Demo Script for Client

### Opening (30 seconds)
"I want to show you how we've made this truly personalized. Every user gets a completely different experience based on their visa type."

### Demo Flow (3-5 minutes)

1. **Onboarding** (1 min)
   - "Watch what happens when I select different visas..."
   - Switch between D7, Golden Visa, Student Visa
   - "See? Each one shows different requirements, processing times, and expert tips."

2. **Dashboard** (1 min)
   - "Once they create their case, the dashboard is personalized..."
   - Point out visa-specific journey section
   - "These tips are specific to their visa - a D7 applicant gets completely different advice than a Golden Visa investor."

3. **Checklist** (2 min)
   - "And here's the magic - every visa type has its own document checklist."
   - Show D7: "Proof of Income for 12 months"
   - Show Golden Visa: "Proof of Source of Funds" and higher investment docs
   - Show Student: "University Acceptance Letter"
   - "Your specialist only needs to update these once, and every user of that visa type gets the updated list."

4. **Close** (30 sec)
   - "This is completely scalable. Want to add a new visa type? Add it once, and it works everywhere."
   - "Users know exactly what they need. No confusion. No back-and-forth."

---

## 🐛 What to Check for Issues

### Potential Issues to Test:
- [ ] Visa dropdown shows all 10 visa types
- [ ] Visa info panel toggles properly
- [ ] Dashboard loads visa journey section
- [ ] Checklist shows correct documents for visa type
- [ ] Progress percentage calculates correctly
- [ ] Required vs optional documents are separated
- [ ] Checkbox toggles work smoothly
- [ ] Back buttons work
- [ ] Mobile responsiveness (resize browser)

### Expected Counts:
```
D7 Visa: 10 docs
D1 Visa: 10 docs
D2 Visa: 11 docs
D3 Visa: 10 docs
D7 Digital Nomad: 10 docs
Golden Visa: 11 docs
D4 Student Visa: 11 docs
D6 Family Reunification: 10 docs
Schengen Visa: 10 docs
Temporary Stay Visa: 9 docs
```

---

## ✅ Success Checklist

Mark these as you test:
- [ ] Can create new case with each visa type
- [ ] Visa info shows correctly in onboarding
- [ ] Dashboard shows personalized journey
- [ ] Checklist loads with correct documents
- [ ] Documents match visa type (spot check 3 different visas)
- [ ] Completion tracking works
- [ ] UI looks professional
- [ ] No console errors
- [ ] Responsive on mobile view

---

## 🎥 Screen Recording Tips

If recording for client:
1. **Start with homepage** - show professional layout
2. **Sign up flow** - quick and smooth
3. **Onboarding** - show 3 different visa selections
4. **Dashboard** - point out personalized sections
5. **Checklist** - show document list and progress
6. **End with** - "And that's just one user. Every visa type gets this treatment."

Keep it under 5 minutes. Clients appreciate brevity!

---

## 🚀 Go Live!

Your app is ready to demo. All features are:
- ✅ Implemented
- ✅ Database populated
- ✅ Tested (by you now!)
- ✅ Documented
- ✅ Beautiful UI
- ✅ Client-ready

**Good luck with your presentation!** 🇵🇹✨
