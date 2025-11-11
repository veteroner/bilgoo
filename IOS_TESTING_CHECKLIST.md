# iOS Unity Ads - Testing Checklist

## Pre-Test Setup

- [ ] Connect iPhone to Mac
- [ ] Open Xcode project: `ios/App/App.xcworkspace`
- [ ] Select your device as target (not simulator)
- [ ] Ensure device has good WiFi connection
- [ ] Open Xcode Console to monitor logs

## Test 1: UIScene Lifecycle Warning ✅

**Goal**: Verify the UIScene warning is eliminated

### Steps:
1. Clean build: `Product → Clean Build Folder` (Cmd+Shift+K)
2. Build and run: `Product → Run` (Cmd+R)
3. Monitor Xcode Console during launch

### Expected Result:
❌ **Should NOT see**:
```
CLIENT OF UIKIT REQUIRES UPDATE: This process does not adopt UIScene lifecycle
```

✅ **Should see**: App launches without UIKit warnings

---

## Test 2: Unity Ads Initialization (Good Network) ✅

**Goal**: Verify Unity Ads initializes successfully on WiFi

### Steps:
1. Ensure device is on WiFi (not cellular)
2. Launch app
3. Wait 5-10 seconds
4. Check Xcode Console for Unity Ads logs

### Expected Results:
```
[Unity Ads] 🚀 Initializing with Game ID: 5968313
[Unity Ads] 📡 Starting Unity Ads initialization...
[Unity Ads] ✅ Initialization complete - Loading ads...
[Unity Ads] 📥 Loading interstitial...
[Unity Ads] 📥 Loading rewarded...
[Unity Ads] ✅ Ad loaded: Interstitial_iOS
[Unity Ads] ✅ Ad loaded: Rewarded_iOS
```

### Pass Criteria:
- [ ] No "CLIENT OF UIKIT" warning
- [ ] Unity Ads initializes within 10 seconds
- [ ] Both ad types load successfully
- [ ] No DNS timeout errors

---

## Test 3: Unity Ads Display ✅

**Goal**: Verify ads can be displayed

### Steps:
1. Wait for ads to load (see Test 2)
2. Trigger interstitial ad in your app
3. Verify ad displays
4. Close ad
5. Trigger rewarded ad
6. Watch full video
7. Verify reward granted

### Pass Criteria:
- [ ] Interstitial ad displays correctly
- [ ] Interstitial closes properly
- [ ] Rewarded ad displays correctly
- [ ] Reward is granted after watching

---

## Test 4: Poor Network Handling ⚠️

**Goal**: Verify graceful handling of network issues

### Steps:
1. Switch device to cellular (Settings → WiFi → Off)
2. Ensure cellular signal is weak (2-3 bars)
3. Force quit app
4. Launch app
5. Monitor console for 2-3 minutes

### Expected Results (Retry Logic):
```
[Unity Ads] ❌ Initialization failed: 0 - Network or configuration error
[Unity Ads] 🔁 Retrying in 10s (attempt 1/5)
[Unity Ads] 🔄 Retry attempt 1...
[Unity Ads] ❌ Initialization failed: 0 - Network or configuration error
[Unity Ads] 🔁 Retrying in 20s (attempt 2/5)
...
```

### Pass Criteria:
- [ ] App continues to work despite ad failures
- [ ] Retry attempts happen with delays (10s, 20s, 30s, etc.)
- [ ] Maximum 5 retry attempts
- [ ] App doesn't crash or hang

---

## Test 5: No Network Handling ⚠️

**Goal**: Verify app works without ads when offline

### Steps:
1. Enable Airplane Mode
2. Force quit app
3. Launch app
4. Wait 5 minutes
5. Monitor console

### Expected Results:
```
[Unity Ads] ❌ Initialization failed: 0 - Network or configuration error
[Unity Ads] 🔁 Retrying in 10s (attempt 1/5)
... (multiple retries)
[Unity Ads] ⚠️ All retry attempts exhausted - continuing without Unity Ads
[Unity Ads] 💡 This may be due to:
[Unity Ads]    • Poor network connectivity
[Unity Ads]    • Firewall or VPN blocking ad servers
[Unity Ads]    • DNS resolution issues
[Unity Ads]    • Unity Ads server downtime
```

### Pass Criteria:
- [ ] App launches and works normally
- [ ] Unity Ads gives up after 5 attempts
- [ ] No crashes or infinite loops
- [ ] User can use app features (except ads)

---

## Test 6: Background/Foreground Handling ✅

**Goal**: Verify media and ads handle app lifecycle

### Steps:
1. Launch app with audio playing
2. Press Home button (background app)
3. Wait 5 seconds
4. Tap app icon (foreground app)
5. Check audio state

### Expected Results:
- [ ] Audio pauses when backgrounded
- [ ] Console shows: `Media playback suspended`
- [ ] App resumes correctly when foregrounded
- [ ] No crashes during lifecycle transitions

---

## Test 7: Ad Lifecycle ✅

**Goal**: Verify ad loading/reload cycle

### Steps:
1. Wait for interstitial to load
2. Show interstitial ad
3. Close ad
4. Wait 3 seconds
5. Check console for reload

### Expected Results:
```
[Unity Ads] 📺 Ad show start: Interstitial_iOS
[Unity Ads] ✅ Ad show complete: showCompletionStateCompleted
[Unity Ads] 📥 Loading interstitial...
[Unity Ads] ✅ Ad loaded: Interstitial_iOS
```

### Pass Criteria:
- [ ] Ad displays correctly
- [ ] New ad loads after previous shown
- [ ] Reload happens after 3-second delay
- [ ] Multiple show/reload cycles work

---

## Troubleshooting

### Issue: "Unity Ads ❌ Initialization failed" repeatedly

**Possible Causes**:
1. Poor/no internet connection
2. VPN blocking Unity servers
3. Corporate firewall restrictions
4. DNS resolution failing
5. Unity Ads service outage

**Solutions**:
1. Switch to stable WiFi
2. Disable VPN/proxy
3. Test DNS: `nslookup configv2.unityads.unity3d.com`
4. Check Unity Dashboard for service status
5. Try different network (mobile hotspot, different WiFi)

### Issue: "DNS query timeout" errors

**Cause**: DNS resolver cannot reach Unity servers

**Solutions**:
1. Change DNS to Google DNS (8.8.8.8)
2. Restart device
3. Reset network settings
4. Try different network

### Issue: App hangs during launch

**Cause**: May be waiting for network timeout

**Solution**:
- Current implementation has 30s timeout per attempt
- App should not hang indefinitely
- If hangs persist, check for deadlocks in logs

---

## Success Criteria Summary

**Must Pass**:
- ✅ No UIScene lifecycle warning
- ✅ App launches and works without crashes
- ✅ Unity Ads initializes on good WiFi
- ✅ Ads display correctly when loaded

**Should Pass**:
- ✅ Graceful retry on poor network
- ✅ Graceful failure when offline
- ✅ Background/foreground transitions work

**Optional**:
- Ads load on cellular (may be slower)
- Multiple ad cycles work reliably

---

## After Testing

### If All Tests Pass ✅
1. Commit changes
2. Deploy to TestFlight
3. Monitor crash reports
4. Check Unity Ads revenue in dashboard

### If Tests Fail ❌
1. Capture Xcode Console logs
2. Note exact failure point
3. Check device console for additional errors
4. Review IOS_UNITY_ADS_FIXES.md for rollback steps

---

## Test Results Log

**Date**: _______________
**Tester**: _______________
**Device**: iPhone _______________
**iOS Version**: _______________
**Network**: WiFi / Cellular / Offline

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| UIScene Warning | ☐ | ☐ | |
| Init (Good Network) | ☐ | ☐ | |
| Ad Display | ☐ | ☐ | |
| Poor Network | ☐ | ☐ | |
| No Network | ☐ | ☐ | |
| Background/Foreground | ☐ | ☐ | |
| Ad Lifecycle | ☐ | ☐ | |

**Overall Result**: ✅ PASS / ❌ FAIL / ⚠️ PARTIAL

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
