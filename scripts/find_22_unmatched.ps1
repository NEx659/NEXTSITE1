$raw = [System.IO.File]::ReadAllText('scripts/facebook_54_pages_posts.json', [System.Text.Encoding]::UTF8)
$allPosts = $raw | ConvertFrom-Json

$dataPath = 'js/data.js'
$dataJs = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)
$fb = $dataJs.IndexOf('[')
$lb = $dataJs.LastIndexOf(']')
$comps = $dataJs.Substring($fb, $lb - $fb + 1) | ConvertFrom-Json

$allMatchedUrls = @{}
foreach ($c in $comps) {
    foreach ($p in $c.projects) {
        $allMatchedUrls[$p.postUrl] = $true
        $allMatchedUrls[$p.facebookPostUrl] = $true
    }
}

$unmatched = $allPosts | Where-Object { -not $allMatchedUrls.ContainsKey($_.url) }

Write-Output "Total Scraped Posts in File: $($allPosts.Count)"
Write-Output "Total Matched to 58 Companies: $($allMatchedUrls.Count)"
Write-Output "Total Unmatched: $($unmatched.Count)"
Write-Output "--------------------------------------------------"

$groupedUnmatched = $unmatched | Group-Object -Property { 
    if ($_.user.name) { $_.user.name } else { $_.pageName } 
}

foreach ($g in $groupedUnmatched) {
    Write-Output "PAGE NAME: '$($g.Name)' ($($g.Count) posts)"
    foreach ($item in $g.Group | Select-Object -First 3) {
        Write-Output "   - Post URL: $($item.url)"
        Write-Output "   - Input URL: $($item.inputUrl)"
        Write-Output "   - User Profile: $($item.user.profileUrl)"
        Write-Output "   - User ID: $($item.user.id)"
        Write-Output "   - Text Preview: $(if ($item.text) { $item.text.Substring(0, [Math]::Min(80, $item.text.Length)) } else { '' })"
        Write-Output ""
    }
}
