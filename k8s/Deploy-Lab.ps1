param([string]$Context = 'docker-desktop')
$ErrorActionPreference = 'Stop'
if ($Context -ne 'docker-desktop') { throw 'This lab script targets docker-desktop only.' }
# Явный context защищает от случайного применения в другом открытом кластере.
& kubectl --context $Context cluster-info
if ($LASTEXITCODE -ne 0) { throw 'Enable Kubernetes in Docker Desktop first.' }
& kubectl --context $Context apply -f "$PSScriptRoot/namespace.yaml"
if ($LASTEXITCODE -ne 0) { throw 'Namespace creation failed.' }
& "$PSScriptRoot/New-LabSecret.ps1" -Context $Context
if ($LASTEXITCODE -ne 0) { throw 'Secret creation failed.' }
& kubectl --context $Context apply -k $PSScriptRoot
if ($LASTEXITCODE -ne 0) { throw 'Manifest apply failed.' }
foreach ($resource in @('statefulset/postgres', 'statefulset/rabbitmq', 'deployment/account', 'deployment/banner', 'deployment/event', 'deployment/payment', 'deployment/api', 'deployment/frontend')) {
    & kubectl --context $Context -n flowing-delivery-lab rollout status $resource --timeout=300s
    if ($LASTEXITCODE -ne 0) { throw "Rollout failed: $resource. Inspect pods, logs and events." }
}
Write-Host 'Rollout complete. Worker Ready is not proof of an active RMQ consumer: perform the README smoke checks.'
