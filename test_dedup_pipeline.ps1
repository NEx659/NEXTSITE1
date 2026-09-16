[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Run pipeline functions
. 'scripts/find_duplicate_projects.ps1'

# Read companies from js/data.js
$dataJs = Get-Content -LiteralPath 'js/data.js' -Raw -Encoding UTF8
$startTag = 'var UDON_COMPANIES = '
$sIdx = $dataJs.IndexOf($startTag)
$endTag = "];`r`n`r`nif (typeof window"
if (-not $dataJs.Contains($endTag)) {
    $endTag = "];`n`nif (typeof window"
}
$eIdx = $dataJs.IndexOf($endTag)
$jsonPart = $dataJs.Substring($sIdx + $startTag.Length, $eIdx - ($sIdx + $startTag.Length) + 1).Trim()
$companies = $jsonPart | ConvertFrom-Json

function Get-ProperSlug($url) {
    if (-not $url) { return '' }
    $u = [string]$url.ToLower().Trim()
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '^https?:\/\/(www\.|m\.|mobile\.|web\.)?facebook\.com\/', '')
    if ($u -match 'profile\.php\?id=([0-9]+)') {
        return "profile.php?id=" + $matches[1]
    }
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/posts\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/videos\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/photos\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/reels?\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\?.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, 'people\/[^\/]+\/', '')
    return $u
}

function Get-SiteKey($text, $dist) {
    if (-not $text) { return "site_" + $dist }
    $b = Get-SiteBody $text
    
    # 1. Project / K.xxx
    if ($b -match 'Project\s*\|\s*(?:K\.|คุณ)?\s*([a-zA-Z0-9_\-]+)') {
        return "cust_" + $matches[1].ToLower()
    }
    
    # 2. Thai Customer
    if ($b -match '(?:บ้านคุณ|บ้านพักคุณ|ลูกค้าคุณ|คุณ)\s*([ก-๙a-zA-Z]+)') {
        $c = $matches[1]
        if ($c -notmatch 'ภาพ|งาน|สร้าง|ดี|เรา|ท่าน|ทุกท่าน|พี่|น้อง|ใหม่|เก่า|ครับ|ค่ะ|อุดร|คุณภาพ|มาตรฐาน|ลูกค้า|ออกแบบ|ไว้วางใจ|บริการ|สัญญา') {
            return "cust_" + $c
        }
    }
    
    # 3. Landmark / Project ID
    if ($b -match 'โชว์รูมอุดรเซ็นเตอร์ฟิล์ม|เซ็นเตอร์ฟิล์ม') { return "landmark_center_film" }
    if ($b -match 'พีที|ปั๊ม\s*pt|บ้านปูลู') { return "landmark_pt_pulu" }
    if ($b -match 'Good Vibes|กู๊ดไวบ์') { return "landmark_good_vibes" }
    if ($b -match 'สุขคณา') { return "landmark_sukkhana" }
    if ($b -match 'MDUD\s*251') { return "proj_mdud_251" }
    if ($b -match 'ศุภาลัย') { return "landmark_supalai" }
    if ($b -match 'รชยา') { return "landmark_rachaya" }
    if ($b -match 'อภิทาวน์') { return "landmark_apitown" }
    if ($b -match 'วิลลาจจิโอ') { return "landmark_villaggio" }
    
    # 4. Fallback signature
    $firstLine = ($b -split '\r?\n')[0].Trim()
    if ($firstLine.Length -gt 25) { $firstLine = $firstLine.Substring(0, 25) }
    return "line_" + ($firstLine -replace '[^a-zA-Z0-9ก-๙]', '_')
}

$compMap = @{}
foreach ($c in $companies) {
    $compMap[$c.id] = [System.Collections.Generic.List[object]]::new()
}

for ($i = 0; $i -lt $valid.Count; $i++) {
    $p = $valid[$i]
    $pUrlRaw = ($p.facebookUrl, $p.inputUrl, $p.url, $p.topLevelUrl | Where-Object { $_ } | Select-Object -First 1)
    $pSlug = Get-ProperSlug $pUrlRaw
    $pName = if ($p.pageName) { $p.pageName.ToLower().Trim() } else { '' }
    $uName = if ($p.user -and $p.user.name) { $p.user.name.ToLower().Trim() } else { '' }
    
    $found = $null
    foreach ($c in $companies) {
        $cSlug = Get-ProperSlug $c.facebookUrl
        if ($cSlug -and $pSlug -and ($cSlug -eq $pSlug)) { $found = $c; break }
    }
    if (-not $found -and $p.inputUrl) {
        $inSlug = Get-ProperSlug $p.inputUrl
        foreach ($c in $companies) {
            $cSlug = Get-ProperSlug $c.facebookUrl
            if ($cSlug -and $inSlug -and ($cSlug -eq $inSlug)) { $found = $c; break }
        }
    }
    if (-not $found) {
        foreach ($c in $companies) {
            $cSlug = Get-ProperSlug $c.facebookUrl
            if ($cSlug -and $pSlug -and ($pSlug.Contains($cSlug) -or $cSlug.Contains($pSlug))) { $found = $c; break }
        }
    }
    if (-not $found) {
        foreach ($c in $companies) {
            $cName = if ($c.name) { $c.name.ToLower() } else { '' }
            $cEng = if ($c.engName) { $c.engName.ToLower() } else { '' }
            if ($pName -and ($cName.Contains($pName) -or $pName.Contains($cName))) { $found = $c; break }
            elseif ($uName -and ($cName.Contains($uName) -or $uName.Contains($cName))) { $found = $c; break }
            elseif ($cEng -and $pName -and ($cEng.Contains($pName) -or $pName.Contains($cEng))) { $found = $c; break }
        }
    }
    if ($found) {
        $compMap[$found.id].Add($p)
    }
}

$totalDeduplicatedProjects = 0

Write-Host "=================================================="
Write-Host "COMPANIES & DEDUPLICATED PROJECTS (LATEST POST ONLY)"
Write-Host "=================================================="

foreach ($c in $companies) {
    $rawList = $compMap[$c.id]
    if ($rawList.Count -eq 0) { continue }
    
    # Sort latest first
    $sorted = $rawList | Sort-Object -Property time -Descending
    
    $seenKeys = [System.Collections.Generic.HashSet[string]]::new()
    $deduped = @()
    
    foreach ($p in $sorted) {
        $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
        $key = Get-SiteKey $text ($c.district)
        if (-not $seenKeys.Contains($key)) {
            $seenKeys.Add($key) | Out-Null
            $deduped += [pscustomobject]@{
                Key = $key
                Post = $p
                IsLatest = $true
            }
        }
    }
    
    $totalDeduplicatedProjects += $deduped.Count
    Write-Host ""
    Write-Host ("[" + $c.name + "] Raw Posts: " + $rawList.Count + " -> Deduplicated Projects: " + $deduped.Count)
    foreach ($d in $deduped) {
        $snip = ($d.Post.text -replace '\s+', ' ')
        if ($snip.Length -gt 85) { $snip = $snip.Substring(0, 85) + '...' }
        Write-Host ("  - [Latest: " + $d.Post.time + "] (Key: " + $d.Key + ") " + $snip)
    }
}

Write-Host ""
Write-Host "=================================================="
Write-Host ("TOTAL CLEAN DEDUPLICATED PROJECTS ACROSS ALL COMPANIES: " + $totalDeduplicatedProjects)
Write-Host "=================================================="
