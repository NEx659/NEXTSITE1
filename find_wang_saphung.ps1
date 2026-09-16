﻿[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$raw = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

$found = $raw | Where-Object { ($_.text -and $_.text -match 'วังสะพุง') -or ($_.message -and $_.message -match 'วังสะพุง') }
Write-Host ('Matching posts for วังสะพุง: ' + $found.Count)

foreach ($f in $found) {
    Write-Host '===================================='
    Write-Host ('Page: ' + $f.pageName)
    Write-Host ('Text: ' + $f.text)
}