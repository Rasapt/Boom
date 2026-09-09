@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ================================================================
REM BOOM AI KONKOOR MENTOR
REM Python 3.12 preferred
REM ================================================================

echo.
echo ================================================================
echo             BOOM AI KONKOOR MENTOR
echo       Setup + RAG + Ollama + Frontend
echo ================================================================
echo.

REM ---- Find Python 3.12 first ------------------------------------
set "PYTHON_CMD="

REM Windows Python launcher (preferred when available)
where py >nul 2>&1
if not errorlevel 1 (
    py -3.12 -c "import sys; print(sys.version)" >nul 2>&1
    if not errorlevel 1 set "PYTHON_CMD=py -3.12"
)

REM Common Python 3.12 install locations
if not defined PYTHON_CMD if exist "%LocalAppData%\Programs\Python\Python312\python.exe" set "PYTHON_CMD=%LocalAppData%\Programs\Python\Python312\python.exe"
if not defined PYTHON_CMD if exist "%ProgramFiles%\Python312\python.exe" set "PYTHON_CMD=%ProgramFiles%\Python312\python.exe"
if not defined PYTHON_CMD if exist "%ProgramFiles%\Python312\python.exe" set "PYTHON_CMD=%ProgramFiles%\Python312\python.exe"

REM Search PATH for a Python 3.12 executable
if not defined PYTHON_CMD (
    for /f "delims=" %%P in ('where python 2^>nul') do (
        "%%P" -c "import sys; raise SystemExit(0 if sys.version_info[:2] == (3,12) else 1)" >nul 2>&1
        if not errorlevel 1 (
            set "PYTHON_CMD=%%P"
            goto :python_found
        )
    )
)

:python_found
if not defined PYTHON_CMD (
    echo [ERROR] Python 3.12 was not found.
    echo.
    echo You said Python 3.12 is installed. If Windows does not expose it
    echo to the Python launcher, run:
    echo.
    echo     py -0p
    echo.
    echo and make sure a Python 3.12 entry appears.
    echo.
    pause
    exit /b 1
)

echo [OK] Using Python 3.12:
%PYTHON_CMD%
%PYTHON_CMD% -c "import sys; print(sys.version)"
echo.

setlocal EnableExtensions EnableDelayedExpansion

REM ================================================================
REM Boom AI Konkoor Mentor - Windows one-click setup + run script
REM Installs/checks Python, Node.js and Ollama, installs project deps,
REM pulls the configured LLM + embedding model, then starts backend
REM and frontend in separate windows.
REM ================================================================

cd /d "%~dp0"
set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"
set "VENV=%BACKEND%\.venv"
set "LLM_MODEL=aya-expanse:8b-q4_K_S"
set "EMBED_MODEL=nomic-embed-text"
set "OLLAMA_URL=http://localhost:11434"

if not exist "%BACKEND%" (
    echo [ERROR] backend folder not found: "%BACKEND%"
    pause
    exit /b 1
)
if not exist "%FRONTEND%" (
    echo [ERROR] frontend folder not found: "%FRONTEND%"
    pause
    exit /b 1
)

call :banner

REM ---------- Check/install Python 3.13 ----------
set "PYEXE="

REM First try the Python launcher specifically for 3.13.
py -3.13 --version >nul 2>&1
if not errorlevel 1 set "PYEXE=py -3.13"

REM Try common per-user/system installation locations.
if not defined PYEXE if exist "%LocalAppData%\Programs\Python\Python313\python.exe" set "PYEXE=%LocalAppData%\Programs\Python\Python313\python.exe"
if not defined PYEXE if exist "%LocalAppData%\Programs\Python\Python313-32\python.exe" set "PYEXE=%LocalAppData%\Programs\Python\Python313-32\python.exe"
if not defined PYEXE if exist "%ProgramFiles%\Python313\python.exe" set "PYEXE=%ProgramFiles%\Python313\python.exe"

REM Finally try python on PATH, but only accept Python 3.13.
if not defined PYEXE (
    for /f "tokens=2" %%V in ('python --version 2^>^&1') do set "PYVER=%%V"
    if "!PYVER!"=="3.13." set "PYEXE=python"
    if not defined PYEXE if /i "!PYVER:~0,4!"=="3.13" set "PYEXE=python"
)

if not defined PYEXE (
    echo [INFO] Python 3.13 was not found. Installing it with winget...
    where winget >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] winget is not available.
        echo Please install Python 3.13 from https://www.python.org/downloads/ and run this file again.
        pause
        exit /b 1
    )
    winget install --id Python.Python.3.13 -e --scope user --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo [ERROR] Python 3.13 installation failed.
        pause
        exit /b 1
    )
    REM winget may not refresh PATH in this CMD session, so check known paths again.
    if exist "%LocalAppData%\Programs\Python\Python313\python.exe" set "PYEXE=%LocalAppData%\Programs\Python\Python313\python.exe"
    if not defined PYEXE if exist "%ProgramFiles%\Python313\python.exe" set "PYEXE=%ProgramFiles%\Python313\python.exe"
    if not defined PYEXE (
        py -3.13 --version >nul 2>&1
        if not errorlevel 1 set "PYEXE=py -3.13"
    )
)

if not defined PYEXE (
    echo [ERROR] Python 3.13 was installed/found, but Windows cannot start it in this window.
    echo Close this window, open a NEW Command Prompt, and run run_boom.bat again.
    pause
    exit /b 1
)

%PYEXE% --version
if errorlevel 1 (
    echo [ERROR] Python could not be started: %PYEXE%
    pause
    exit /b 1
)

REM ---------- Check/install Node.js ----------
where node >nul 2>&1
if errorlevel 1 (
    echo [INFO] Node.js was not found. Installing Node.js LTS with winget...
    where winget >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] winget is not available. Install Node.js LTS manually and run this file again.
        pause
        exit /b 1
    )
    winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo [ERROR] Node.js installation failed.
        pause
        exit /b 1
    )
    set "PATH=%PATH%;%ProgramFiles%\nodejs"
)
node --version
npm --version
if errorlevel 1 (
    echo [ERROR] Node.js/npm could not be started. Close/reopen this window and try again.
    pause
    exit /b 1
)

REM ---------- Check/install Ollama ----------
where ollama >nul 2>&1
if errorlevel 1 (
    echo [INFO] Ollama was not found. Installing Ollama with winget...
    where winget >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] winget is not available. Install Ollama manually from ollama.com and run this file again.
        pause
        exit /b 1
    )
    winget install --id Ollama.Ollama -e --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo [ERROR] Ollama installation failed.
        pause
        exit /b 1
    )
    set "PATH=%PATH%;%LocalAppData%\Programs\Ollama;%ProgramFiles%\Ollama"
)
where ollama >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Ollama is installed but not visible in PATH yet.
    echo Please close this window, open a new Command Prompt, and run run_boom.bat again.
    pause
    exit /b 1
)
ollama --version

REM ---------- Python virtual environment ----------
if not exist "%VENV%\Scripts\python.exe" (
    echo.
    echo [INFO] Creating Python virtual environment...
    %PY% -m venv "%VENV%"
    if errorlevel 1 (
        echo [ERROR] Could not create the Python virtual environment.
        pause
        exit /b 1
    )
)

set "VPY=%VENV%\Scripts\python.exe"
set "PIP=%VENV%\Scripts\pip.exe"

if not exist "%PIP%" (
    echo [ERROR] Virtual environment pip was not created.
    pause
    exit /b 1
)

 echo.
echo [INFO] Upgrading pip...
"%VPY%" -m pip install --upgrade pip
if errorlevel 1 (
    echo [ERROR] pip upgrade failed.
    pause
    exit /b 1
)

echo [INFO] Installing backend Python dependencies...
"%VPY%" -m pip install -r "%BACKEND%\requirements.txt"
if errorlevel 1 (
    echo [ERROR] Backend dependency installation failed.
    echo If EasyOCR/PyTorch installation fails, see backend\README.md for details.
    pause
    exit /b 1
)

REM ---------- Environment file ----------
if not exist "%BACKEND%\.env" (
    if exist "%BACKEND%\.env.example" (
        echo [INFO] Creating backend\.env from .env.example...
        copy /Y "%BACKEND%\.env.example" "%BACKEND%\.env" >nul
    ) else (
        echo [ERROR] backend\.env.example is missing.
        pause
        exit /b 1
    )
)

REM ---------- Frontend dependencies ----------
echo.
echo [INFO] Installing frontend npm dependencies...
cd /d "%FRONTEND%"
if exist package-lock.json (
    call npm ci
) else (
    call npm install
)
if errorlevel 1 (
    echo [ERROR] Frontend dependency installation failed.
    cd /d "%ROOT%"
    pause
    exit /b 1
)
cd /d "%ROOT%"

REM ---------- Start Ollama ----------
echo.
echo [INFO] Starting Ollama if it is not already running...
curl.exe -s "%OLLAMA_URL%/api/tags" >nul 2>&1
if errorlevel 1 (
    start "Ollama" /min cmd /c "ollama serve"
    echo [INFO] Waiting for Ollama...
    set /a OLLAMA_TRIES=0
    :wait_ollama
    timeout /t 2 /nobreak >nul
    curl.exe -s "%OLLAMA_URL%/api/tags" >nul 2>&1
    if errorlevel 1 (
        set /a OLLAMA_TRIES+=1
        if !OLLAMA_TRIES! GEQ 30 (
            echo [ERROR] Ollama did not become ready within 60 seconds.
            pause
            exit /b 1
        )
        goto wait_ollama
    )
)

echo [INFO] Pulling LLM model: %LLM_MODEL%
ollama pull "%LLM_MODEL%"
if errorlevel 1 (
    echo [WARNING] Could not pull %LLM_MODEL%.
    echo [INFO] Trying the standard Aya Expanse 8B tag instead: aya-expanse:8b
    ollama pull "aya-expanse:8b"
    if errorlevel 1 (
        echo [ERROR] Aya Expanse could not be pulled. Check your internet connection and Ollama installation.
        pause
        exit /b 1
    )
    set "LLM_MODEL=aya-expanse:8b"
)

echo [INFO] Pulling embedding model: %EMBED_MODEL%
ollama pull "%EMBED_MODEL%"
if errorlevel 1 (
    echo [ERROR] Could not pull %EMBED_MODEL%.
    pause
    exit /b 1
)

REM Keep .env aligned with the model that was successfully pulled.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='%BACKEND%\.env'; $c=Get-Content $p -Raw; $c=[regex]::Replace($c,'(?m)^LLM_PROVIDER=.*$','LLM_PROVIDER=ollama'); $c=[regex]::Replace($c,'(?m)^LLM_BASE_URL=.*$','LLM_BASE_URL=http://localhost:11434'); $c=[regex]::Replace($c,'(?m)^LLM_MODEL_NAME=.*$','LLM_MODEL_NAME=%LLM_MODEL%'); $c=[regex]::Replace($c,'(?m)^EMBEDDING_MODEL_NAME=.*$','EMBEDDING_MODEL_NAME=%EMBED_MODEL%'); Set-Content -Path $p -Value $c -Encoding UTF8"

REM ---------- Start backend ----------
echo.
echo [INFO] Starting Boom backend on http://localhost:8000 ...
start "Boom Backend" cmd /k "cd /d "%BACKEND%" && "%VPY%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

REM Give FastAPI a moment to initialize before opening frontend.
timeout /t 3 /nobreak >nul

REM ---------- Start frontend ----------
echo [INFO] Starting Boom frontend on http://localhost:8443 ...
start "Boom Frontend" cmd /k "cd /d "%FRONTEND%" && npm run dev"

echo.
echo ================================================================
echo Boom is starting!
echo.
echo Frontend: http://localhost:8443
echo Backend:  http://localhost:8000
echo API docs: http://localhost:8000/docs
echo Ollama:   http://localhost:11434
echo.
echo Keep the Backend and Frontend windows open while using Boom.
echo ================================================================
echo.
start "" http://localhost:8443
pause
exit /b 0

:banner
echo ================================================================
echo             BOOM AI KONKOOR MENTOR
echo        Setup + RAG + Ollama + Frontend
 echo ================================================================
exit /b 0
