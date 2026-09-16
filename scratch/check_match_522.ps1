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

Write-Host "Total raw items in json: $($posts.Count)"
Write-Host "Total companies in data.js: $($companies.Count)"

function Clean-Slug($url) {
    if (-not $url) { return '' }
    $u = [string]$url.ToLower().Trim()
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '^https?:\/\/(www\.|m\.|mobile\.|web\.)?facebook\.com\/', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/posts\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/videos\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/photos\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\?.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, 'people\/[^\/]+\/', '')
    return $u
}

$compMap = @{}
foreach ($c in $companies) {
    $compMap[$c.id] = @()
}
$unmatched = @()

for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    $pUrl = Clean-Slug ($p.facebookUrl, $p.inputUrl, $p.url, $p.topLevelUrl | Where-Object { $_ } | Select-Object -First 1)
    $pName = if ($p.pageName) { $p.pageName.ToLower().Trim() } else { '' }
    $uName = if ($p.user -and $p.user.name) { $p.user.name.ToLower().Trim() } else { '' }
    
    $found = $null
    foreach ($c in $companies) {
        $cSlug = Clean-Slug $c.facebookUrl
        $cName = if ($c.name) { $c.name.ToLower() } else { '' }
        $cEng = if ($c.engName) { $c.engName.ToLower() } else { '' }
        
        if ($cSlug -and $pUrl -and ($pUrl -eq $cSlug -or $pUrl.Contains($cSlug) -or $cSlug.Contains($pUrl))) {
            $found = $c
            break
        } elseif ($pName -and ($cName.Contains($pName) -or $pName.Contains($cName))) {
            $found = $c
            break
        } elseif ($uName -and ($cName.Contains($uName) -or $uName.Contains($cName))) {
            $found = $c
            break
        } elseif ($cEng -and $pName -and ($cEng.Contains($pName) -or $pName.Contains($cEng))) {
            $found = $c
            break
        }
    }
    
    if ($found) {
        $compMap[$found.id] += @{ index = $i; item = $p }
    } else {
        $unmatched += @{ index = $i; item = $p }
    }
}

$totalMatched = 0
foreach ($k in $compMap.Keys) {
    $cnt = $compMap[$k].Count
    $totalMatched += $cnt
    if ($cnt -gt 0) {
        $c = $companies | Where-Object { $_.id -eq $k } | Select-Object -First 1
        Write-Host "$($c.name) ($($c.id)): $cnt items"
    }
}

Write-Host "============================="
Write-Host "Total matched: $totalMatched"
Write-Host "Total unmatched: $($unmatched.Count)"
if ($unmatched.Count -gt 0) {
    foreach ($u in $unmatched) {
        Write-Host "Unmatched index $($u.index): inputUrl=$($u.item.inputUrl) pageName=$($u.item.pageName) url=$($u.item.url)"
    }
}
