param(
    [ValidateSet("arm64", "x64")]
    [string]$Arch
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$ScriptDir    = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectDir   = Split-Path -Parent $ScriptDir
$BaseImageDir = Join-Path (Join-Path $ProjectDir 'master') 'base_image'

# ── Detect arch ───────────────────────────────────────────────────────────────

if (-not $Arch) {
    $ArchRaw = $null
    try {
        $ArchRaw = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
    } catch {}
    if (-not $ArchRaw) { $ArchRaw = $env:PROCESSOR_ARCHITECTURE }

    $Arch = switch ($ArchRaw.ToUpper()) {
        "ARM64" { "arm64" }
        "X64"   { "x64" }
        "AMD64" { "x64" }
        default { Write-Error "Unsupported architecture: $ArchRaw. Pass -Arch arm64 or -Arch x64."; exit 1 }
    }
}

$TarName  = "${Arch}-base-image.tar"
$ShaName  = "$TarName.sha256"
$TarPath  = Join-Path $BaseImageDir $TarName
$ShaPath  = Join-Path $BaseImageDir $ShaName

# ── Validate source files ─────────────────────────────────────────────────────

$Missing = @()
foreach ($f in @("base.qcow2", "efi-vars.fd")) {
    if (-not (Test-Path (Join-Path $BaseImageDir $f))) { $Missing += $f }
}

if ($Missing.Count -gt 0) {
    Write-Error "Missing required files in master/base_image/: $($Missing -join ', ')"
    exit 1
}

# ── Bundle ────────────────────────────────────────────────────────────────────

$qcow2Size = [math]::Round((Get-Item (Join-Path $BaseImageDir 'base.qcow2')).Length / 1GB, 2)
$efiSize   = [math]::Round((Get-Item (Join-Path $BaseImageDir 'efi-vars.fd')).Length / 1MB, 0)

Write-Host "Bundling $TarName ..."
Write-Host "  + base.qcow2  ($qcow2Size GB)"
Write-Host "  + efi-vars.fd ($efiSize MB)"
Write-Host ""

tar -cf $TarPath -C $BaseImageDir base.qcow2 efi-vars.fd

Write-Host "Computing SHA256 ..."
$hash = (Get-FileHash -Algorithm SHA256 -Path $TarPath).Hash.ToLower()
"$hash  $TarName" | Set-Content -Path $ShaPath -NoNewline

$tarSizeMB = [math]::Round((Get-Item $TarPath).Length / 1GB, 2)

Write-Host ""
Write-Host "Done!"
Write-Host ""
Write-Host "  Archive : $TarPath  ($tarSizeMB GB)"
Write-Host "  SHA256  : $ShaPath"
Write-Host "  Hash    : $hash"
Write-Host ""
Write-Host "Upload both files to:"
Write-Host "  https://cdn.anythingllm.com/support/open-computer/base-images/<DATE>/$TarName"
Write-Host "  https://cdn.anythingllm.com/support/open-computer/base-images/<DATE>/$ShaName"
