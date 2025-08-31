param(
  [string]$Root = (Join-Path $PSScriptRoot '..')
)

$ErrorActionPreference = 'Stop'

$exclude = '\\node_modules\\|\\.git\\'
$patterns = @('*.js','*.jsx','*.ts','*.tsx','*.csv','*.json','*.md')
foreach($pat in $patterns){
  Get-ChildItem -Path $Root -Recurse -File -Filter $pat |
    Where-Object { $_.FullName -notmatch $exclude } |
    ForEach-Object {
      try { & (Join-Path $PSScriptRoot 'transcode.ps1') -Path $_.FullName } catch {}
    }
}
