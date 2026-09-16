$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
$posts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

$validPosts = @()
foreach ($p in $posts) {
    if ($p.error -or $p.'#error' -or $p.PSObject.Properties['#error']) {
        continue
    }
    if (-not $p.text -and -not $p.message -and -not $p.url -and -not $p.facebookUrl) {
        continue
    }
    $validPosts += $p
}

# Read allCompanies from js/data.js
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
Write-Host "Companies loaded: $($companies.Count)"

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

$matchedPostIndices = [System.Collections.Generic.HashSet[int]]::new()
$compProjectsCount = @{}

foreach ($comp in $companies) {
    $cSlug = Clean-Slug $comp.facebookUrl
    $cName = if ($comp.name) { $comp.name.ToLower() } else { '' }
    $cEng = if ($comp.engName) { $comp.engName.ToLower() } else { '' }

    $count = 0
    for ($i = 0; $i -lt $validPosts.Count; $i++) {
        $p = $validPosts[$i]
        $pUrl = Clean-Slug ($p.facebookUrl, $p.inputUrl, $p.url, $p.topLevelUrl | Where-Object { $_ } | Select-Object -First 1)
        $pName = if ($p.pageName) { $p.pageName.ToLower().Trim() } else { '' }
        $uName = if ($p.user -and $p.user.name) { $p.user.name.ToLower().Trim() } else { '' }

        $m = $false
        if ($cSlug -and $pUrl -and ($pUrl -eq $cSlug -or $pUrl.Contains($cSlug) -or $cSlug.Contains($pUrl))) {
            $m = $true
        } elseif ($pName -and ($cName.Contains($pName) -or $pName.Contains($cName))) {
            $m = $true
        } elseif ($uName -and ($cName.Contains($uName) -or $uName.Contains($cName))) {
            $m = $true
        } elseif ($cEng -and $pName -and ($cEng.Contains($pName) -or $pName.Contains($cEng))) {
            $m = $true
        }

        if ($m) {
            $matchedPostIndices.Add($i) | Out-Null
            $count++
        }
    }
    $compProjectsCount[$comp.name] = $count
}

Write-Host "MATCHED_UNIQUE_POSTS: $($matchedPostIndices.Count)"
Write-Host "TOTAL_VALID_POSTS: $($validPosts.Count)"
Write-Host "UNMATCHED_COUNT: $($validPosts.Count - $matchedPostIndices.Count)"
