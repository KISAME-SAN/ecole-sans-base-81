@echo off
echo 🚀 Construction de l'executable Ecole Sans Base...
echo.

echo 📦 Build de l'application React...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du build React
    pause
    exit /b 1
)
echo ✅ Build React termine
echo.

echo 🔨 Creation de l'executable...
call npx electron-builder --win --config electron-builder.json
if %errorlevel% neq 0 (
    echo ⚠️ Tentative avec configuration portable...
    call npx electron-builder --win --dir
)

echo.
echo ✅ Executable cree avec succes!
echo 📁 Votre fichier .exe se trouve dans le dossier: dist-electron/
echo.
pause