$ErrorActionPreference = 'Stop'
$path = Join-Path $PSScriptRoot '..' | Join-Path -ChildPath 'src' | Join-Path -ChildPath 'App.js'
$lines = Get-Content -Path $path

$out = New-Object System.Collections.Generic.List[string]
$replaceNext = ''
foreach ($line in $lines) {
  if ($line -match "date:\s*'") {
    $out.Add("    date: 'Ağu 2025',")
    continue
  }
  if ($line -match "baskan:\s*") {
    $out.Add("    baskan: 'Başkan',")
    continue
  }
  if ($line -match 'onClick=\{\(\) => setShowStandings\(true\)\}') {
    $out.Add($line)
    $replaceNext = 'LIG_LINE'
    continue
  }
  if ($replaceNext -eq 'LIG_LINE') {
    $out.Add("          LİG<br/><span style={{fontSize: '1.5em'}}>{club.lig}.</span>")
    $replaceNext = ''
    continue
  }
  if ($line -match 'onClick=\{\(\) => setShowFinance\(true\)\}') {
    $out.Add($line)
    $replaceNext = 'MONEY_LINE'
    continue
  }
  if ($replaceNext -eq 'MONEY_LINE') {
    $out.Add("          PARA<br/><span style={{fontSize: '1.5em', color: '#2c7b2c'}}>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(club.money)}</span>")
    $replaceNext = ''
    continue
  }
  # Finance title line
  if ($line -match "fontSize: '1.3em', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px'" -and $line -like '*</div>*') {
    $out.Add("            <div style={{fontSize: '1.3em', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px'}}>MALİ DURUM</div>")
    continue
  }
  # Fixture title line
  if ($line -match 'fontSize: '\''1.3em'\'',.*'F' -and $line -like '*</div>*' -and $line -like '*Fixture*' -eq $false) {
    # Skip heuristic; leave unchanged
  }
  if ($line -like '*F*ST*RLER*SONU*LAR*' -and $line -like '*fontSize: ''1.3em''*' -eq $false) {
    # leave unchanged
  }
  if ($line -like '*F*o*RLER*SONU*LAR*') {
    $out.Add("            <div style={{fontSize: '1.3em', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px'}}>FİKSTÜRLER/SONUÇLAR</div>")
    continue
  }
  # Table headers quick fixes
  if ($line -like '*>Sonu*<*') { $out.Add("                  <th style={{padding: '4px'}}>Sonuç</th>"); continue }
  if ($line -like '*>Kalabal*<*') { $out.Add("                  <th style={{padding: '4px'}}>Kalabalık</th>"); continue }

  # Cards bottom fixes
  if ($line -like "*BA*RILDI*" -and $line -like '*cardStyle*') { $out.Add("        <div style={{...cardStyle, background: '#3e5c2c', color: '#fff'}}>BAŞARILDI<br/>{club.basarildi}</div>"); continue }
  if ($line -like '*REKORLAR*') { $out.Add("        <div style={{...cardStyle, background: '#3e5c2c', color: '#fff'}}>REKORLAR<br/><span style={{fontSize: '1.2em'}}>🏆</span></div>"); continue }
  if ($line -like '*GE*MI*' -and $line -like '*cardStyle*') { $out.Add("        <div style={{...cardStyle, background: '#3e5c2c', color: '#fff'}}>GEÇMİŞ<br/><span style={{fontSize: '1.2em'}}>📜</span></div>"); continue }

  # Supporters row fixes
  if ($line -like '*BA*KAN*</span></div>' -and $line -like '*TARAFTARLAR*') {
    $out.Add($line -replace 'BA.?KAN', 'BAŞKAN')
    continue
  }
  if ($line -like '*STADYUM*<span*') { $out.Add("        <div style={{...cardStyle, background: '#e6f4e6', color: '#2c466b'}}>STADYUM<br/><span style={{fontSize: '1.2em'}}>🏟️</span></div>"); continue }
  if ($line -like '*BA*KAN*<span*' -and $line -like '*e6f4e6*') { $out.Add("        <div style={{...cardStyle, background: '#e6f4e6', color: '#2c466b'}}>BAŞKAN<br/><span style={{fontSize: '1.2em'}}>👔</span></div>"); continue }

  $out.Add($line)
}

Set-Content -Path $path -Value $out -Encoding utf8
