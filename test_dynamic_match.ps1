$postsJson = Get-Content 'scripts/facebook_54_pages_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$dataJs = Get-Content 'js/data.js' -Raw -Encoding UTF8

if ($dataJs -match 'var UDON_COMPANIES = (\[[\s\S]*?\]);\s*(?:if|window|\Z)') {
    $companies = $matches[1] | ConvertFrom-Json
} else {
    Write-Error "Could not parse UDON_COMPANIES"
    exit 1
}

Write-Host "Total Scraped Posts: $($postsJson.Count)"
Write-Host "Total Companies in DB: $($companies.Count)"

function Get-FbSlug($url) {
    if (-not $url) { return "" }
    $u = $url.ToLower().Trim()
    $u = $u -replace 'https?://(www\.|m\.|mobile\.|web\.)?facebook\.com/', ''
    $u = $u -replace '\?.*$', ''
    $u = $u -replace '/$', ''
    return $u
}

$matchedCount = 0
$compPostCount = @{}

foreach ($c in $companies) {
    $compPostCount[$c.id] = @{
        name = $c.name
        fb = $c.facebookUrl
        posts = 0
    }
}

foreach ($post in $postsJson) {
    $pUrl = $post.facebookUrl
    if (-not $pUrl) { $pUrl = $post.inputUrl }
    if (-not $pUrl) { $pUrl = $post.url }
    
    $pSlug = Get-FbSlug $pUrl
    $pageName = ""
    if ($post.pageName) { $pageName = $post.pageName.ToLower() }
    elseif ($post.user -and $post.user.name) { $pageName = $post.user.name.ToLower() }
    
    $found = $null
    foreach ($c in $companies) {
        $cSlug = Get-FbSlug $c.facebookUrl
        if ($cSlug -and $pSlug -and ($pSlug -eq $cSlug -or $pSlug.StartsWith($cSlug) -or $cSlug.StartsWith($pSlug))) {
            $found = $c
            break
        }
        if ($cSlug -and $pUrl -and $pUrl.ToLower().Contains($cSlug)) {
            $found = $c
            break
        }
    }
    
    if ($found) {
        $matchedCount++
        $compPostCount[$found.id].posts++
    } else {
        Write-Host "Unmatched: $pUrl | Page: $pageName" -ForegroundColor Yellow
    }
}

Write-Host "`n==============================================="
Write-Host "Matched Posts: $matchedCount / $($postsJson.Count)"
$activeCompanies = ($compPostCount.Values | Where-Object { $_.posts -gt 0 }).Count
Write-Host "Active Companies with matched posts: $activeCompanies / $($companies.Count)"
Write-Host "==============================================="
