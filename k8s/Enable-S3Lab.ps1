param([string]$Context = 'kind-flowing-delivery')
$ErrorActionPreference = 'Stop'
if ($Context -notin @('docker-desktop', 'kind-flowing-delivery')) { throw 'Only dedicated local lab contexts are allowed.' }
& kubectl --context $Context -n flowing-delivery-lab get deployment api -o name
if ($LASTEXITCODE -ne 0) { throw 'Deploy the base lab first.' }
$existing = & kubectl --context $Context -n flowing-delivery-lab get secret s3-lab-credentials --ignore-not-found -o name
if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect S3 secret.' }
if (-not $existing) {
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
    $secret = @{
        apiVersion = 'v1'; kind = 'Secret'
        metadata = @{name = 's3-lab-credentials'; namespace = 'flowing-delivery-lab'}
        type = 'Opaque'
        stringData = @{
            AWS_ACCESS_KEY_ID = 'delivery-lab'
            AWS_SECRET_ACCESS_KEY = [Convert]::ToBase64String($bytes)
        }
    }
    $secret | ConvertTo-Json -Depth 5 | & kubectl --context $Context create -f -
    if ($LASTEXITCODE -ne 0) { throw 'Cannot create S3 secret.' }
}
& kubectl --context $Context apply -k "$PSScriptRoot/../deploy/s3-lab"
if ($LASTEXITCODE -ne 0) { throw 'S3 manifest apply failed.' }
& kubectl --context $Context -n flowing-delivery-lab rollout status statefulset/minio --timeout=300s
if ($LASTEXITCODE -ne 0) { throw 'MinIO did not become ready.' }
& kubectl --context $Context -n flowing-delivery-lab wait --for=condition=complete job/s3-lab-create-bucket --timeout=180s
if ($LASTEXITCODE -ne 0) { throw 'Bucket initialization failed.' }
& kubectl --context $Context -n flowing-delivery-lab rollout status deployment/api --timeout=300s
if ($LASTEXITCODE -ne 0) { throw 'API rollout failed.' }
Write-Host 'S3 lab enabled. Restart your API port-forward and run scripts/smoke-storage.cjs.'
