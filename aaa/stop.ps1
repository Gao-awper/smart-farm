# Smart Farm - Stop All Services (PowerShell, ASCII-only)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "============================================" -ForegroundColor Green
Write-Host "  Smart Farm System - One-Click Stop" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

foreach ($port in @(5173, 8080, 3000, 1883, 8082)) {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($conn in $conns) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        $name = if ($proc) { $proc.ProcessName } else { "unknown" }
        Write-Host "  Kill port $port PID=$($conn.OwningProcess) ($name)"
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "[Done] All services stopped" -ForegroundColor Green
Start-Sleep -Seconds 1
