@echo off
setlocal enabledelayedexpansion
title Flow Studio - Instalador Automatico (Windows)

echo ======================================================================
echo              FLOW STUDIO - INSTALADOR AUTOMATICO (WINDOWS)
echo       Painel Visual e Automacao para Criacao de Videos com IA
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando se o Node.js esta instalado...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [AVISO] Node.js nao encontrado no PATH do sistema.
    echo Tentando instalar automaticamente via Windows Package Manager (winget)...
    where winget >nul 2>nul
    if %errorlevel% equ 0 (
        winget install OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
        echo.
        echo [IMPORTANTE] Apos a conclusao do Node.js, feche esta janela e execute o instalador novamente.
        pause
        exit /b 0
    ) else (
        echo [ERRO] O comando winget nao foi encontrado.
        echo Por favor, baixe e instale o Node.js manualmente em: https://nodejs.org
        pause
        exit /b 1
    )
) else (
    for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
    echo [OK] Node.js detectado: !NODE_VER!
)

echo.
echo [2/5] Verificando se o Google Chrome esta instalado...
set CHROME_FOUND=0
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set CHROME_FOUND=1
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set CHROME_FOUND=1
if defined LOCALAPPDATA (
    if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set CHROME_FOUND=1
)

if %CHROME_FOUND% equ 0 (
    echo [AVISO] Google Chrome nao detectado nos caminhos padroes.
    echo Instalando Google Chrome via winget...
    winget install Google.Chrome -e --accept-package-agreements --accept-source-agreements
) else (
    echo [OK] Google Chrome detectado no sistema.
)

echo.
echo [3/5] Verificando se o FFmpeg esta instalado...
where ffmpeg >nul 2>nul
if %errorlevel% neq 0 (
    echo [AVISO] FFmpeg nao encontrado. Instalando via winget...
    where winget >nul 2>nul
    if %errorlevel% equ 0 (
        winget install Gyan.FFmpeg -e --accept-package-agreements --accept-source-agreements
        echo [OK] FFmpeg solicitado via winget.
    ) else (
        echo [AVISO] Nao foi possivel instalar FFmpeg automaticamente.
        echo O Flow Studio funcionara para criacao de cenas, mas a montagem final requer FFmpeg.
    )
) else (
    echo [OK] FFmpeg detectado no sistema.
)

echo.
echo [4/5] Instalando dependencias do Flow Studio (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar npm install.
    pause
    exit /b %errorlevel%
)

echo.
echo Compilando codigo TypeScript (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao compilar o projeto.
    pause
    exit /b %errorlevel%
)

echo.
echo [5/5] Criando Atalho Oficial na Area de Trabalho com o icone do Flow Studio...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$desktop = [Environment]::GetFolderPath('Desktop'); " ^
    "$sh = New-Object -ComObject WScript.Shell; " ^
    "$sc = $sh.CreateShortcut(\"$desktop\Flow Studio.lnk\"); " ^
    "$sc.TargetPath = '%~dp0Flow Studio.cmd'; " ^
    "$sc.WorkingDirectory = '%~dp0'; " ^
    "$ico = '%~dp0assets\flow_studio.ico'; " ^
    "if (Test-Path $ico) { $sc.IconLocation = \"$ico,0\" }; " ^
    "$sc.Description = 'Flow Studio - Painel Visual de Criacao de Videos com IA'; " ^
    "$sc.Save(); " ^
    "Write-Host '[OK] Atalho criado com sucesso na Area de Trabalho!'"

echo.
echo ======================================================================
echo              INSTALACAO DO FLOW STUDIO CONCLUIDA COM SUCESSO!
echo ======================================================================
echo.
echo COMO USAR NO DIA A DIA:
echo 1. Na Area de Trabalho, abra o icone "Flow Studio" OU:
echo 2. Execute "1_Conectar_Google_Flow.cmd" (abre o Chrome para login no Flow).
echo 3. Execute "2_Abrir_Flow_Studio.cmd" (abre o painel http://127.0.0.1:8787).
echo.
set /p START_NOW="Deseja conectar ao Google Flow agora? (S/N): "
if /i "%START_NOW%"=="S" (
    start "" "%~dp01_Conectar_Google_Flow.cmd"
)

echo.
echo Obrigado por instalar o Flow Studio!
pause
