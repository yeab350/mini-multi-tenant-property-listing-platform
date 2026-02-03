# Starts backend + frontend dev servers in separate PowerShell windows.
# Usage: ./scripts/dev.ps1

$repoRoot = Split-Path -Parent $PSScriptRoot

Start-Process powershell -WorkingDirectory (Join-Path $repoRoot 'backend') -ArgumentList @(
  '-NoExit',
  '-Command',
  'npm run start:dev'
)

Start-Process powershell -WorkingDirectory (Join-Path $repoRoot 'frontend') -ArgumentList @(
  '-NoExit',
  '-Command',
  'npm run dev'
)

Write-Host "Backend:  http://localhost:3001/api"
Write-Host "Frontend: http://localhost:3000"
