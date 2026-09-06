Using Module  .\gettool.psm1

param(
    [string]$Arg1
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Output "SK-OUTPUT popen_start"

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

$TOOL_DIR = "..\work\MagicaVoxel"
$TOOL_URL = "https://github.com/ephtracy/ephtracy.github.io/releases/download/0.99.7/MagicaVoxel-0.99.7.2-win64.zip"
$INNER_DIR = "\MagicaVoxel-0.99.7.2-win64"

GetTool -TOOL_DIR $TOOL_DIR -TOOL_URL $TOOL_URL -INNER_DIR $INNER_DIR

# junction
$VOX_DIR = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\work\MagicaVoxel\vox"))
$VOX_TARGET_DIR = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\project\resource\vox"))
$voxItem = Get-Item -LiteralPath $VOX_DIR -Force -ErrorAction SilentlyContinue

if ($null -ne $voxItem) {
    if (($voxItem.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
        [System.IO.Directory]::Delete($VOX_DIR, $false)
    } else {
        Remove-Item -LiteralPath $VOX_DIR -Recurse -Force
    }
}
New-Item -ItemType Junction -Path $VOX_DIR -Target $VOX_TARGET_DIR | Out-Null

Write-Output "SK-OUTPUT popen_launch"

# launch MagicaVoxel
Set-Location -Path $TOOL_DIR
$proc = Start-Process -FilePath ".\MagicaVoxel.exe" -ArgumentList $Arg1 -PassThru
while ($proc.MainWindowHandle -eq 0) {
    Start-Sleep -Milliseconds 20
    $proc.Refresh()
}

Write-Output "SK-OUTPUT popen_done"
