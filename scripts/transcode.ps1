param(
  [Parameter(Mandatory=$true)][string]$Path
)

# Transcode a text file believed to be Windows-1254 (Turkish) into UTF-8 (no BOM).
# If file already decodes as UTF-8 cleanly, normalize and keep.

$utf8 = [System.Text.UTF8Encoding]::new($false)
$bytes = [System.IO.File]::ReadAllBytes($Path)

try {
  # If it decodes without exception, consider it UTF-8 already
  $text = $utf8.GetString($bytes)
  [System.IO.File]::WriteAllText($Path, $text, $utf8)
  return
} catch {}

$cp = [System.Text.Encoding]::GetEncoding('windows-1254')
$text1254 = $cp.GetString($bytes)
[System.IO.File]::WriteAllText($Path, $text1254, $utf8)
