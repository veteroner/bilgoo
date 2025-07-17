@echo off
echo Firebase Rules Deploy Script
echo ============================

echo Checking Firebase CLI...
firebase --version
if %errorlevel% neq 0 (
    echo Firebase CLI not found. Please install it with: npm install -g firebase-tools
    pause
    exit /b 1
)

echo.
echo Deploying Firebase Rules...
firebase deploy --only firestore:rules

if %errorlevel% eq 0 (
    echo.
    echo ✅ Firebase Rules deployed successfully!
    echo.
    echo Fixed Issues:
    echo   - Moved from firebase-rules-updated.json to firestore.rules
    echo   - Fixed JSON syntax error (Firebase Rules != JSON)
    echo   - Added audit_logs (underscore) permission rules
    echo   - Updated firebase.json configuration
    echo.
    echo Your audit logging should now work without permission errors.
) else (
    echo.
    echo ❌ Firebase Rules deployment failed!
    echo Please check your Firebase project configuration.
    echo.
    echo Common issues:
    echo   - Make sure you are logged in: firebase login
    echo   - Check project setup: firebase use --add
    echo   - Verify firestore.rules syntax
)

echo.
pause
