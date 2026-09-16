[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Run pipeline functions
. 'scripts/find_duplicate_projects.ps1'

function Test-IsCompanyPROrEmpty($p) {
    $text = if ($p.text) { [string]$p.text.Trim() } elseif ($p.message) { [string]$p.message.Trim() } else { '' }
    
    # 1. Blank or very short
    if (-not $text -or $text.Length -lt 15) {
        if ($text -notmatch 'เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|มุงหลังคา|ฉาบปูน|ส่งมอบ') {
            return $true
        }
    }
    
    # 2. Profile/Cover update
    if ($text -match 'ได้อัพเดตรูปโปรไฟล์|ได้อัพเดตรูปภาพหน้าปก|updated (?:their )?(?:profile|cover) photo') {
        return $true
    }
    
    # 3. Corporate PR, Anniversaries, New Logo, Government registration
    $isPR = ($text -match 'NEW LOGO|โลโก้ใหม่|เปลี่ยนโลโก้|20th Anniversary|Anniversary|ครบรอบ\s*\d+\s*ปี|\d+\s*YEARS OF|ขึ้นทะเบียนและจัดชั้น|จัดชั้นผู้ประกอบการ|กรมบัญชีกลาง|ถ่าย\s*present')
    if ($isPR) {
        $hasSite = ($text -match 'เทคาน|เทพื้น|ขุดฐานราก|เทตอม่อ|ยกเสาเอก|ลงเสาเข็ม|ตอกเสาเข็ม|มุงหลังคา|ก่ออิฐ|ฉาบปูน|ส่งมอบบ้าน|ส่งมอบงาน')
        if (-not $hasSite) {
            return $true
        }
    }
    return $false
}

$prFiltered = @()
$rem = @()

foreach ($p in $valid) {
    if (Test-IsCompanyPROrEmpty $p) {
        $prFiltered += $p
    } else {
        $rem += $p
    }
}

Write-Host "=================================================="
Write-Host "FILTERED OUT $($prFiltered.Count) CORPORATE PR / COVER / PROFILE / EMPTY POSTS:"
Write-Host "=================================================="

foreach ($pf in $prFiltered) {
    $snip = if ($pf.text) { ($pf.text -replace '\s+', ' ') } else { '(โพสต์ว่างเปล่า/ไม่มีข้อความ)' }
    if ($snip.Length -gt 100) { $snip = $snip.Substring(0, 100) + '...' }
    Write-Host "- [เพจ: $($pf.pageName)] (วันที่: $($pf.time)) : $snip"
}

Write-Host ""
Write-Host "Remaining Valid Posts: $($rem.Count)"
