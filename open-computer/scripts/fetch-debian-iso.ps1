param(
    [ValidateSet("arm64", "amd64")]
    [string]$Arch
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectDir = Split-Path -Parent $ScriptDir
$VmDir = Join-Path (Join-Path $ProjectDir 'master') 'iso'

$DebianVersion = "13.5.0"
$BaseUrl = "https://debian.osuosl.org/debian-cdimage/$DebianVersion"

if (-not $Arch) {
    $HostArch = $null
    try {
        $HostArch = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
    } catch {}

    if (-not $HostArch) {
        $HostArch = $env:PROCESSOR_ARCHITECTURE
    }

    switch ($HostArch.ToUpper()) {
        "X64"   { $Arch = "amd64" }
        "AMD64" { $Arch = "amd64" }
        "ARM64" { $Arch = "arm64" }
        default { Write-Error "Cannot auto-detect arch from '$HostArch'; pass -Arch arm64 or -Arch amd64"; exit 1 }
    }
    Write-Host "Auto-detected architecture: $Arch"
}

$IsoName = "debian-$DebianVersion-$Arch-netinst.iso"
$IsoUrl = "$BaseUrl/$Arch/iso-cd/$IsoName"
$IsoPath = Join-Path $VmDir $IsoName
$ShaPath = Join-Path $VmDir "$IsoName.sha256"

if (-not (Test-Path $VmDir)) {
    New-Item -ItemType Directory -Path $VmDir -Force | Out-Null
}

function Get-FileSha256($FilePath) {
    $hash = Get-FileHash -Algorithm SHA256 -Path $FilePath
    return $hash.Hash.ToLower()
}

function Read-ShaFile($ShaFilePath) {
    $line = (Get-Content -Path $ShaFilePath -First 1).Trim()
    return ($line -split '\s+')[0].ToLower()
}

if (Test-Path $ShaPath) {
    Write-Host "SHA256 file exists: $ShaPath"
    $expectedHash = Read-ShaFile $ShaPath

    if (Test-Path $IsoPath) {
        Write-Host "ISO already exists, verifying checksum..."
        $actualHash = Get-FileSha256 $IsoPath

        if ($actualHash -eq $expectedHash) {
            Write-Host "ISO is valid, nothing to do."
            exit 0
        }
        Write-Host "Checksum mismatch - re-downloading."
        Remove-Item -Force $IsoPath
    }

    Write-Host "Downloading $IsoUrl ..."
    Invoke-WebRequest -Uri $IsoUrl -OutFile $IsoPath -UseBasicParsing

    Write-Host "Verifying downloaded ISO against existing checksum..."
    $actualHash = Get-FileSha256 $IsoPath
    if ($actualHash -ne $expectedHash) {
        Write-Error "Checksum verification failed! Expected $expectedHash, got $actualHash"
        exit 1
    }
    Write-Host "Download verified."
} else {
    if (-not (Test-Path $IsoPath)) {
        Write-Host "Downloading $IsoUrl ..."
        Invoke-WebRequest -Uri $IsoUrl -OutFile $IsoPath -UseBasicParsing
    } else {
        Write-Host "ISO exists but no SHA256 file - generating checksum..."
    }

    Write-Host "Generating SHA256 checksum..."
    $hash = Get-FileSha256 $IsoPath
    "$hash  $IsoName" | Set-Content -Path $ShaPath -NoNewline
    Write-Host "Wrote $ShaPath"
    Write-Host "Commit this file to version control: $ShaPath"
}
