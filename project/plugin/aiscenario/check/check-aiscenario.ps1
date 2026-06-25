# AI Scenario Importer — 回帰チェック実行
# aiscenario プラグイン修正後に実行し、既知の退行がないか確認する。
#
# Usage (from anywhere):
#   .\project\plugin\aiscenario\check\check-aiscenario.ps1
#
# Exit: 0 = pass, 1 = fail

$ErrorActionPreference = "Stop"
$CheckDir = $PSScriptRoot
$Script = Join-Path $CheckDir "check-aiscenario.mjs"

if (-not (Test-Path $Script)) {
    Write-Error "check script not found: $Script"
    exit 1
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Error "Node.js が見つかりません。check-aiscenario.mjs の実行に node が必要です。"
    exit 1
}

Push-Location $CheckDir
try {
    & node $Script
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
