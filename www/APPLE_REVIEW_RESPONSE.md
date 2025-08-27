# Apple App Review Response - Bilgoo Quiz Game

**App Name**: Bilgoo  
**Submission ID**: b1e2aa72-3ef8-49ec-8718-b63016582b67  
**Response Date**: August 19, 2025

## 1. RESPONSE TO GUIDELINE 2.1 - Information Needed

### Question: "How does the user purchase coins?"

**Answer**: 

Bilgoo does NOT use real money transactions or In-App Purchases. The "coins" mentioned are virtual game points earned through gameplay:

**Virtual Point System (Not Real Money):**
- ✅ Points are earned by answering quiz questions correctly
- ✅ Points are earned by completing daily tasks  
- ✅ Points are earned through achievements
- ✅ Points can be spent on in-game "jokers" (hints) to help with difficult questions
- ✅ Points can be spent on "lives" to continue playing after mistakes

**NO REAL MONEY INVOLVED:**
- ❌ No credit card payments
- ❌ No In-App Purchase transactions
- ❌ No external payment systems
- ❌ No connection to App Store billing

**How the System Works:**
1. User plays quiz and answers questions correctly (+10 points per correct answer)
2. User completes daily tasks (+50-100 points per task)
3. User earns achievements (+25-200 points per achievement)
4. User can spend points in "Joker Store" for game aids:
   - 50:50 Joker (eliminates 2 wrong answers) = 10 points
   - Hint Joker (shows clue) = 15 points  
   - Time Joker (adds 15 seconds) = 20 points
   - Skip Joker (skip question) = 25 points
   - 3 Extra Lives = 30 points

This is a completely free-to-play experience with no monetization through user purchases.

---

## 2. RESPONSE TO GUIDELINE 5.1.1(v) - Data Collection and Storage

### Issue: Account deletion option missing

**RESOLVED**: Account deletion feature has been implemented.

**Location in App**: 
- Go to Profile section (bottom navigation)
- Scroll down to "Profile Actions" 
- Tap "Hesabımı Sil" (Delete My Account) button

**Account Deletion Features Implemented:**

### ✅ In-App Account Deletion
- **Immediate deletion option** - User can delete account instantly
- **Confirmation steps** - Multiple warnings prevent accidental deletion
- **Complete data removal** - All personal data deleted permanently
- **Local storage cleanup** - All cached data removed

### ✅ Email-Based Deletion
- **Email option available** - Users can request deletion via email
- **Direct mailto link** - Opens email app with pre-filled deletion request
- **48-hour processing** - Email requests processed within 48 hours
- **Confirmation provided** - Users receive deletion confirmation

### ✅ Data Deleted Upon Account Deletion
- Account information (email, username)
- Game statistics and scores  
- Friend lists and social connections
- Achievements and badges
- Game preferences and settings
- All personal and profile data
- Firestore database records
- Authentication records

### ✅ GDPR/CCPA Compliance
- Right to deletion fully implemented
- No customer service requirement
- Direct in-app deletion available
- Process documented in privacy policy

**No Additional Requirements Needed**: The app is not in a highly-regulated industry and provides complete self-service account deletion.

---

## 3. RESPONSE TO GUIDELINE 5.1.2 - Legal - Privacy - Data Use and Sharing

### Issue: App Tracking Transparency implementation required

**RESOLVED**: App Tracking Transparency has been fully implemented for iOS.

### ✅ ATT Framework Implementation

**Code Implementation Location:**
- File: `monetization.js` 
- Function: `requestATTPermission()` and `initializeAdMobWithATT()`

**How ATT Works in Our App:**

1. **Permission Request**: 
   - ATT permission requested before any tracking
   - Uses `ATTrackingManager.requestTrackingAuthorization()`
   - Clear permission dialog shown to user

2. **Based on User Choice**:
   - **If user allows tracking**: Personalized ads enabled
   - **If user denies tracking**: Non-personalized ads only (npa=1)
   - **If user doesn't decide**: Non-personalized ads only

3. **No Tracking Without Permission**:
   - AdMob only initializes after ATT permission
   - Cookie consent required for web tracking
   - Firebase Analytics disabled without consent

### ✅ Cookie Handling Compliance

**Web Content Tracking Resolved:**
- **Enhanced cookie consent banner** with detailed information
- **Conditional loading**: AdSense/Analytics only load with user permission
- **Clear opt-out options**: "Essential Only" vs "Accept All"
- **No tracking without consent**: All tracking SDKs require user approval

**Tracking Disclosure:**
- App Store privacy labels updated to show tracking
- Purpose clearly stated: Third-party advertising only
- User control: Complete opt-out available
- Transparency: Full disclosure in privacy policy

### ✅ Technical Implementation

**ATT Status Handling:**
```
- authorized: Full personalized ads
- denied: Non-personalized ads only  
- restricted: Non-personalized ads only
- notDetermined: Request permission first
```

**Cookie Consent Integration:**
- Web users see cookie banner first
- Mobile users get ATT prompt on iOS
- All tracking requires explicit user consent
- Settings can be changed anytime

**Where to Test ATT Permission:**
1. Install app on iOS device
2. Launch app for first time
3. When ads are about to load, ATT permission dialog appears
4. User choice controls all subsequent tracking behavior

### ✅ Documentation Updated
- Privacy policy includes ATT information
- App Store privacy labels show tracking purposes
- User rights clearly documented
- Contact information provided for privacy concerns

---

## 4. ADDITIONAL COMPLIANCE MEASURES

### ✅ Privacy Enhancements Made
- **Conditional script loading**: No automatic tracking
- **Enhanced transparency**: Clear data collection disclosure  
- **User control prioritized**: Easy opt-out mechanisms
- **Minimal data collection**: Only essential data collected
- **Regular compliance audits**: Privacy practices monitored

### ✅ Testing Completed
- ATT implementation tested on iOS devices
- Account deletion tested and verified
- Cookie consent flow tested
- Privacy policy links verified
- All user flows documented

---

## 5. CONFIRMATION OF COMPLIANCE

**All Apple Guidelines Now Met:**

✅ **2.1 - Information Needed**: Coin system explanation provided  
✅ **5.1.1(v) - Account Deletion**: Full deletion feature implemented  
✅ **5.1.2 - ATT Compliance**: Complete ATT framework integrated

**Ready for Re-Review**: All issues have been resolved and features are ready for testing.

**Contact for Questions**: bilgoo.quiz@gmail.com

---

## 6. TESTING INSTRUCTIONS FOR APP REVIEW

### Testing Account Deletion:
1. Create test account or use existing account
2. Navigate to Profile → Scroll to bottom → Tap "Hesabımı Sil" 
3. Follow deletion flow - immediate or email options available
4. Verify account is completely removed

### Testing ATT Implementation (iOS only):
1. Install app on iOS device (iOS 14.5+)
2. Launch app for first time
3. Navigate to areas that would trigger ads
4. ATT permission dialog should appear
5. Test both "Allow" and "Ask App Not to Track" options
6. Verify appropriate ad behavior

### Testing Cookie Consent (Web):
1. Open app in web browser
2. Cookie consent banner should appear immediately
3. Test "Essential Only" and "Accept All" options
4. Verify tracking behavior matches user choice

**All features are production-ready and comply with Apple guidelines.**
