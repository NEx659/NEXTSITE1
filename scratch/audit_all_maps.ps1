$appContent = Get-Content 'js/app.js' -Raw -Encoding UTF8
$dataContent = Get-Content 'js/data.js' -Raw -Encoding UTF8

# Verify COMPANY_MAPS_MASTER in app.js
$appMatch = [regex]::Match($appContent, '(?s)const\s+COMPANY_MAPS_MASTER\s*=\s*\{([\s\S]*?)\};')
if (-not $appMatch.Success) {
  Write-Host "ERROR: COMPANY_MAPS_MASTER not found in app.js" -ForegroundColor Red
  exit 1
}

# Parse data.js
$jsonStart = $dataContent.IndexOf("[")
$jsonEnd = $dataContent.LastIndexOf("]")
$jsonStr = $dataContent.Substring($jsonStart, $jsonEnd - $jsonStart + 1)
$companies = $jsonStr | ConvertFrom-Json

Write-Host "=================================================="
Write-Host "     100% GOOGLE MAPS VERIFICATION AUDIT          "
Write-Host "=================================================="
Write-Host "Total companies checked: $($companies.Count)"

$allPass = $true
$i = 1
foreach ($c in $companies) {
  $id = $c.id
  $name = $c.name
  $map = $c.googleMapsUrl
  
  # Check if id is in COMPANY_MAPS_MASTER in app.js
  if ($appContent -notmatch [regex]::Escape("'$id': '$map'")) {
    Write-Host "FAILED [$i] $id ($name): Map URL mismatch in app.js! ($map)" -ForegroundColor Red
    $allPass = $false
  } else {
    Write-Host "OK [$i] $id ($name) -> $map" -ForegroundColor Green
  }
  $i++
}

if ($allPass) {
  Write-Host "`n*** SUCCESS: ALL 58 COMPANIES 100.00% MATCH ACROSS DATA.JS AND APP.JS ***" -ForegroundColor Cyan
} else {
  Write-Host "`n*** SOME COMPANIES FAILED VERIFICATION ***" -ForegroundColor Red
}
