@echo off
setlocal

if "%~4"=="" (
  echo [GitDeps] Error: missing arguments.
  echo [GitDeps] Usage: GitDeps.cmd REPO_URL LOCAL_REPO_DIR SOURCE_SUBDIR TARGET_DIR [LOCAL_GIT_POLICY]
  echo [GitDeps] LOCAL_GIT_POLICY: remove ^(default^) ^| keep
  echo [GitDeps] This is a generic core script used by higher-level wrappers.
  exit /b 1
)

if not "%~6"=="" (
  echo [GitDeps] Error: too many arguments.
  echo [GitDeps] Usage: GitDeps.cmd REPO_URL LOCAL_REPO_DIR SOURCE_SUBDIR TARGET_DIR [LOCAL_GIT_POLICY]
  exit /b 1
)

set "REPO_URL=%~1"
set "LOCAL_REPO_DIR=%~2"
set "SOURCE_SUBDIR=%~3"
set "TARGET_DIR=%~4"
set "LOCAL_GIT_POLICY=%~5"
if "%LOCAL_GIT_POLICY%"=="" set "LOCAL_GIT_POLICY=keep"
set "LOCAL_SRC_DIR=%LOCAL_REPO_DIR%\%SOURCE_SUBDIR%"

if "%SOURCE_SUBDIR:~0,1%"=="\" (
  echo [GitDeps] Error: SOURCE_SUBDIR must be a relative path: %SOURCE_SUBDIR%
  exit /b 1
)

if /I not "%LOCAL_GIT_POLICY%"=="remove" if /I not "%LOCAL_GIT_POLICY%"=="keep" (
  echo [GitDeps] Error: LOCAL_GIT_POLICY must be "remove" or "keep", got: %LOCAL_GIT_POLICY%
  exit /b 1
)

echo [GitDeps] Repo: %REPO_URL%
echo [GitDeps] Target: %TARGET_DIR%
echo [GitDeps] Source Subdir: %SOURCE_SUBDIR%
echo [GitDeps] Local Repo: %LOCAL_REPO_DIR%
echo [GitDeps] Local .git Policy: %LOCAL_GIT_POLICY%

where git >nul 2>nul
if errorlevel 1 (
  echo [GitDeps] Error: git is not installed or not in PATH.
  exit /b 1
)

if exist "%TARGET_DIR%" (
  echo [GitDeps] Target already exists. Removing: %TARGET_DIR%
  rmdir /s /q "%TARGET_DIR%"
  if errorlevel 1 (
    echo [GitDeps] Error: failed to remove existing target directory.
    exit /b 1
  )
)

if not exist "%LOCAL_REPO_DIR%" (
  echo [GitDeps] Local repo not found. Cloning to: %LOCAL_REPO_DIR%
  git clone --depth 1 "%REPO_URL%" "%LOCAL_REPO_DIR%"
  if errorlevel 1 exit /b 1
) else (
  echo [GitDeps] Using local repo: %LOCAL_REPO_DIR%
)

if /I "%LOCAL_GIT_POLICY%"=="remove" if exist "%LOCAL_REPO_DIR%\.git" (
  echo [GitDeps] Removing git metadata: %LOCAL_REPO_DIR%\.git
  rmdir /s /q "%LOCAL_REPO_DIR%\.git"
  if errorlevel 1 exit /b 1
)

if not exist "%LOCAL_SRC_DIR%" (
  echo [GitDeps] Error: source subdir not found: %LOCAL_SRC_DIR%
  exit /b 1
)

if /I "%LOCAL_GIT_POLICY%"=="keep" (
  robocopy "%LOCAL_SRC_DIR%" "%TARGET_DIR%" /E /XD ".git" /NFL /NDL /NJH /NJS /NP >nul
) else (
  robocopy "%LOCAL_SRC_DIR%" "%TARGET_DIR%" /E /NFL /NDL /NJH /NJS /NP >nul
)
if errorlevel 8 (
  echo [GitDeps] Error: failed to copy source subdir.
  exit /b 1
)

echo [GitDeps] Done.
exit /b 0
