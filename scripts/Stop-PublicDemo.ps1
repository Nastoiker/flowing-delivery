$ErrorActionPreference = 'Stop'
$stateFile = Join-Path (Split-Path $PSScriptRoot -Parent) '.demo-host/tunnel.json'
if (-not (Test-Path $stateFile)) { Write-Host 'No saved tunnel.'; return }
$state = Get-Content $stateFile -Raw | ConvertFrom-Json
$process = Get-Process -Id $state.pid -ErrorAction SilentlyContinue
$binary = Join-Path $env:LOCALAPPDATA 'flowing-delivery-tools/cloudflared.exe'
if ($process -and $process.Path -eq $binary -and $process.StartTime.ToUniversalTime().Ticks.ToString() -eq $state.startTicks) {
    Stop-Process -Id $process.Id
    Write-Host 'External access stopped. Application data and containers are preserved.'
} else { Write-Host 'Saved tunnel process is no longer running.' }
