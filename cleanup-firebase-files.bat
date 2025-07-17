@echo off
echo Firebase Files Cleanup
echo ======================

echo Renaming old firebase-rules-updated.json to backup...
if exist firebase-rules-updated.json (
    ren firebase-rules-updated.json firebase-rules-updated.json.backup
    echo ✅ Old file renamed to firebase-rules-updated.json.backup
) else (
    echo ⚠️ firebase-rules-updated.json file not found
)

echo.
echo Current Firebase configuration files:
echo - firebase.json (main config)
echo - firestore.rules (Firestore security rules)
echo - firebase-rules-updated.json.backup (old backup)
echo.
echo Firebase Rules structure is now properly configured! 🎉
echo.
pause
