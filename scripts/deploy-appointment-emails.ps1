# Deploy appointment email edge function to Supabase
# Prerequisites: supabase CLI logged in to the account that owns the project
#   supabase login
#   supabase link --project-ref YOUR_PROJECT_REF

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root ".env"

if (-not (Test-Path $envFile)) {
  Write-Error ".env not found at $envFile"
}

Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
  $parts = $_ -split '=', 2
  if ($parts.Count -eq 2) {
    Set-Item -Path "env:$($parts[0].Trim())" -Value $parts[1].Trim()
  }
}

$required = @(
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "ADMIN_NOTIFICATION_EMAIL"
)

foreach ($key in $required) {
  $value = (Get-Item "env:$key" -ErrorAction SilentlyContinue).Value
  if (-not $value) {
    Write-Error "Missing $key in .env"
  }
}

Write-Host "Setting Supabase secrets..."
supabase secrets set `
  "RESEND_API_KEY=$env:RESEND_API_KEY" `
  "RESEND_FROM_EMAIL=$env:RESEND_FROM_EMAIL" `
  "ADMIN_NOTIFICATION_EMAIL=$env:ADMIN_NOTIFICATION_EMAIL" `
  "CLINIC_REPLY_TO_EMAIL=$env:CLINIC_REPLY_TO_EMAIL"

Write-Host "Deploying send-appointment-emails..."
supabase functions deploy send-appointment-emails

Write-Host "Done. Test by submitting the appointment form on the website."
