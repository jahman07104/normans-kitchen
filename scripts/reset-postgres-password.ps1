$ErrorActionPreference = "Stop"

$serviceName = "postgresql-x64-12"
$hbaPath = "C:\Program Files\PostgreSQL\12\data\pg_hba.conf"
$backupPath = "C:\Program Files\PostgreSQL\12\data\pg_hba.conf.bak-copilot"
$newPassword = "Nk87f27f2698e4448d42"
$psqlPath = "C:\Program Files\PostgreSQL\12\bin\psql.exe"

Copy-Item $hbaPath $backupPath -Force

try {
  $content = Get-Content $hbaPath
  $content = $content -replace "127\.0\.0\.1/32\s+md5", "127.0.0.1/32            trust"
  $content = $content -replace "::1/128\s+md5", "::1/128                 trust"
  Set-Content -Path $hbaPath -Value $content -Encoding ascii

  Restart-Service $serviceName -Force

  & $psqlPath -h localhost -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD '$newPassword';"
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to alter postgres password"
  }

  Write-Output "password_reset_success"
}
finally {
  if (Test-Path $backupPath) {
    Copy-Item $backupPath $hbaPath -Force
  }
  Restart-Service $serviceName -Force
}
