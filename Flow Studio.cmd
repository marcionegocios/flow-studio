@echo off
title Flow Studio - Painel Visual
cd /d "%~dp0"

echo ======================================================================
echo                  FLOW STUDIO - PAINEL VISUAL (AI VIDEO)
echo ======================================================================
echo.

if not exist node_modules (
    echo [AVISO] Primeira execucao detectada. Instalando dependencias...
    call npm install
)

if not exist dist (
    echo [AVISO] Compilando codigo...
    call npm run build
)

echo Iniciando servidor Flow Studio...
echo Acesse no navegador: http://127.0.0.1:8787
echo.
echo DICA: Se aparecer "Not connected" no topo do painel,
echo execute o "1_Conectar_Google_Flow.cmd" para sincronizar com o Chrome!
echo.
node dist\studio.js
pause
