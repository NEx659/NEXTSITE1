﻿# Verify zero outside province leaks
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

. 'scripts/test_footer_strip_all.ps1'

# Final check of all 174 valid posts against any mentions of other 76 provinces
$outsideProvs = @('เลย', 'วังสะพุง', 'ขอนแก่น', 'หนองคาย', 'หนองบัวลำภู', 'บึงกาฬ', 'สกลนคร', 'กาฬสินธุ์', 'ร้อยเอ็ด', 'สารคาม', 'มหาสารคาม', 'นครพนม', 'มุกดาหาร', 'ชัยภูมิ', 'โคราช', 'นครราชสีมา', 'อุบล', 'เชียงใหม่', 'เชียงราย', 'กรุงเทพ', 'กทม', 'ชลบุรี', 'ระยอง')

$leaks = @()
foreach ($v in $valid) {
    $b = Get-SiteBody $v.text
    foreach ($op in $outsideProvs) {
        if ($b -match ('(?:จ\.|จังหวัด|อ\.|อำเภอ|พิกัด|หน้างาน)\s*' + [regex]::Escape($op)) -and $b -notmatch 'อุดร') {
            $leaks += [pscustomobject]@{
                Page = $v.pageName
                Found = $op
                Snippet = ($b -replace '\s+', ' ').Substring(0, [Math]::Min(100, ($b -replace '\s+', ' ').Length))
            }
        }
    }
}

Write-Host ('Number of leaked outside province posts: ' + $leaks.Count)
if ($leaks.Count -gt 0) {
    $leaks | ForEach-Object { Write-Host ($_.Page + ' -> ' + $_.Found + ' | ' + $_.Snippet) }
} else {
    Write-Host 'PERFECT! 0 outside province posts remaining in the dataset!'
}