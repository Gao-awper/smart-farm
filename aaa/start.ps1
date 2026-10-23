# Smart Farm - Start All Services (PowerShell, ASCII-only)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "============================================" -ForegroundColor Green
Write-Host "  Smart Farm System - One-Click Start" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Wait-Port {
    param([int]$Port, [int]$TimeoutSec = 45, [string]$Label = "service")
    $deadline = (Get-Date).AddSeconds($TimeoutSec)
    while ((Get-Date) -lt $deadline) {
        $ok = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        if ($ok) { return $true }
        Start-Sleep -Seconds 2
    }
    Write-Host "  [!] Port $Port not ready after ${TimeoutSec}s ($Label)" -ForegroundColor Yellow
    return $false
}

# -------- Step 1: Kill old processes --------
Write-Host "[1/6] Killing old processes on ports 5173/8080/3000/1883/8082 ..." -ForegroundColor Cyan
foreach ($port in @(5173, 8080, 3000, 1883, 8082)) {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($conn in $conns) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        $name = if ($proc) { $proc.ProcessName } else { "unknown" }
        Write-Host "  Kill port $port PID=$($conn.OwningProcess) ($name)"
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 2

# -------- Step 2: Check MySQL --------
Write-Host "[2/6] Checking MySQL service ..." -ForegroundColor Cyan
try {
    $svc = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($svc) {
        Write-Host "  MySQL service: $($svc.Name) (status: $($svc.Status))" -ForegroundColor Green
        if ($svc.Status -ne 'Running') {
            Write-Host "  Starting MySQL ..."
            Start-Service -Name $svc.Name -ErrorAction SilentlyContinue
        }
    } else {
        Write-Host "  [!] No MySQL service found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [!] Cannot check MySQL" -ForegroundColor Yellow
}

# -------- Step 3: Start Spring Boot (8080) --------
Write-Host "[3/6] Starting Spring Boot (8080) ..." -ForegroundColor Cyan
$jarPath = Join-Path $root "springstudy\target\springstudy-0.0.1-SNAPSHOT.jar"
if (-not (Test-Path $jarPath)) {
    Write-Host "  [!] JAR not found: $jarPath" -ForegroundColor Red
    Write-Host "  Run: cd aaa\springstudy && mvn package -DskipTests"
    Read-Host "Press Enter to exit"
    exit 1
}

$javaExe = $null
$jdkPath = "C:\Program Files\Java\jdk-21\bin\java.exe"
if (Test-Path $jdkPath) {
    $javaExe = $jdkPath
} else {
    try { $javaExe = (Get-Command java -ErrorAction Stop).Source } catch {
        Write-Host "  [!] Java not found. Install JDK 21 or add to PATH." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host "  Using Java: $javaExe" -ForegroundColor Gray

$springDir = Join-Path $root "springstudy"
Start-Process -FilePath $javaExe -ArgumentList "-jar", "target\springstudy-0.0.1-SNAPSHOT.jar" `
    -WorkingDirectory $springDir
Wait-Port -Port 8080 -TimeoutSec 45 -Label "Spring Boot" | Out-Null

# -------- Step 4: Start Node IoT (3000/1883/8082) --------
Write-Host "[4/6] Starting Node IoT (3000/1883/8082) ..." -ForegroundColor Cyan
$nodeDir = Join-Path $root "hello_vue3\server"
if (-not (Test-Path (Join-Path $nodeDir "package.json"))) {
    Write-Host "  [!] server\package.json not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
if (-not (Test-Path (Join-Path $nodeDir "node_modules"))) {
    Write-Host "  First run, installing Node deps ..."
    Push-Location $nodeDir
    & npm install --no-audit --no-fund
    Pop-Location
}
Start-Process -FilePath "node" -ArgumentList "src\app.js" -WorkingDirectory $nodeDir
Wait-Port -Port 3000 -TimeoutSec 20 -Label "Node API" | Out-Null

# -------- Step 5: Start Vite Frontend (5173) --------
Write-Host "[5/6] Starting Vite Frontend (5173) ..." -ForegroundColor Cyan
$webDir = Join-Path $root "hello_vue3"
if (-not (Test-Path (Join-Path $webDir "package.json"))) {
    Write-Host "  [!] hello_vue3\package.json not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
if (-not (Test-Path (Join-Path $webDir "node_modules"))) {
    Write-Host "  First run, installing frontend deps ..."
    Push-Location $webDir
    & npm install --no-audit --no-fund
    Pop-Location
}
Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory $webDir
Wait-Port -Port 5173 -TimeoutSec 30 -Label "Vite" | Out-Null

# -------- Step 6: Final verify --------
Write-Host "[6/6] Final port check ..." -ForegroundColor Cyan
$allOk = $true
foreach ($port in @(5173, 8080, 3000, 1883, 8082)) {
    $listening = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($listening) {
        Write-Host "  [OK] Port $port listening" -ForegroundColor Green
    } else {
        Write-Host "  [!] Port $port NOT listening" -ForegroundColor Yellow
        $allOk = $false
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
if ($allOk) {
    Write-Host "  ALL SERVICES STARTED!" -ForegroundColor Green
} else {
    Write-Host "  Some services may have issues" -ForegroundColor Yellow
}
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:  http://localhost:5173"
Write-Host "  Spring API: http://localhost:8080/api"
Write-Host "  IoT WS:    ws://localhost:8082"
Write-Host "  MQTT:      localhost:1883"
Write-Host ""
Write-Host "  Mini-program: open aaa\miniprogram in WeChat DevTools"
Write-Host ""

Start-Process "http://localhost:5173"
