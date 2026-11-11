@echo off
setlocal
cd /d "%~dp0"
node scripts\check-dependencies.mjs --quiet
if errorlevel 1 (
  echo Instalando as dependencias do projeto...
  call npm install
  if errorlevel 1 (
    echo Nao foi possivel concluir a instalacao.
    pause
    exit /b 1
  )
)
call npm run dev
