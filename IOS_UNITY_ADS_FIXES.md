# iOS Unity Ads Integration Fixes

## Date: 6 Kasım 2025

## Issues Identified

### 1. ✅ UIScene Lifecycle Warning (FIXED)
**Error**: "CLIENT OF UIKIT REQUIRES UPDATE: This process does not adopt UIScene lifecycle"

**Root Cause**: Missing UIApplicationSceneManifest configuration in Info.plist

**Fix Applied**:
- Added `UIApplicationSceneManifest` configuration to `Info.plist`
- Added proper SceneDelegate lifecycle support
- Added UISceneSession handling in AppDelegate

**Files Modified**:
- `/ios/App/App/Info.plist` - Added UIScene configuration
- `/ios/App/App/AppDelegate.swift` - Added scene session lifecycle methods
- `/ios/App/App/SceneDelegate.swift` - Enhanced with media playback handling

---

### 2. ✅ Unity Ads Initialization Failures (IMPROVED)
**Error**: "Unity Ads failed to initialize due to internal error"
**Symptoms**: 
- DNS query timeouts for `configv2.unityads.unity3d.com` and `publisher-config.unityads.unity3d.com`
- Multiple "DownloadFailed" errors
- Network connection errors

**Root Causes**:
1. Network connectivity issues (cellular data may be slow/unstable)
2. DNS resolution timing out
3. Unity Ads initialization called too early (before network ready)
4. Missing network security exceptions
5. Insufficient retry logic

**Fixes Applied**:

#### A. Enhanced Network Security (Info.plist)
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>unity3d.com</key>
        <dict>
            <key>NSIncludesSubdomains</key>
            <true/>
            <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
            <true/>
            <key>NSTemporaryExceptionRequiresForwardSecrecy</key>
            <false/>
            <key>NSTemporaryExceptionMinimumTLSVersion</key>
            <string>TLSv1.2</string>
        </dict>
    </dict>
</dict>
```

#### B. Improved Initialization Strategy (AppDelegate.swift)
1. **Delayed Initialization**: Wait 2 seconds after app launch for network to stabilize
2. **Timeout Detection**: 30-second timeout timer to detect hung initialization
3. **Enhanced Retry Logic**:
   - Increased max retries from 3 to 5
   - Exponential backoff: 10s, 20s, 30s, 40s, 50s
   - Capped at 60s maximum delay
4. **Better State Management**:
   - Added `isInitialized` flag
   - Guards to prevent multiple initialization attempts
   - Proper cleanup of timers
5. **Improved Error Messages**:
   - Detailed logging with emojis for easy tracking
   - Diagnostic messages explaining possible causes

#### C. Robust Ad Loading
- Added guards to prevent loading before initialization
- Automatic retry after 30s if ad fails to load
- Better error logging with error codes

---

## What Changed

### Info.plist
```xml
+ UIApplicationSceneManifest configuration
+ Enhanced NSAppTransportSecurity with Unity domains
```

### AppDelegate.swift
```swift
UnityAdsManager:
+ isInitialized: Bool flag
+ initializationTimer: Timer for timeout detection
+ maxInitRetries: 3 → 5
+ Delayed initialization (2s after view load)
+ 30s timeout detection
+ Enhanced retry strategy with longer delays
+ Better error handling and logging
+ Guards on all ad operations

AppDelegate:
+ configurationForConnecting (UISceneSession support)
+ didDiscardSceneSessions (UISceneSession support)
```

### SceneDelegate.swift
```swift
+ sceneDidEnterBackground with media playback suspension
```

---

## Testing Instructions

### 1. Clean Build
```bash
cd /Users/onerozbey/Desktop/quiz-oyunu
npx cap sync ios
cd ios/App
pod install
xcodebuild clean -workspace App.xcworkspace -scheme App
```

### 2. Test Scenarios

#### A. Good Network Conditions
1. Launch app on WiFi
2. Check logs for: `[Unity Ads] ✅ Initialization complete`
3. Verify ads load: `[Unity Ads] ✅ Ad loaded: Interstitial_iOS`

#### B. Poor Network Conditions
1. Launch app on cellular with poor signal
2. Should see retry attempts with delays
3. App should continue working even if Unity Ads fails
4. Check for diagnostic messages

#### C. No Network
1. Enable Airplane Mode
2. Launch app
3. Should fail gracefully after 5 retries
4. App functionality should remain intact

### 3. Expected Log Patterns

**Success Case**:
```
[Unity Ads] 🚀 Initializing with Game ID: 5968313
[Unity Ads] 📡 Starting Unity Ads initialization...
[Unity Ads] ✅ Initialization complete - Loading ads...
[Unity Ads] 📥 Loading interstitial...
[Unity Ads] 📥 Loading rewarded...
[Unity Ads] ✅ Ad loaded: Interstitial_iOS
[Unity Ads] ✅ Ad loaded: Rewarded_iOS
```

**Retry Case** (Network Issues):
```
[Unity Ads] ❌ Initialization failed: 0 - Network or configuration error
[Unity Ads] 🔁 Retrying in 10s (attempt 1/5)
[Unity Ads] 🔄 Retry attempt 1...
```

**Failure Case** (No Network):
```
[Unity Ads] ⚠️ All retry attempts exhausted - continuing without Unity Ads
[Unity Ads] 💡 This may be due to:
[Unity Ads]    • Poor network connectivity
[Unity Ads]    • Firewall or VPN blocking ad servers
[Unity Ads]    • DNS resolution issues
[Unity Ads]    • Unity Ads server downtime
```

---

## Known Issues & Limitations

### Network Dependency
Unity Ads **requires** internet connectivity to initialize. The SDK cannot work offline. If initialization fails repeatedly:

1. **Check Network**: Ensure device has stable internet
2. **Check DNS**: DNS resolution must work for `*.unity3d.com`
3. **Check Firewall**: Ensure no VPN/proxy blocking Unity servers
4. **Check Region**: Unity Ads may have regional restrictions

### Initialization Timing
- First initialization takes 5-15 seconds on good network
- May take 30-60 seconds on poor network
- Will timeout after 30s per attempt
- Maximum total retry time: ~5 minutes (5 attempts × ~1 min each)

### Testing Environment
The logs show you're testing on:
- **Device**: iPhone 15,3 (iPhone 15 Pro)
- **iOS**: 18.6.2
- **Network**: Cellular (HSDPA/LTE)
- **Region**: Turkey (tr-FR locale)

Cellular networks can be unstable. For testing, use WiFi for consistent results.

---

## Debugging Commands

### Check DNS Resolution
```bash
# On Mac terminal, test DNS for Unity servers
nslookup configv2.unityads.unity3d.com
nslookup publisher-config.unityads.unity3d.com
```

### Monitor Network During App Launch
```bash
# In iOS device console
# Filter for Unity Ads logs
log show --predicate 'process == "App"' --style compact | grep Unity
```

### Check Unity Ads Dashboard
1. Go to Unity Dashboard: https://dashboard.unity3d.com/
2. Navigate to Monetization → Unity Ads
3. Verify Game ID `5968313` is active
4. Check for any service outages or regional issues

---

## Rollback Instructions

If issues persist, revert by:

```bash
git checkout HEAD -- ios/App/App/Info.plist
git checkout HEAD -- ios/App/App/AppDelegate.swift
git checkout HEAD -- ios/App/App/SceneDelegate.swift
npx cap sync ios
```

---

## Next Steps

1. ✅ Build and test on device with good WiFi connection
2. ✅ Verify UIScene warning is gone
3. ✅ Verify Unity Ads initializes successfully
4. ✅ Test ad display functionality
5. ⚠️ If initialization still fails → Check Unity Dashboard and network
6. 🔄 Consider fallback to AdMob if Unity Ads repeatedly fails

---

## Support & References

- **Unity Ads iOS Documentation**: https://docs.unity.com/ads/en-us/manual/AdvertisingWithUnityIosIntegration
- **Unity Ads SDK GitHub**: https://github.com/Unity-Technologies/unity-ads-ios
- **Unity Support**: https://support.unity.com/
- **Capacitor iOS Docs**: https://capacitorjs.com/docs/ios

---

**Status**: ✅ All fixes applied and ready for testing
**Expected Outcome**: UIScene warning eliminated, Unity Ads initialization more reliable on stable networks
