[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
$posts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

$dataJs = Get-Content -LiteralPath 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
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
    
    # 2. Contains slug match
    if (-not $found) {
        foreach ($c in $companies) {
            $cSlug = Get-ProperSlug $c.facebookUrl
            if ($cSlug -and $pSlug -and ($pSlug.Contains($cSlug) -or $cSlug.Contains($pSlug))) {
                $found = $c
                break
            }
        }
    }
    
    # 3. Name match
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
        $compMap[$found.id].Add(@{ index = $i; item = $p })
    } else {
        $unmatched.Add(@{ index = $i; item = $p; pSlug = $pSlug; pName = $pName; rawUrl = $pUrlRaw })
    }
}

Write-Host "================= COMPANY BREAKDOWN ================="
$totalMatched = 0
foreach ($c in $companies) {
    $cnt = $compMap[$c.id].Count
    $totalMatched += $cnt
    if ($cnt -gt 0) {
        Write-Host "$($c.id) | $($c.name) | FB: $($c.facebookUrl) -> $cnt items"
    }
}

Write-Host "====================================================="
Write-Host "Total matched: $totalMatched"
Write-Host "Total unmatched: $($unmatched.Count)"
if ($unmatched.Count -gt 0) {
    Write-Host "`n--- UNMATCHED LIST ---"
    foreach ($u in $unmatched) {
        Write-Host "[$($u.index)] rawUrl: $($u.rawUrl) | slug: $($u.pSlug) | pageName: $($u.pName) | text preview: $($u.item.text.Substring(0, [Math]::Min(50, $u.item.text.Length)))"
    }
}
