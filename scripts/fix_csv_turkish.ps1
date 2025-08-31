param(
  [Parameter(Mandatory=$true)][string]$InputPath,
  [string]$OutputPath = $null
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path $InputPath)) { throw "Input not found: $InputPath" }
if (-not $OutputPath) { $OutputPath = $InputPath }

# Returns text decoded as UTF-8 if valid, otherwise $null
function TryDecodeUtf8([byte[]]$bytes){
  try {
    $enc = [System.Text.UTF8Encoding]::new($false,$true) # throw on invalid
    return $enc.GetString($bytes)
  } catch { return $null }
}

$bytes = [System.IO.File]::ReadAllBytes($InputPath)

# 1) If valid UTF-8 -> write back normalized UTF-8 (no BOM)
$utf8Text = TryDecodeUtf8 $bytes
if ($utf8Text -ne $null) {
  [System.IO.File]::WriteAllText($OutputPath, $utf8Text, [System.Text.UTF8Encoding]::new($false))
  Write-Host "Saved UTF-8: $OutputPath"
  return
}

# 2) Try Windows-1254 (Turkish)
$cp = [System.Text.Encoding]::GetEncoding('windows-1254')
$text1254 = $cp.GetString($bytes)

# If text contains the replacement character U+FFFD, it means it was already corrupted
if ($text1254 -like '*`uFFFD*' -or ($text1254 -match "")) {
  Write-Warning "File seems already damaged (contains replacement chars). Please use the original source file."
}

[System.IO.File]::WriteAllText($OutputPath, $text1254, [System.Text.UTF8Encoding]::new($false))
Write-Host "Transcoded Windows-1254 -> UTF-8: $OutputPath"

