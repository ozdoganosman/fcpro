param(
  [string]$Title = "Codex CLI",
  [string]$Message = "Onay gerekiyor",
  [int]$DurationMs = 7000
)

# Try toast notification via BurntToast if available
try {
  if (-not (Get-Module -ListAvailable -Name BurntToast)) { throw "BurntToast not available" }
  Import-Module BurntToast -ErrorAction Stop | Out-Null
  New-BurntToastNotification -Text $Title, $Message | Out-Null
  return
} catch {
  # Fallback to tray balloon
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$ni = New-Object System.Windows.Forms.NotifyIcon
$ni.Icon = [System.Drawing.SystemIcons]::Information
$ni.BalloonTipTitle = $Title
$ni.BalloonTipText = $Message
$ni.Visible = $true
$ni.ShowBalloonTip($DurationMs)
Start-Sleep -Milliseconds $DurationMs
$ni.Dispose()

