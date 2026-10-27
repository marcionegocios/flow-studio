@echo off
setlocal
title Flow Studio - Instalador Automatico (Windows)

cd /d "%~dp0"

echo ======================================================================
echo              FLOW STUDIO - INSTALADOR AUTOMATICO (WINDOWS)
echo       Painel Visual e Automacao para Criacao de Videos com IA
echo ======================================================================
echo.

rem Verificacao de descompactacao do ZIP
if not exist "%~dp0package.json" (
    echo [ERRO CRITICO] O arquivo ZIP nao foi extraido!
    echo.
    echo Voce parece estar executando o arquivo direto de dentro do .zip.
    echo.
    echo Para instalar com sucesso:
    echo 1. Clique com o botao direito em "Flow_Studio_Instalador_Windows.zip"
    echo 2. Selecione "Extrair Tudo..." e confirme a pasta
    echo 3. Abra a pasta extraida e execute INSTALAR_FLOW_STUDIO.cmd novamente.
    echo.
    pause
    exit /b 1
)

echo [1/5] Verificando Node.js...
where node >nul 2>nul
if %errorlevel% equ 0 goto node_ok

if exist "C:\Program Files\nodejs\node.exe" (
    set "PATH=C:\Program Files\nodejs;%PATH%"
    goto node_ok
)
if exist "%LOCALAPPDATA%\Programs\node\node.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\node;%PATH%"
    goto node_ok
)

echo [AVISO] Node.js nao encontrado no PATH.
echo Tentando instalar Node.js LTS via winget...
where winget >nul 2>nul
if %errorlevel% neq 0 goto no_winget

winget install OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
if exist "C:\Program Files\nodejs\node.exe" (
    set "PATH=C:\Program Files\nodejs;%PATH%"
    goto node_ok
)

echo.
echo ======================================================================
echo O Node.js foi instalado com sucesso!
echo Para que o Windows atualize o sistema, feche esta janela
echo e execute "INSTALAR_FLOW_STUDIO.cmd" novamente.
echo ======================================================================
echo.
pause
exit /b 0

:no_winget
echo.
echo ======================================================================
echo [AVISO NECESSARIO] O Node.js precisa ser instalado no computador.
echo Por favor, baixe a versao LTS em: https://nodejs.org
echo Instale o Node.js e em seguida execute este instalador novamente.
echo ======================================================================
echo.
pause
exit /b 1

:node_ok
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo [OK] Node.js detectado: %NODE_VER%

echo.
echo [2/5] Verificando Google Chrome...
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" goto chrome_ok
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" goto chrome_ok
if defined LOCALAPPDATA (
    if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" goto chrome_ok
)

echo [AVISO] Google Chrome nao detectado nos caminhos padroes.
echo Tentando instalar Google Chrome via winget...
where winget >nul 2>nul
if %errorlevel% equ 0 (
    winget install Google.Chrome -e --accept-package-agreements --accept-source-agreements
)
goto check_ffmpeg

:chrome_ok
echo [OK] Google Chrome detectado no sistema.

:check_ffmpeg
echo.
echo [3/5] Verificando FFmpeg...
where ffmpeg >nul 2>nul
if %errorlevel% equ 0 goto ffmpeg_ok

echo [AVISO] FFmpeg nao detectado no PATH do sistema.
echo Tentando instalar FFmpeg via winget...
where winget >nul 2>nul
if %errorlevel% equ 0 (
    winget install Gyan.FFmpeg -e --accept-package-agreements --accept-source-agreements
) else (
    echo [AVISO] O FFmpeg pode ser instalado posteriormente se necessario.
)
goto install_deps

:ffmpeg_ok
echo [OK] FFmpeg detectado no sistema.

:install_deps
echo.
echo [4/5] Instalando dependencias do Flow Studio (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ======================================================================
    echo [ERRO] Falha ao executar "npm install".
    echo Verifique sua conexao com a internet e tente novamente.
    echo ======================================================================
    echo.
    pause
    exit /b 1
)

echo.
echo Compilando codigo do Flow Studio (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ======================================================================
    echo [ERRO] Falha ao compilar o Flow Studio.
    echo ======================================================================
    echo.
    pause
    exit /b 1
)

echo.
echo [5/5] Criando Atalho Oficial na Area de Trabalho com o icone do Flow Studio...
cscript //nologo "%~dp0criar_atalho.vbs"
if %errorlevel% neq 0 (
    echo Tentando metodo alternativo para criacao do atalho...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $sc = $ws.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\Flow Studio.lnk'); $sc.TargetPath = '%~dp0Flow Studio.cmd'; $sc.WorkingDirectory = '%~dp0'; $ico = '%~dp0assets\flow_studio.ico'; if (Test-Path $ico) { $sc.IconLocation = $ico + ',0' }; $sc.Description = 'Flow Studio'; $sc.Save()"
)

echo.
echo ======================================================================
echo              INSTALACAO DO FLOW STUDIO CONCLUIDA COM SUCESSO!
echo ======================================================================
echo.
echo COMO USAR NO DIA A DIA:
echo 1. Na sua Area de Trabalho, abra o icone "Flow Studio".
echo    OU execute "Flow Studio.cmd" nesta pasta.
echo 2. Se for a primeira vez, execute "1_Conectar_Google_Flow.cmd" para conectar sua conta Google.
echo.
echo O instalador foi concluido.
pause
exit /b 0
