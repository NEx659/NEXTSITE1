$postsJson = Get-Content 'scripts/facebook_54_pages_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$dataJs = Get-Content 'js/data.js' -Raw -Encoding UTF8

if ($dataJs -match 'var UDON_COMPANIES = (\[[\s\S]*?\]);\s*(?:if|window|\Z)') {
    $companies = $matches[1] | ConvertFrom-Json
} else {
    Write-Error "Could not parse UDON_COMPANIES"
    exit 1
}

function Get-FbSlug($url) {
    if (-not $url) { return "" }
    $u = $url.ToLower().Trim()
    $u = $u -replace 'https?://(www\.|m\.|mobile\.|web\.)?facebook\.com/', ''
    $u = $u -replace '\?.*$', ''
    $u = $u -replace '/$', ''
    return $u
}

# Group posts by company
$compPosts = @{}
foreach ($c in $companies) {
    $compPosts[$c.id] = @()
    $c.projects = @()
}

foreach ($post in $postsJson) {
    $pUrl = $post.facebookUrl
    if (-not $pUrl) { $pUrl = $post.inputUrl }
    if (-not $pUrl) { $pUrl = $post.url }
    
    $pSlug = Get-FbSlug $pUrl
    
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
        $compPosts[$found.id] += $post
    }
}

Write-Host "Syncing posts to companies in js/data.js..."
$totalAssigned = 0

foreach ($c in $companies) {
    $posts = $compPosts[$c.id]
    if ($posts -and $posts.Count -gt 0) {
        # Take latest post as signal
        $latest = $posts[0]
        $rawText = $latest.text
        if (-not $rawText) { $rawText = $latest.message }
        if (-not $rawText) { $rawText = "อัปเดตหน้างานสร้างบ้าน จ.อุดรธานี" }
        
        $c.facebookSignal.postDate = if ($latest.time) { ([datetime]$latest.time).ToString("dd/MM/yyyy") } else { "ล่าสุด" }
        $c.facebookSignal.caption = $rawText
        $c.facebookSignal.likes = if ($latest.likesCount) { [int]$latest.likesCount } else { 0 }
        $c.facebookSignal.comments = if ($latest.commentsCount) { [int]$latest.commentsCount } else { 0 }
        $c.facebookSignal.shares = if ($latest.sharesCount) { [int]$latest.sharesCount } else { 0 }
        
        $totalAssigned += $posts.Count
    }
}

$updatedJson = $companies | ConvertTo-Json -Depth 10
$newJsContent = "// UDON THANI MASTER DATASET (54 COMPANIES)`nvar UDON_COMPANIES = $updatedJson;`n`nif (typeof window !== 'undefined') {`n  window.UDON_COMPANIES = UDON_COMPANIES;`n}`n"

[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'js/data.js'), $newJsContent, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'js/baseline_1_data.js'), $newJsContent, [System.Text.Encoding]::UTF8)

Write-Host "Successfully synced $totalAssigned posts across $($companies.Count) companies to js/data.js and js/baseline_1_data.js!"
