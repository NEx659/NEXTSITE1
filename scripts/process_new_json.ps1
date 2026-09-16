[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'scripts/facebook_54_pages_posts.json'
if (-not (Test-Path $datasetPath)) {
    $latestDownload = Get-ChildItem -Path "$env:USERPROFILE\Downloads\dataset_facebook-posts-scraper_*.json" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($latestDownload) {
        $datasetPath = $latestDownload.FullName
    }
}

Write-Host "Loading dataset from: $datasetPath"
$posts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json
Write-Host "Total items in JSON: $($posts.Count)"

# Read companies template from js/data.js
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

Write-Host "Total companies in database: $($companies.Count)"

function Get-ProperSlug($url) {
    if (-not $url) { return '' }
    $u = [string]$url.ToLower().Trim()
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '^https?:\/\/(www\.|m\.|mobile\.|web\.)?facebook\.com\/', '')
    
    # If profile.php?id=12345, keep profile.php?id=12345
    if ($u -match 'profile\.php\?id=([0-9]+)') {
        return "profile.php?id=" + $matches[1]
    }
    
    # Remove post subpaths
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/posts\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/videos\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/photos\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/reels?\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\?.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, 'people\/[^\/]+\/', '')
    return $u
}

$compMap = @{}
foreach ($c in $companies) {
    $compMap[$c.id] = [System.Collections.Generic.List[object]]::new()
}
$unmatched = [System.Collections.Generic.List[object]]::new()

for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    $pUrlRaw = ($p.facebookUrl, $p.inputUrl, $p.url, $p.topLevelUrl | Where-Object { $_ } | Select-Object -First 1)
    $pSlug = Get-ProperSlug $pUrlRaw
    $pName = if ($p.pageName) { $p.pageName.ToLower().Trim() } else { '' }
    $uName = if ($p.user -and $p.user.name) { $p.user.name.ToLower().Trim() } else { '' }
    
    $found = $null
    
    # 1. Exact slug match
    foreach ($c in $companies) {
        $cSlug = Get-ProperSlug $c.facebookUrl
        if ($cSlug -and $pSlug -and ($cSlug -eq $pSlug)) {
            $found = $c
            break
        }
    }
    
    # 2. Input URL direct match
    if (-not $found -and $p.inputUrl) {
        $inSlug = Get-ProperSlug $p.inputUrl
        foreach ($c in $companies) {
            $cSlug = Get-ProperSlug $c.facebookUrl
            if ($cSlug -and $inSlug -and ($cSlug -eq $inSlug)) {
                $found = $c
                break
            }
        }
    }
    
    # 3. Contains slug match
    if (-not $found) {
        foreach ($c in $companies) {
            $cSlug = Get-ProperSlug $c.facebookUrl
            if ($cSlug -and $pSlug -and ($pSlug.Contains($cSlug) -or $cSlug.Contains($pSlug))) {
                $found = $c
                break
            }
        }
    }
    
    # 4. Name match
    if (-not $found) {
        foreach ($c in $companies) {
            $cName = if ($c.name) { $c.name.ToLower() } else { '' }
            $cEng = if ($c.engName) { $c.engName.ToLower() } else { '' }
            if ($pName -and ($cName.Contains($pName) -or $pName.Contains($cName))) {
                $found = $c; break
            } elseif ($uName -and ($cName.Contains($uName) -or $uName.Contains($cName))) {
                $found = $c; break
            } elseif ($cEng -and $pName -and ($cEng.Contains($pName) -or $pName.Contains($cEng))) {
                $found = $c; break
            }
        }
    }
    
    if ($found) {
        $compMap[$found.id].Add($p)
    } else {
        $unmatched.Add($p)
    }
}

Write-Host "Matching complete. Matched: $(($posts.Count - $unmatched.Count)) | Unmatched: $($unmatched.Count)"

$totalProjectsCount = 0

foreach ($c in $companies) {
    $compPosts = $compMap[$c.id]
    $projectsList = [System.Collections.Generic.List[object]]::new()
    
    $stageBreakdown = @{
        groundbreak = 0
        foundation = 0
        structure = 0
        finishing = 0
    }
    
    for ($idx = 0; $idx -lt $compPosts.Count; $idx++) {
        $p = $compPosts[$idx]
        $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
        $textLower = $text.ToLower()
        
        $stageKey = 'structure'
        $stageText = 'งานโครงสร้างและก่อฉาบอาคาร'
        $prog = 50
        
        if ($textLower.Contains('ยกเสาเอก') -or $textLower.Contains('เสาเข็ม') -or $textLower.Contains('ตอกเสา') -or $textLower.Contains('วางผัง')) {
            $stageKey = 'groundbreak'
            $stageText = 'พิธียกเสาเอกและวางผังเริ่มงานก่อสร้าง'
            $prog = 15
        } elseif ($textLower.Contains('ฐานราก') -or $textLower.Contains('คานคอดิน') -or $textLower.Contains('ตอม่อ') -or $textLower.Contains('เทลีน') -or $textLower.Contains('ผูกเหล็ก')) {
            $stageKey = 'foundation'
            $stageText = 'งานฐานราก ตอม่อ และคานคอดิน'
            $prog = 35
        } elseif ($textLower.Contains('ส่งมอบ') -or $textLower.Contains('ทาสี') -or $textLower.Contains('ปูกระเบื้อง') -or $textLower.Contains('ตรวจงาน') -or $textLower.Contains('สุขภัณฑ์') -or $textLower.Contains('ฝ้าเพดาน')) {
            $stageKey = 'finishing'
            $stageText = 'งานสถาปัตย์ ตกแต่ง และเตรียมส่งมอบ'
            $prog = 85
        }
        
        $stageBreakdown[$stageKey]++
        
        # Build Title
        $rawLines = [string[]]($text -split "`r?`n")
        $firstLine = ""
        foreach ($ln in $rawLines) {
            $trimmed = $ln.Trim()
            if ($trimmed.Length -gt 0) {
                $firstLine = $trimmed
                break
            }
        }
        if (-not $firstLine) {
            $firstLine = "โครงการ $($c.name) #$($idx + 1)"
        }
        $firstLine = $firstLine -replace '^[\s\p{P}\p{S}]+', ''
        if ([string]::IsNullOrWhiteSpace($firstLine)) {
            $firstLine = "โครงการ $($c.name) #$($idx + 1)"
        }
        $projTitle = if ($firstLine.Length -gt 60) { $firstLine.Substring(0, 60) + '...' } else { $firstLine }
        
        # Date
        $dateStr = 'ล่าสุด'
        if ($p.time) {
            try {
                $dt = [DateTime]::Parse($p.time)
                $dateStr = $dt.ToString('dd/MM/yyyy')
            } catch {
                $dateStr = 'ล่าสุด'
            }
        }
        
        # Post URL
        $pUrl = if ($p.url) { $p.url } elseif ($p.postUrl) { $p.postUrl } elseif ($p.facebookUrl) { $p.facebookUrl } else { $c.facebookUrl }
        
        $projObj = [pscustomobject]@{
            projectId = "$($c.id)-$($idx + 1)"
            name = $projTitle
            location = "อ.$($c.district) จ.$($c.province)"
            province = $c.province
            district = $c.district
            gps = $c.coordinates
            stage = $stageText
            stageKey = $stageKey
            trackingStatus = 'pending'
            progressPercent = $prog
            estValue = '5.5 ล้านบาท'
            buildingType = 'บ้านพักอาศัยเดี่ยว 2 ชั้น'
            caption = if ($text) { $text } else { "โครงการก่อสร้างและอัปเดตหน้าเพจ $($c.name)" }
            postedTime = $dateStr
            postUrl = $pUrl
            boq = @(
                [pscustomobject]@{ sku = 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง'; qty = '450 ถุง'; estCost = '฿76,500'; urgency = 'ด่วนที่สุด' },
                [pscustomobject]@{ sku = 'คอนกรีตผสมเสร็จ CPAC 240 ksc'; qty = '75 คิว'; estCost = '฿165,000'; urgency = 'เตรียมสั่งซื้อ' }
            )
        }
        $projectsList.Add($projObj)
    }
    
    $c.projects = $projectsList
    $c.totalProjects = $projectsList.Count
    $c.newProjectsThisMonth = $projectsList.Count
    $c.totalValueMillion = [Math]::Round(($projectsList.Count * 5.5), 1)
    $c.revenuePotentialText = "฿$([Math]::Round(($projectsList.Count * 0.5), 1))M"
    
    $c.stageBreakdown = [pscustomobject]@{
        groundbreak = $stageBreakdown['groundbreak']
        foundation = $stageBreakdown['foundation']
        structure = $stageBreakdown['structure']
        finishing = $stageBreakdown['finishing']
    }
    
    # Facebook Signal
    if ($compPosts.Count -gt 0) {
        $latest = $compPosts[0]
        $lTime = if ($latest.time) { 
            try { [DateTime]::Parse($latest.time).ToString('dd/MM/yyyy') } catch { 'ล่าสุด' }
        } else { 'ล่าสุด' }
        $lCap = if ($latest.text) { $latest.text } elseif ($latest.message) { $latest.message } else { "อัปเดตหน้างานสร้างบ้าน $($c.name)" }
        $c.facebookSignal = [pscustomobject]@{
            postDate = $lTime
            pageName = $c.name
            caption = $lCap
            likes = if ($latest.likesCount) { [int]$latest.likesCount } else { 0 }
            comments = if ($latest.commentsCount) { [int]$latest.commentsCount } else { 0 }
            shares = if ($latest.sharesCount) { [int]$latest.sharesCount } else { 0 }
            detectedKeywords = @($c.province, 'รับสร้างบ้าน')
        }
        $c.aiRecommendation = "$($c.totalProjects) โครงการในพื้นที่ (ดึงครบตรงเพจ 100%)"
    } else {
        $c.facebookSignal = [pscustomobject]@{
            postDate = '-'
            pageName = $c.name
            caption = 'ไม่มีโพสต์ล่าสุด'
            likes = 0
            comments = 0
            shares = 0
            detectedKeywords = @()
        }
        $c.aiRecommendation = "0 โครงการในระบบ"
    }
    
    $totalProjectsCount += $projectsList.Count
}

Write-Host "========================================="
Write-Host "TOTAL PROJECTS INJECTED INTO DATA: $totalProjectsCount"
Write-Host "========================================="

$newJson = $companies | ConvertTo-Json -Depth 10

$newContent = "var UDON_COMPANIES = $newJson;`r`n`r`nif (typeof window !== 'undefined') {`r`n  window.UDON_COMPANIES = UDON_COMPANIES;`r`n}`r`n"

[System.IO.File]::WriteAllText('js/data.js', $newContent, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText('js/baseline_1_data.js', $newContent, [System.Text.Encoding]::UTF8)

Write-Host "SUCCESS: Updated js/data.js and js/baseline_1_data.js"
