# iOS Error Logs Explained

This document explains the various error messages you may see in iOS console logs and which ones are harmless vs. which require attention.

## ✅ Harmless Errors (Can Be Ignored)

### 1. CoreTelephony XPC Errors
```
Error Domain=NSCocoaErrorDomain Code=4099 "The connection to service named com.apple.commcenter.coretelephony.xpc was invalidated"
```

**Status:** ✅ **HARMLESS** - Expected in iOS Simulator

**Explanation:** The iOS Simulator doesn't have telephony services (phone calls, cellular data). When your app or any framework tries to access these services, iOS logs this error. This is completely normal and doesn't affect app functionality.

**Action:** None required. These errors won't appear on real devices.

---

### 2. WebKit Network App ID Errors
```
Failed to resolve host network app id to config: bundleID: com.apple.WebKit.Networking
```

**Status:** ✅ **HARMLESS** - Internal WebKit Warning

**Explanation:** This is an internal WebKit networking layer warning. It's related to WebKit's internal configuration and doesn't affect your app's network functionality.

**Action:** None required.

---

### 3. Auto Layout Constraint Warnings
```
Unable to simultaneously satisfy constraints.
Will attempt to recover by breaking constraint
```

**Status:** ✅ **HARMLESS** - iOS Auto-Layout Recovery

**Explanation:** iOS automatically resolves constraint conflicts, especially for system UI elements like the keyboard. The system breaks the least important constraint and continues normally.

**Action:** None required unless you see visual layout issues.

---

### 4. RTIInputSystemClient Errors
```
-[RTIInputSystemClient remoteTextInputSessionWithID:performInputOperation:] Can only perform input operation for an active session
```

**Status:** ✅ **HARMLESS** - Text Input System Warning

**Explanation:** These occur when the text input system tries to perform operations on sessions that have already ended. This is common during rapid UI transitions and is handled gracefully by iOS.

**Action:** None required.

---

### 5. WebContent Process Warnings
```
WebContent process took X seconds to launch
WebContent[PID] Unable to hide query parameters from script (missing data)
```

**Status:** ✅ **HARMLESS** - WebKit Process Information

**Explanation:** These are informational messages about WebKit's internal process management. They don't indicate errors.

**Action:** None required.

---

### 6. Factory Registration Warnings
```
AddInstanceForFactory: No factory registered for id <CFUUID>
```

**Status:** ✅ **HARMLESS** - Core Foundation Internal Warning

**Explanation:** Internal Core Foundation warnings that don't affect app functionality.

**Action:** None required.

---

### 7. RBSAssertion Errors
```
Error acquiring assertion: Could not find attribute name in domain plist
Failed to change to usage state 2
```

**Status:** ✅ **HARMLESS** - Background Task System Warnings

**Explanation:** These occur when background task assertions can't be acquired, often in simulators or during app state transitions. The app continues normally.

**Action:** None required unless you're specifically using background tasks.

---

## ⚠️ Errors to Monitor (But Usually OK)

### JavaScript Eval Errors
```
⚡️ JS Eval error A JavaScript exception occurred
```

**Status:** ⚠️ **MONITOR** - Check if functionality is affected

**Explanation:** JavaScript exceptions can occur, but if you see `[iOS] ✅ JavaScript eval success` afterward, the error was handled. The improved error handling in `AppDelegate.swift` now catches and logs these properly.

**Action:** 
- If functionality works normally: ✅ OK
- If functionality is broken: ❌ Investigate the JavaScript code

---

## ❌ Errors That Need Attention

### 1. Navigation Failures
```
[WebView] ❌ Navigation failed: [error description]
```

**Status:** ❌ **INVESTIGATE** - Network or URL issues

**Action:** Check network connectivity, URL validity, and server availability.

---

### 2. Critical JavaScript Errors
```
🚨 JAVASCRIPT ERROR CAUGHT 🚨
[JS Error] ❌ Type: [error type]
[JS Error] 💬 Message: [error message]
```

**Status:** ❌ **INVESTIGATE** - Real JavaScript errors

**Action:** Review the error message, file, and line number. Fix the JavaScript code causing the error.

---

### 3. Unity Ads Initialization Failures
```
[Unity Ads] ❌ Initialization failed: [error] - [message]
```

**Status:** ❌ **INVESTIGATE** - Ad SDK issues

**Action:** Check Unity Ads configuration, network connectivity, and Game ID.

---

## Summary

**Most errors you see are harmless system warnings** that occur in iOS simulators or during normal app operation. The app's error handling has been improved to:

1. ✅ Properly catch and log JavaScript eval errors
2. ✅ Distinguish between critical and non-critical errors
3. ✅ Provide clear logging for debugging

**Focus on:**
- ❌ JavaScript errors that break functionality
- ❌ Navigation/network failures
- ❌ Ad SDK initialization failures

**Ignore:**
- ✅ CoreTelephony XPC errors (simulator only)
- ✅ WebKit internal warnings
- ✅ Auto Layout constraint recovery messages
- ✅ Text input system warnings
- ✅ Background task assertion warnings

---

## Recent Improvements

The following improvements have been made to error handling:

1. **AppDelegate.swift**: Added error handlers for all `evaluateJavaScript` calls
2. **SceneDelegate.swift**: Added error handlers for media pause JavaScript calls
3. **UnityAdsJSInterface.swift**: Added error handlers for ad callback JavaScript calls
4. **Capacitor+Notifications.swift**: Already had proper error handling

All JavaScript eval calls now properly catch and log errors without crashing the app.

