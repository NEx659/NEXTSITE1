[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataJs = Get-Content 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$startTag = 'var UDON_COMPANIES = '
$sIdx = $dataJs.IndexOf($startTag)
$endTag = "];`r`n`r`nif (typeof window"
if (-not $dataJs.Contains($endTag)) {
    $endTag = "];`n`nif (typeof window"
}
$eIdx = $dataJs.IndexOf($endTag)
$jsonPart = $dataJs.Substring($sIdx + $startTag.Length, $eIdx - ($sIdx + $startTag.Length) + 1).Trim()
$allCompanies = $jsonPart | ConvertFrom-Json

$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json
$posts = if ($rawPosts -is [array]) { $rawPosts } else { $rawPosts.items }

function Clean-Slug($url) {
    if (-not $url) { return '' }
    $u = [string]$url.ToLower().Trim()
    $u = $u -replace '^https?:\/\/(www\.|m\.|mobile\.|web\.)?facebook\.com\/', ''
    if ($u -match 'profile\.php\?id=([0-9]+)') { return "profile.php?id=" + $matches[1] }
    $u = $u -replace '\/posts\/.*$', '' -replace '\/videos\/.*$', '' -replace '\/photos\/.*$', '' -replace '\/reels?\/.*$', ''
    $u = $u -replace '\?.*$', '' -replace '\/$', '' -replace 'people\/[^\/]+\/', ''
    return $u
}

# Run company matching for all 58 companies
$matchedMap = @{}
foreach ($c in $allCompanies) {
    $matchedMap[$c.id] = @()
}

foreach ($comp in $allCompanies) {
    $cSlug = Clean-Slug $comp.facebookUrl
    $cName = [string]$comp.name.ToLower()
    $cEng = [string]$comp.engName.ToLower()

    $compPosts = $posts | Where-Object {
        $pUrl = Clean-Slug ($_.facebookUrl -or $_.inputUrl -or $_.url -or $_.topLevelUrl)
        $inSlug = if ($_.inputUrl) { Clean-Slug $_.inputUrl } else { '' }
        $pName = [string]$_.pageName.ToLower().Trim()
        $uName = if ($_.user -and $_.user.name) { [string]$_.user.name.ToLower().Trim() } else { '' }

        if ($cSlug -and $pUrl -and ($pUrl -eq $cSlug -or $pUrl.Contains($cSlug) -or $cSlug.Contains($pUrl))) { return $true }
        if ($cSlug -and $inSlug -and ($inSlug -eq $cSlug -or $inSlug.Contains($cSlug) -or $cSlug.Contains($inSlug))) { return $true }
        if ($pName -and ($cName.Contains($pName) -or $pName.Contains($cName))) { return $true }
        if ($uName -and ($cName.Contains($uName) -or $uName.Contains($cName))) { return $true }
        if ($cEng -and $pName -and ($cEng.Contains($pName) -or $pName.Contains($cEng))) { return $true }
        return $false
    }
    
    if ($compPosts.Count -gt 0) {
        Write-Host "Comp: $($comp.id) - $($comp.name) matched $($compPosts.Count) raw posts"
    }
}
