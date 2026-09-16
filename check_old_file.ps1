[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

 = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
 = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'

Write-Host 'Checking 2026-09-15 file:'
if (Test-Path ) {
   = Get-Content -LiteralPath  -Raw -Encoding UTF8 | ConvertFrom-Json
  Write-Host 'Total items in 2026-09-15:' .Count
   =  | Where-Object { (.user.name -match 'Little Home') -or (.pageName -match 'LH2553') -or (.facebookUrl -match 'LH2553') -or (.inputUrl -match 'LH2553') }
  Write-Host 'Little Home items in 2026-09-15:' .Count
  foreach ( in ) {
    Write-Host '  URL:' .url
    Write-Host '  Text:' .text.Substring(0, [Math]::Min(80, .text.Length))
  }
}

Write-Host '-----------------------------------------'
Write-Host 'Checking 2026-09-16 file:'
if (Test-Path ) {
   = Get-Content -LiteralPath  -Raw -Encoding UTF8 | ConvertFrom-Json
  Write-Host 'Total items in 2026-09-16:' .Count
   =  | Where-Object { (.user.name -match 'Little Home') -or (.pageName -match 'LH2553') -or (.facebookUrl -match 'LH2553') -or (.inputUrl -match 'LH2553') }
  Write-Host 'Little Home items in 2026-09-16:' .Count
  foreach ( in ) {
    Write-Host '  URL:' .url
    Write-Host '  Text:' .text.Substring(0, [Math]::Min(80, .text.Length))
  }
}