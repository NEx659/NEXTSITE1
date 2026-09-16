﻿[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

$p = $rawPosts | Where-Object { ($_.text -and $_.text -match 'วังสะพุง') } | Select-Object -First 1

Write-Host ('Page: ' + $p.pageName)
Write-Host ('Text: ' + $p.text)

# Test function
. 'scripts/test_strict_province.ps1'
$res = Test-StrictOtherProvince $p
Write-Host ('Is Other Province: ' + $res)