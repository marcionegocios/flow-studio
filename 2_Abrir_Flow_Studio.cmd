@echo off
title Flow Studio - Painel Visual
echo ========================================================
echo   INICIANDO O PAINEL FLOW STUDIO (http://127.0.0.1:8787)
echo ========================================================
echo.
echo DICA: Se no topo aparecer "Not connected" ou der erro ao gerar:
echo Execute primeiro o "1_Conectar_Google_Flow.cmd" e deixe o Chrome aberto com um projeto!
echo.
cd /d "%~dp0"
if not exist dist call npm run build
node dist\studio.js
pause
