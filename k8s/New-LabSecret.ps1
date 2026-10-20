param([string]$Context = 'docker-desktop')
$ErrorActionPreference = 'Stop'
# Пароли генерируются в памяти; не печатаются и не сохраняются в репозитории.
if ($Context -ne 'docker-desktop') { throw 'This lab script targets docker-desktop only.' }
& kubectl --context $Context get namespace flowing-delivery-lab -o name
if ($LASTEXITCODE -ne 0) { throw 'Create the lab namespace first.' }
$existing = & kubectl --context $Context -n flowing-delivery-lab get secret delivery-secrets --ignore-not-found -o name
if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect secrets.' }
if ($existing) {
    Write-Host 'Secret already exists; keeping credentials matched to persistent databases.'
    exit 0
}
function New-RandomValue {
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
    return [Convert]::ToBase64String($bytes)
}
$secret = @{
    apiVersion = 'v1'
    kind = 'Secret'
    metadata = @{ name = 'delivery-secrets'; namespace = 'flowing-delivery-lab' }
    type = 'Opaque'
    stringData = @{
        DB_PASSWORD = New-RandomValue
        AMQP_PASSWORD = New-RandomValue
        JWT_SECRET = New-RandomValue
    }
}
# create вместо apply: не дублируем stringData в last-applied-configuration.
$secret | ConvertTo-Json -Depth 5 | & kubectl --context $Context create -f -
if ($LASTEXITCODE -ne 0) { throw 'Secret creation failed.' }
