# Random Dungeon Generator — offline check wrapper
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
node (Join-Path $here "check-randomdungeon.mjs")
exit $LASTEXITCODE
