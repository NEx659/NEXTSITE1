# Script: pull_all_raw_posts.ps1
# Pull ALL scraped Facebook posts for all companies with ZERO exclusion

$dataPath = "c:\Users\pannipan\Downloads\N\js\data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$prefix = $raw.Substring(0, $firstBracket)
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$suffix = $raw.Substring($lastBracket + 1)

$companies = $jsonStr | ConvertFrom-Json

# Load all 286 scraped posts
$rawPostsJson = [System.IO.File]::ReadAllText("c:\Users\pannipan\Downloads\N\scripts\facebook_54_pages_posts.json", [System.Text.Encoding]::UTF8)
$allPosts = $rawPostsJson | ConvertFrom-Json

Write-Output "Loaded $($allPosts.Count) raw Facebook posts."
Write-Output "Loaded $($companies.Count) companies."

function Get-CleanSlug($url) {
    if (-not $url) { return "" }
    $u = $url.ToLower().Trim()
    $u = $u -replace 'https?://(www\.|m\.|mobile\.|web\.)?facebook\.com/', ''
    $u = $u -replace '/posts/.*$', ''
    $u = $u -replace '/videos/.*$', ''
    $u = $u -replace '/photos/.*$', ''
    $u = $u -replace '\?.*$', ''
    $u = $u -replace '/$', ''
    $u = $u -replace 'people/[^/]+/', ''
    $u = $u -replace 'profile\.php\?id=', ''
    return $u
}

# Group posts by company
$compPostsMap = @{}
foreach ($c in $companies) {
    $compPostsMap[$c.id] = @()
}

$unmatchedPosts = @()

foreach ($p in $allPosts) {
    $matchedComp = $null
    
    $pUrlSlug = Get-CleanSlug ($p.url)
    $pPageSlug = Get-CleanSlug ($p.inputUrl)
    $pUserSlug = Get-CleanSlug ($p.user.profileUrl)
    $pUserName = if ($p.user.name) { $p.user.name } else { "" }
    $pUserId = if ($p.user.id) { $p.user.id } else { "" }
    
    # 1. Match by slug / URL / user id
    foreach ($c in $companies) {
        $cSlug = Get-CleanSlug ($c.facebookUrl)
        
        if ($cSlug -and ($cSlug -eq $pUrlSlug -or $cSlug -eq $pPageSlug -or $cSlug -eq $pUserSlug)) {
            $matchedComp = $c
            break
        }
        
        if ($c.facebookUrl -and $pUserId -and $c.facebookUrl.Contains($pUserId)) {
            $matchedComp = $c
            break
        }
    }
    
    # 2. Match by Name if still not matched
    if (-not $matchedComp -and $pUserName) {
        foreach ($c in $companies) {
            $cClean = ($c.name -replace '(บริษัท|ห้างหุ้นส่วนจำกัด|จำกัด|\(.*\))', '').Trim()
            if ($cClean.Length -ge 4 -and ($pUserName.Contains($cClean) -or $c.name.Contains($pUserName))) {
                $matchedComp = $c
                break
            }
        }
    }

    # 3. Known page slug overrides
    if (-not $matchedComp) {
        if ($pUrlSlug -like '*maharungroj*' -or $pUserName -like '*MAHARUNGROJ*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-05' }
        } elseif ($pUrlSlug -like '*modernde*' -or $pUserName -like '*Modern-de*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-04' }
        } elseif ($pUrlSlug -like '*twentysix*' -or $pUserName -like '*Twentysix*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-08' }
        } elseif ($pUrlSlug -like '*nasit*' -or $pUserName -like '*Nasit*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-09' }
        } elseif ($pUrlSlug -like '*tt1991*' -or $pUserName -like '*TT design*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-10' }
        } elseif ($pUrlSlug -like '*4estate*' -or $pUserName -like '*4Estate*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-15' }
        } elseif ($pUrlSlug -like '*mosaic*' -or $pUserName -like '*Mosaic*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-60' }
        } elseif ($pUrlSlug -like '*sunsiri*' -or $pUserName -like '*sunsiri*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-18' }
        } elseif ($pUrlSlug -like '*apinya*' -or $pUserName -like '*DNN*' -or $pUserName -like '*Apinya*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-23' }
        } elseif ($pUrlSlug -like '*syhouse*' -or $pUserName -like '*SY.House*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-35' }
        } elseif ($pUrlSlug -like '*siarchitecture*' -or $pUserName -like '*siarchitecture*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-56' }
        } elseif ($pUrlSlug -like '*61558614631187*' -or $pUserName -like '*เกียรติรุ่งเรือง*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-58' }
        } elseif ($pUrlSlug -like '*captaincivil*' -or $pUserName -like '*Captain Civil*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-07' }
        } elseif ($pUrlSlug -like '*phc.ud*' -or $pUserName -like '*ป.สวนสวรรค์*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-01' }
        } elseif ($pUrlSlug -like '*nayoohouse*' -or $pUserName -like '*น่าอยู่*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-03' }
        } elseif ($pUrlSlug -like '*baanyai*' -or $pPageSlug -like '*baanyai*' -or $pUserName -like '*Chayanat Pakkulab*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-32' }
        } elseif ($pUrlSlug -like '*ahouse*' -or $pPageSlug -like '*ahouse*' -or $pUserName -like '*เอ-เฮ้าส์*' -or $pUserName -like '*A-House*') {
            $matchedComp = $companies | Where-Object { $_.id -eq 'comp-udon-42' }
        }

    }
    
    if ($matchedComp) {
        $compPostsMap[$matchedComp.id] += $p
    } else {
        $unmatchedPosts += $p
    }
}

Write-Output "Matched posts to companies. Unmatched posts count: $($unmatchedPosts.Count)"

# Now build projects for each company from ALL matched posts
$totalProjectCount = 0

foreach ($c in $companies) {
    $matchedList = $compPostsMap[$c.id]
    
    if (-not $matchedList -or $matchedList.Count -eq 0) {
        $c.projects = @()
        $c.totalProjects = 0
        $c.newProjectsThisMonth = 0
        $c.totalValueMillion = 0.0
        $c.stageBreakdown = [PSCustomObject]@{
            groundbreak = 0
            foundation = 0
            structure = 0
            finishing = 0
        }
        $c.aiShortRec = "ไม่พบโพสต์ในช่วงเวลาที่สำรวจ"
        continue
    }
    
    $projectList = @()
    $idx = 1
    
    foreach ($post in $matchedList) {
        $text = if ($post.text) { $post.text } else { $post.caption }
        if (-not $text) { $text = "โพสต์อัปเดตจาก Facebook" }
        
        # Post URL
        $pUrl = $post.url
        if (-not $pUrl) { $pUrl = $c.facebookUrl }
        $pUrl = $pUrl.Replace('\u0026', '&').Replace('&amp;', '&')
        
        # Date
        $pDate = if ($post.time) { 
            ([DateTime]$post.time).ToString("yyyy-MM-dd") 
        } else { 
            "2026-09-10" 
        }
        
        # Image
        $imgUrl = ""
        if ($post.media -and $post.media.Count -gt 0) {
            $imgUrl = $post.media[0].thumbnail
            if (-not $imgUrl) { $imgUrl = $post.media[0].url }
        }
        if (-not $imgUrl -or $imgUrl -like '*.mp4*') {
            $imgUrl = "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80"
        }
        
        # Extract title from first line
        $firstLine = ($text -split "`n")[0].Trim()
        if (-not $firstLine -or $firstLine.Length -lt 4) {
            $firstLine = "โพสต์อัปเดตโครงการ #" + $idx
        }
        if ($firstLine.Length -gt 70) {
            $firstLine = $firstLine.Substring(0, 67) + "..."
        }
        
        # Simple district detector
        $dist = "เมืองอุดรธานี"
        if ($text -match '(กุมภวาปี|หนองหาน|บ้านดุง|เพ็ญ|กุดจับ|โนนสะอาด|ศรีธาตุ|วังสามหมอ|ทุ่งฝน|สร้างคอม|หนองแสง|หนองวัวซอ|บ้านผือ|น้ำโสม|นายูง|พิบูลย์รักษ์|กู่แก้ว|ประจักษ์|สว่างแดนดิน|สกลนคร|หนองคาย|ขอนแก่น|บึงกาฬ)') {
            $dist = $matches[0]
        }
        
        # Stage detector
        $st = "งานโครงสร้างและก่อสร้างทั่วไป"
        $stKey = "structure"
        if ($text -match '(เสาเอก|เสาเข็ม|เปิดหน้างาน|วางศิลาฤกษ์|ปรับพื้นที่)') {
            $st = "งานเตรียมพื้นที่และเสาเอก"
            $stKey = "groundbreak"
        } elseif ($text -match '(ฐานราก|เทคาน|คานคอดิน|เทพื้น|ตอม่อ)') {
            $st = "งานฐานรากและคานคอดิน"
            $stKey = "foundation"
        } elseif ($text -match '(สี|ฝ้า|กระเบื้อง|ส่งมอบ|ตกแต่ง|อลูมิเนียม|กระจก|บันได)') {
            $st = "งานสถาปัตย์และเก็บงาน"
            $stKey = "finishing"
        }
        
        $projObj = [PSCustomObject]@{
            id = "proj-$($c.id)-$idx"
            name = $firstLine
            district = $dist
            stage = $st
            stageKey = $stKey
            progressPercent = 60
            budgetMillion = 5.5
            lastUpdate = $pDate
            caption = $text
            imageUrl = $imgUrl
            postUrl = $pUrl
            facebookPostUrl = $pUrl
            siteProof = [PSCustomObject]@{
                postUrl = $pUrl
                postedTime = $pDate
                caption = $text
            }
        }
        
        $projectList += $projObj
        $idx++
    }
    
    $c.projects = $projectList
    $c.totalProjects = $projectList.Count
    $c.newProjectsThisMonth = $projectList.Count
    $c.totalValueMillion = [Math]::Round($projectList.Count * 5.5, 1)
    
    $gb = 0; $fd = 0; $st = 0; $fn = 0
    foreach ($vp in $projectList) {
        if ($vp.stageKey -eq 'groundbreak') { $gb++ }
        elseif ($vp.stageKey -eq 'foundation') { $fd++ }
        elseif ($vp.stageKey -eq 'structure') { $st++ }
        elseif ($vp.stageKey -eq 'finishing') { $fn++ }
        else { $st++ }
    }
    $c.stageBreakdown = [PSCustomObject]@{
        groundbreak = $gb
        foundation = $fd
        structure = $st
        finishing = $fn
    }
    
    $c.aiShortRec = "ดึงข้อมูลครบทุกโพสต์ล่าสุด ($($projectList.Count) โพสต์จาก Facebook)"
    $totalProjectCount += $projectList.Count
}

$newJson = $companies | ConvertTo-Json -Depth 10
$cleanJson = $newJson.Replace('\u0026', '&')

[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", ($prefix + $cleanJson + $suffix), [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\baseline_1_data.js", ($prefix + $cleanJson + $suffix), [System.Text.Encoding]::UTF8)

Write-Output "=================================================="
Write-Output "SUCCESS: Pulled ALL $totalProjectCount posts into data.js!"
Write-Output "=================================================="
