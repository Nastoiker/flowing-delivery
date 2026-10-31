param(
    [string]$AllowedEmail,
    [int]$Port = 5180
)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$repo = Split-Path $PSScriptRoot -Parent
Set-Location $repo
if (-not $AllowedEmail) { $AllowedEmail = (& git config user.email).Trim() }
if ($AllowedEmail -notmatch '^[a-zA-Z0-9._+%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') { throw 'Pass -AllowedEmail with your email address.' }
if ($Port -lt 1024 -or $Port -gt 65535) { throw 'Invalid local port.' }

$toolDir = Join-Path $env:LOCALAPPDATA 'flowing-delivery-tools'
$binary = Join-Path $toolDir 'cloudflared.exe'
New-Item -ItemType Directory -Force $toolDir | Out-Null
$expectedHash = '2493dbc168923bb3e59e5e7716f71deced92992eea9acd6e9d74f84ac7751343'
if (-not (Test-Path $binary) -or (Get-FileHash $binary -Algorithm SHA256).Hash.ToLower() -ne $expectedHash) {
    Invoke-WebRequest -UseBasicParsing -Uri 'https://github.com/cloudflare/cloudflared/releases/download/2026.10.7/cloudflared-windows-amd64.exe' -OutFile $binary
    if ((Get-FileHash $binary -Algorithm SHA256).Hash.ToLower() -ne $expectedHash) { throw 'Cloudflared SHA256 mismatch.' }
}

$env:DEMO_PORT = "$Port"
$env:DEMO_URL = "http://127.0.0.1:$Port"
$bash = Join-Path $env:ProgramFiles 'Git/bin/bash.exe'
& $bash scripts/start-demo.sh
if ($LASTEXITCODE -ne 0) { throw 'Demo startup or smoke check failed.' }

$stateDir = Join-Path $repo '.demo-host'
New-Item -ItemType Directory -Force $stateDir | Out-Null
$stateFile = Join-Path $stateDir 'tunnel.json'
if (Test-Path $stateFile) {
    $old = Get-Content $stateFile -Raw | ConvertFrom-Json
    $process = Get-Process -Id $old.pid -ErrorAction SilentlyContinue
    if ($process -and $process.Path -eq $binary -and $process.StartTime.ToUniversalTime().Ticks.ToString() -eq $old.startTicks) {
        Write-Host "Existing tunnel: $($old.url)/menu (allowed email: $($old.email))"
        return
    }
}
$stderr = Join-Path $stateDir 'cloudflared.log'
$stdout = Join-Path $stateDir 'cloudflared.stdout.log'
$process = Start-Process -FilePath $binary -ArgumentList @('tunnel', '--no-autoupdate', '--protocol', 'http2', '--url', "http://127.0.0.1:$Port", '--allowed-mail', $AllowedEmail) -WindowStyle Hidden -RedirectStandardError $stderr -RedirectStandardOutput $stdout -PassThru
for ($attempt = 0; $attempt -lt 60; $attempt++) {
    Start-Sleep -Seconds 1
    $process.Refresh()
    if ($process.HasExited) { throw "Tunnel exited. Inspect $stderr" }
    $log = Get-Content $stderr -Raw -ErrorAction SilentlyContinue
    if ($log -match 'https://[a-z0-9-]+\.trycloudflare\.com') {
        $url = $matches[0]
        if ($log -notmatch 'Registered tunnel connection') { continue }
        @{ pid = $process.Id; startTicks = $process.StartTime.ToUniversalTime().Ticks.ToString(); url = $url; email = $AllowedEmail; port = $Port } |
            ConvertTo-Json | Set-Content $stateFile -Encoding utf8
        Write-Host "Demo: $url/menu"
        Write-Host "Access: one-time email code for $AllowedEmail"
        return
    }
}
Stop-Process -Id $process.Id
throw 'Tunnel did not return a URL within 60 seconds.'
