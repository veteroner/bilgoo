# iOS ATT Permission Setup Instructions

## Required Steps for App Tracking Transparency

### 1. Install Required Plugin
```bash
npm install @capacitor-community/app-tracking-transparency
npx cap sync ios
```

### 2. Info.plist Configuration
Add this to `ios/App/App/Info.plist`:

```xml
<key>NSUserTrackingUsageDescription</key>
<string>Bu uygulama, size daha uygun reklamlar gösterebilmek için cihazınızdan veri toplamak istiyor. Bu veriler yalnızca reklam özelleştirmesi için kullanılır ve üçüncü taraflarla paylaşılmaz.</string>
```

### 3. Build Configuration
Make sure to build with iOS 14.5+ target:
- Open `ios/App/App.xcodeproj` in Xcode
- Set Deployment Target to iOS 14.5 or higher
- Build and test on iOS device

### 4. Testing ATT Flow
1. Reset iOS device advertising identifier: Settings > Privacy & Security > Apple Advertising > Reset Advertising Identifier
2. Install fresh app build
3. Trigger ad loading
4. ATT permission dialog should appear
5. Test both "Allow" and "Ask App Not to Track" options

### 5. Verification Checklist
- [ ] ATT plugin installed and configured
- [ ] Info.plist contains NSUserTrackingUsageDescription
- [ ] App requests permission before tracking
- [ ] Non-personalized ads work when tracking denied
- [ ] Personalized ads work when tracking allowed
- [ ] App Store privacy labels updated
- [ ] Privacy policy mentions ATT

## English Translation for NSUserTrackingUsageDescription:
"This app would like to access your device data to show you more relevant ads. This data is used only for ad personalization and is not shared with third parties."

## Apple Review Notes:
The app now fully implements App Tracking Transparency framework. Permission is requested before any tracking occurs, and users have full control over their privacy preferences.
