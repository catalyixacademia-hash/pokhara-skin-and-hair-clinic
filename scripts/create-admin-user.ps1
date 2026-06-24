# Creates the clinic admin user in Supabase Auth (run once).
# Requires SUPABASE_SERVICE_ROLE_KEY in the repo root .env - never commit that key.
param(
  [string]$Email = "pokharaskinclinic.info@gmail.com",
  [string]$Password = "PokharaSkin@Admin2026"
)

$ErrorActionPreference = "Stop"
$rootEnv = Join-Path (Join-Path $PSScriptRoot "..") ".env"
if (-not (Test-Path $rootEnv)) {
  Write-Error "Missing root .env with SUPABASE_SERVICE_ROLE_KEY and VITE_SUPABASE_URL"
}

Get-Content $rootEnv | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    $name = $matches[1].Trim()
    $value = $matches[2].Trim()
    Set-Item -Path "env:$name" -Value $value
  }
}

$url = $env:VITE_SUPABASE_URL
$key = $env:SUPABASE_SERVICE_ROLE_KEY
if (-not $url -or -not $key) {
  Write-Error "VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
}

$headers = @{
  apikey         = $key
  Authorization  = "Bearer $key"
  "Content-Type" = "application/json"
}

$body = @{
  email         = $Email
  password      = $Password
  email_confirm = $true
} | ConvertTo-Json

try {
  $result = Invoke-RestMethod -Uri "$url/auth/v1/admin/users" -Method POST -Headers $headers -Body $body
  Write-Host "Admin user created: $($result.email) (id: $($result.id))"
} catch {
  $detail = $_.ErrorDetails.Message
  if ($detail -match "already been registered|already exists") {
    Write-Host "Admin user already exists for $Email - updating password..."
    $list = Invoke-RestMethod -Uri "$url/auth/v1/admin/users?email=$([uri]::EscapeDataString($Email))" -Method GET -Headers $headers
    $userId = $list.users[0].id
    $updateBody = @{ password = $Password } | ConvertTo-Json
    Invoke-RestMethod -Uri "$url/auth/v1/admin/users/$userId" -Method PUT -Headers $headers -Body $updateBody | Out-Null
    Write-Host "Password updated for $Email"
  } else {
    throw
  }
}

Write-Host ""
Write-Host "Admin login URL (local): http://localhost:5174/login"
Write-Host "Email:    $Email"
Write-Host "Password: $Password"
Write-Host "Change this password after first sign-in."
