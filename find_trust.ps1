﻿[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

Write-Host 'Finding all posts of TRUST Construction / Vientiane / Laos / International...'
$trustPosts = $rawPosts | Where-Object { $_.pageName -match 'TRUST|trust' -or ($_.text -and ($_.text -match 'Vientiane|Laos|เวียงจันทน์|ลาว|K\.Khon')) }

Write-Host ('Matching posts: ' + $trustPosts.Count)
foreach ($tp in $trustPosts) {
    Write-Host '==================================================='
    Write-Host ('Page: ' + $tp.pageName)
    Write-Host ('Text: ' + $tp.text)
    Write-Host ('URL: ' + $tp.url)
}