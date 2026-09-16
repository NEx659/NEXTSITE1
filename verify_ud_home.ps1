﻿# Audit all remaining 361 posts for any outside province
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

. 'scripts/process_new_json.ps1'

Write-Host 'Checking all valid posts for UD.Home and other companies...'
$udPosts = $posts | Where-Object { $_.pageName -match 'UD\.Home' }
Write-Host ('Total UD.Home posts kept: ' + $udPosts.Count)
foreach ($up in $udPosts) {
    Write-Host '-----------------------------------'
    Write-Host ($up.text)
}