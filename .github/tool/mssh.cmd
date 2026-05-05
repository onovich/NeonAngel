@echo off
setlocal

REM Remote server settings
set "HOST=1.1.1.1"
set "PORT=22"
set "DEFAULT_USER=root"
set "DEFAULT_KEY=%USERPROFILE%\.ssh\id_ed25519"

REM Usage:
REM   mssh.cmd
REM   mssh.cmd <username>
REM   mssh.cmd <username> <private_key_path>
set "USER_NAME=%~1"
set "KEY_PATH=%~2"

if "%USER_NAME%"=="" set "USER_NAME=%DEFAULT_USER%"
if "%KEY_PATH%"=="" set "KEY_PATH=%DEFAULT_KEY%"

if not exist "%KEY_PATH%" (
    echo [ERROR] SSH private key not found: "%KEY_PATH%"
    echo.
    echo Example:
    echo   mssh.cmd ubuntu "%USERPROFILE%\.ssh\id_ed25519"
    exit /b 1
)

echo Connecting to %USER_NAME%@%HOST%:%PORT% ...
echo KeepAlive: ServerAliveInterval=30s, ServerAliveCountMax=3
echo.

ssh -i "%KEY_PATH%" ^
  -p %PORT% ^
  -o ServerAliveInterval=30 ^
  -o ServerAliveCountMax=3 ^
  -o TCPKeepAlive=yes ^
  -o StrictHostKeyChecking=accept-new ^
  %USER_NAME%@%HOST%

endlocal