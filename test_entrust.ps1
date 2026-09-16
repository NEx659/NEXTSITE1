﻿[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Test international & outside locations
$internationalAndOutside = @(
    'vientiane', 'laos', 'เวียงจันทน์', 'สปป.ลาว', 'ลาว', 'หลวงพระบาง', 'ปากเซ', 'สะหวันนะเขต', 'จำปาศักดิ์',
    'cambodia', 'กัมพูชา', 'พนมเปญ', 'เสียมราฐ', 'myanmar', 'พม่า', 'เมียนมา', 'ย่างกุ้ง', 'มัณฑะเลย์', 'vietnam', 'เวียดนาม'
)

$trustPosts = $rawPosts | Where-Object { $_.pageName -match 'ENTRUST' }
Write-Host ('Total ENTRUST posts: ' + $trustPosts.Count)

foreach ($tp in $trustPosts) {
    Write-Host '===================================='
    Write-Host ($tp.text)
}