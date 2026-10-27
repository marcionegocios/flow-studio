@echo off
title 1 - Conectar ao Google Flow
echo ========================================================
echo   ABRINDO O CHROME DEDICADO DO GOOGLE FLOW
echo ========================================================
echo.
echo 1. Uma janela limpa do Google Chrome vai se abrir.
echo 2. Faca login com a sua conta Google (Gmail normal).
echo 3. No site flow.google.com, crie um "New Project" ou abra um existente.
echo 4. IMPORTANTE: DEIXE ESSA JANELA DO CHROME ABERTA (pode minimizar).
echo.
cd /d "%~dp0"
if not exist dist call npm run build
node dist\login.js
echo.
echo ========================================================
echo   CONEXAO PRONTA! AGORA VOCE PODE ABRIR O FLOW STUDIO.
echo ========================================================
pause
