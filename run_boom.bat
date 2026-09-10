@echo off
setlocal EnableExtensions EnableDelayedExpansion
title BOOM AI KONKOOR MENTOR
cd /d "%~dp0"
set "ROOT=%~dp0"
if not exist "%ROOT%backend" if exist "%ROOT%Boom-merged\backend" set "ROOT=%ROOT%Boom-merged\"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"
set "VENV=%BACKEND%\.venv"
set "LLM_MODEL=aya-expanse:8b-q4_K_S"
set "EMBED_MODEL=nomic-embed-text"
set "OLLAMA_URL=http://127.0.0.1:11434"

echo ================================================================
echo             BOOM AI KONKOOR MENTOR
echo       Setup + RAG + Ollama + Frontend
echo ================================================================
echo.

if not exist "%BACKEND%" (echo [ERROR] backend folder not found.&pause&exit /b 1)
if not exist "%FRONTEND%" (echo [ERROR] frontend folder not found.&pause&exit /b 1)

REM ----- Python 3.12: never invoke it without an argument -----
set "PYEXE="
where py >nul 2>&1
if not errorlevel 1 py -3.12 -c "import sys; raise SystemExit(0 if sys.version_info[:2]==(3,12) else 1)" >nul 2>&1 && set "PYEXE=py -3.12"
if not defined PYEXE if exist "%LocalAppData%\Programs\Python\Python312\python.exe" set "PYEXE=%LocalAppData%\Programs\Python\Python312\python.exe"
if not defined PYEXE if exist "%ProgramFiles%\Python312\python.exe" set "PYEXE=%ProgramFiles%\Python312\python.exe"
if not defined PYEXE for /f "delims=" %%P in ('where python 2^>nul') do ("%%P" -c "import sys; raise SystemExit(0 if sys.version_info[:2]==(3,12) else 1)" >nul 2>&1 && if not defined PYEXE set "PYEXE=%%P")
if not defined PYEXE (echo [ERROR] Python 3.12 was not found. Run py -0p to check.&pause&exit /b 1)
echo [OK] Using Python 3.12
%PYEXE% --version

REM ----- Node.js -----
where node >nul 2>&1
if errorlevel 1 (
 echo [INFO] Installing Node.js LTS with winget...
 where winget >nul 2>&1 || (echo [ERROR] winget not available. Install Node.js LTS manually.&pause&exit /b 1)
 winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
 if errorlevel 1 (echo [ERROR] Node.js installation failed.&pause&exit /b 1)
 set "PATH=%PATH%;%ProgramFiles%\nodejs;%LocalAppData%\Programs\nodejs"
)
node --version >nul 2>&1 || (echo [ERROR] Node.js is unavailable in this window. Close it and run again.&pause&exit /b 1)
echo [OK] Node.js & node --version

REM ----- Ollama -----
where ollama >nul 2>&1
if errorlevel 1 (
 echo [INFO] Installing Ollama with winget...
 where winget >nul 2>&1 || (echo [ERROR] winget not available. Install Ollama manually from https://ollama.com/download/windows.&pause&exit /b 1)
 winget install --id Ollama.Ollama -e --accept-source-agreements --accept-package-agreements
 if errorlevel 1 (echo [ERROR] Ollama installation failed.&pause&exit /b 1)
 set "PATH=%PATH%;%LocalAppData%\Programs\Ollama;%ProgramFiles%\Ollama"
)
where ollama >nul 2>&1 || (echo [ERROR] Ollama not available in this window. Close it and run again.&pause&exit /b 1)

echo [OK] Ollama found

REM ----- Python virtual environment -----
if not exist "%VENV%\Scripts\python.exe" (
 echo [SETUP] Creating Python 3.12 virtual environment...
 %PYEXE% -m venv "%VENV%"
 if errorlevel 1 (echo [ERROR] Failed to create virtual environment.&pause&exit /b 1)
)
set "VPY=%VENV%\Scripts\python.exe"
if not exist "%VPY%" (echo [ERROR] Virtual environment Python missing.&pause&exit /b 1)

"%VPY%" -m pip install --upgrade pip
if exist "%BACKEND%\requirements.txt" (
 echo [SETUP] Installing backend dependencies...
 "%VPY%" -m pip install -r "%BACKEND%\requirements.txt"
 if errorlevel 1 (echo [ERROR] Backend dependencies failed.&pause&exit /b 1)
)

REM ----- Backend .env -----
if not exist "%BACKEND%\.env" if exist "%BACKEND%\.env.example" copy /Y "%BACKEND%\.env.example" "%BACKEND%\.env" >nul

REM ----- Frontend dependencies -----
cd /d "%FRONTEND%"
if exist package-lock.json (call npm ci) else (call npm install)
if errorlevel 1 (echo [ERROR] Frontend dependencies failed.&pause&exit /b 1)
cd /d "%ROOT%"

REM ----- Start Ollama and wait for API -----
curl.exe -s "%OLLAMA_URL%/api/tags" >nul 2>&1
if errorlevel 1 start "Ollama" /min cmd /c "ollama serve"
set /a tries=0
:waitollama
curl.exe -s "%OLLAMA_URL%/api/tags" >nul 2>&1
if not errorlevel 1 goto ollamaready
set /a tries+=1
if !tries! GEQ 30 (echo [ERROR] Ollama did not become ready.&pause&exit /b 1)
timeout /t 2 /nobreak >nul
goto waitollama
:ollamaready

echo [SETUP] Pulling LLM: %LLM_MODEL%
ollama pull "%LLM_MODEL%"
if errorlevel 1 (
 echo [WARNING] Q4 model unavailable; trying aya-expanse:8b
 set "LLM_MODEL=aya-expanse:8b"
 ollama pull "%LLM_MODEL%"
 if errorlevel 1 (echo [ERROR] Could not pull Aya Expanse.&pause&exit /b 1)
)
echo [SETUP] Pulling embedding model: %EMBED_MODEL%
ollama pull "%EMBED_MODEL%"
if errorlevel 1 (echo [ERROR] Could not pull embedding model.&pause&exit /b 1)

REM ----- Start backend -----
echo [START] Backend: http://localhost:8000
start "Boom Backend" cmd /k "cd /d "%BACKEND%" && "%VPY%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 4 /nobreak >nul

REM ----- Start frontend -----
echo [START] Frontend
start "Boom Frontend" cmd /k "cd /d "%FRONTEND%" && npm run dev"
timeout /t 5 /nobreak >nul
start "" http://localhost:8443

echo.
echo ================================================================
echo BOOM IS STARTING
echo Frontend: http://localhost:8443
echo Backend:  http://localhost:8000
echo ================================================================
pause
