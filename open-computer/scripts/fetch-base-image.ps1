param()

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$ScriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectDir = Split-Path -Parent $ScriptDir
$BaseImageDir = Join-Path (Join-Path $ProjectDir 'master') 'base_image'

$BaseImageDate = "06_08_2026"
$BaseUrl = if ($env:OPEN_COMPUTER_BASE_IMAGE_URL) { $env:OPEN_COMPUTER_BASE_IMAGE_URL } else { "https://cdn.anythingllm.com/support/open-computer/base-images/$BaseImageDate" }

# ── Detect arch ───────────────────────────────────────────────────────────────

$ArchRaw = $null
try {
    $ArchRaw = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
} catch {}
if (-not $ArchRaw) { $ArchRaw = $env:PROCESSOR_ARCHITECTURE }

$Arch = switch ($ArchRaw.ToUpper()) {
    "ARM64" { "arm64" }
    "X64"   { "x64" }
    "AMD64" { "x64" }
    default { Write-Error "Unsupported architecture: $ArchRaw"; exit 1 }
}

$TarName = "${Arch}-base-image.tar"
$TarUrl  = "$BaseUrl/$TarName"
$ShaName = "$TarName.sha256"
$ShaUrl  = "$BaseUrl/$ShaName"

if (-not (Test-Path $BaseImageDir)) {
    New-Item -ItemType Directory -Path $BaseImageDir -Force | Out-Null
}

# ── Check for existing files ──────────────────────────────────────────────────

$ExistingFiles = @()
foreach ($f in @("base.qcow2", "efi-vars.fd")) {
    if (Test-Path (Join-Path $BaseImageDir $f)) {
        $ExistingFiles += $f
    }
}

if ($ExistingFiles.Count -gt 0) {
    Write-Host "Existing base image files found: $($ExistingFiles -join ', ')"
    Write-Host ""
    $reply = Read-Host "Delete existing files and re-download the base image for ${Arch}? [y/N]"
    Write-Host ""
    if ($reply -notmatch '^[yY]([eE][sS])?$') {
        Write-Host "Skipping download. Existing base image kept."
        exit 0
    }
    Write-Host "Removing existing base image files..."
    foreach ($f in @("base.qcow2", "efi-vars.fd")) {
        $fp = Join-Path $BaseImageDir $f
        if (Test-Path $fp) { Remove-Item -Force $fp }
    }
} else {
    Write-Host "No base image found for ${Arch}."
    Write-Host ""
    $reply = Read-Host "Download ${TarName} (~2.3 GB)? [Y/n]"
    Write-Host ""
    if ($reply -match '^[nN]([oO])?$') {
        Write-Host "Skipping download."
        exit 0
    }
}

# ── Download ──────────────────────────────────────────────────────────────────

$TarPath = Join-Path $BaseImageDir $TarName
$ShaPath = Join-Path $BaseImageDir $ShaName

Write-Host "Fetching checksum from $ShaUrl ..."
Invoke-WebRequest -Uri $ShaUrl -OutFile $ShaPath -UseBasicParsing

Write-Host "Downloading $TarUrl ..."
Invoke-WebRequest -Uri $TarUrl -OutFile $TarPath -UseBasicParsing

# ── Verify ────────────────────────────────────────────────────────────────────

Write-Host "Verifying checksum..."
$expectedHash = ((Get-Content -Path $ShaPath -First 1).Trim() -split '\s+')[0].ToLower()
$actualHash   = (Get-FileHash -Algorithm SHA256 -Path $TarPath).Hash.ToLower()

if ($actualHash -ne $expectedHash) {
    Write-Error "Checksum verification failed!`n  Expected: $expectedHash`n  Got:      $actualHash"
    Remove-Item -Force $TarPath, $ShaPath
    exit 1
}
Write-Host "Checksum verified."

# ── Extract ───────────────────────────────────────────────────────────────────

Write-Host "Extracting..."
tar -xf $TarPath -C $BaseImageDir

Remove-Item -Force $TarPath, $ShaPath

Write-Host ""
Write-Host "Base image ready:"
Write-Host "  $(Join-Path $BaseImageDir 'base.qcow2')"
Write-Host "  $(Join-Path $BaseImageDir 'efi-vars.fd')"
