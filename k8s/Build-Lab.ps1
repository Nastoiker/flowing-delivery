$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
& docker info --format '{{.OSType}}'
if ($LASTEXITCODE -ne 0) { throw 'Start Docker Desktop with Linux containers first.' }
& docker build -f "$repoRoot/delivery-service/Dockerfile.k8s" -t flowing-delivery-backend:senior "$repoRoot/delivery-service"
if ($LASTEXITCODE -ne 0) { throw 'Backend image build failed.' }
& docker build -f "$repoRoot/frontend/Dockerfile.k8s" -t flowing-delivery-frontend:senior "$repoRoot/frontend"
if ($LASTEXITCODE -ne 0) { throw 'Frontend image build failed.' }
