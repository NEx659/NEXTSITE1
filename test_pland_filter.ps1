[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'scripts/facebook_54_pages_posts.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

. 'scripts/find_duplicate_projects.ps1'

$adPromoKws = @('โปรโมชั่น', 'โปรโมชัน', 'โปรโมชั่นสุดคุ้ม', 'ราคาพิเศษ', 'ลดกระหน่ำ', 'แจกฟรี', 'ของแถม', 'ฟรีของแถม', 'แถมฟรี', 'จองวันนี้', 'ผ่อนเริ่มต้น', 'กู้ได้เต็ม', 'ยื่นสินเชื่อ', 'แบบบ้านขายดี', 'แบบบ้านยอดนิยม', '10 แบบบ้าน', 'ราคาเริ่มต้น', 'เริ่มต้นเพียง', 'ตารางเมตรละ', 'ตร\.ม\.ละ', 'ลดทันที')

function Test-IsAdStrict($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    
    $isAd = $false
    foreach ($kw in $adPromoKws) {
        if ($text -match $kw) { $isAd = $true; break }
    }
    
    if ($isAd) {
        $body = Get-SiteBody $text
        # Strip promo giveaway lines
        $bodyNoGifts = $body -replace '(?m)^\s*(?:🎁|ฟรี!|แถมฟรี|ของแถม|ฟรี\s*[:!]).*$', ''
        $bodyNoGifts = $bodyNoGifts -replace '(?:จนถึงวันส่งมอบ|ตั้งแต่เริ่มจน|ตั้งแต่วันแรกจน|ตั้งแต่ฐานรากจนถึง|เรื่องการสร้างบ้าน|ไว้ใจ\s*\|)', ''
        
        $hasSiteTask = ($bodyNoGifts -match 'งานติดตั้ง|งานทาสี|งานมุง|งานปูกระเบื้อง|งานเทพื้น|งานฉาบ|งานก่อ|เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|สุขภัณฑ์|โครงเหล็ก|ส่งมอบบ้าน|ส่งมอบงาน')
        if ($hasSiteTask -and ($body -match 'อุดร' -or $body -match '(?:อ\.|อำเภอ)\s*เมือง')) { return $false }
        
        foreach ($ud in $udonDistricts) {
            if ($body -match [regex]::Escape($ud)) { return $false }
        }
        
        if ($body -match '(?:บ้านคุณ|บ้านพักคุณ|Owner)\s*[:\s]*([ก-๙a-zA-Z]+)') {
            $c = $matches[1]
            if ($c -notmatch '^(?:ของคุณ|ของบ้านคุณ|ภาพ|งาน|สร้าง|ดี|เรา|ท่าน|ทุกท่าน|พี่|น้อง|ใหม่|เก่า|ครับ|ค่ะ|อุดร|คุณภาพ|มาตรฐาน|ลูกค้า|ออกแบบ|ไว้วางใจ|บริการ|สัญญา|ตรงตามความต้องการ|ตั้งแต่วันแรก)$') {
                return $false
            }
        }
        return $true
    }
    return $false
}

$pland = $rawPosts | Where-Object { $_.text -match 'Plan-D' }
Write-Host "Total Plan-D posts found: $($pland.Count)"
foreach ($pd in $pland) {
    $isAd = Test-IsAdStrict $pd
    Write-Host "- $($pd.time) -> Is Ad (Excluded): $isAd"
}
