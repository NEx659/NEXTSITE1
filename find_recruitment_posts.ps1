[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Run pipeline functions
. 'scripts/find_duplicate_projects.ps1'

$recruitmentKws = @(
    'รับสมัคร', 'รับสมัครงาน', 'รับสมัครพนักงาน', 'เปิดรับสมัคร', 'ตำแหน่งงาน', 'ตำแหน่งงานว่าง',
    'ประกาศรับสมัคร', 'สมัครงาน', 'ร่วมงานกับเรา', 'we are hiring', 'hiring', 'join our team',
    'job vacancy', 'walk-in interview', 'ส่ง resume', 'ส่ง portfolio', 'ฐานเงินเดือน', 'วุฒิ ปวส', 'วุฒิ ปริญญาตรี'
)

$recruitmentCandidates = @()

foreach ($p in $valid) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    $textLower = $text.ToLower()
    
    $matchedKw = ''
    foreach ($kw in $recruitmentKws) {
        if ($textLower.Contains($kw.ToLower())) {
            $matchedKw = $kw
            break
        }
    }
    
    if ($matchedKw) {
        $recruitmentCandidates += [pscustomobject]@{
            Page = $p.pageName
            Time = $p.time
            Keyword = $matchedKw
            Text = ($text -replace '\s+', ' ')
        }
    }
}

Write-Host "=================================================="
Write-Host "FOUND $($recruitmentCandidates.Count) RECRUITMENT / JOB HIRING POSTS IN VALID PIPELINE"
Write-Host "=================================================="

$idx = 1
foreach ($r in $recruitmentCandidates) {
    $snip = if ($r.Text.Length -gt 130) { $r.Text.Substring(0, 130) + '...' } else { $r.Text }
    Write-Host ""
    Write-Host "$idx. [เพจ: $($r.Page)] (พบคำว่า: '$($r.Keyword)') วันที่: $($r.Time)"
    Write-Host "   ข้อความ: $snip"
    $idx++
}

# Also search raw dataset for any recruitment posts
$allRawRecruit = @()
foreach ($p in $rawPosts) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    $textLower = $text.ToLower()
    foreach ($kw in $recruitmentKws) {
        if ($textLower.Contains($kw.ToLower())) {
            $allRawRecruit += [pscustomobject]@{
                Page = $p.pageName
                Keyword = $kw
                Text = ($text -replace '\s+', ' ')
            }
            break
        }
    }
}

Write-Host ""
Write-Host "Total in raw 522 dataset matching recruitment: $($allRawRecruit.Count)"
