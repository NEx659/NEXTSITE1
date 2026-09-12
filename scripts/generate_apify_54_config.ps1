$content = Get-Content 'scripts/build_udon_54.js' -Raw -Encoding UTF8
$regex = [regex]'"fb":\s*"([^"]+)"'
$matches = $regex.Matches($content)
$urls = @()
foreach ($m in $matches) {
    $u = $m.Groups[1].Value
    if ($u -and -not ($urls -contains $u)) {
        $urls += $u
    }
}
Write-Host "Total Pages found: $($urls.Count)"
$startUrls = @()
foreach ($u in $urls) {
    $startUrls += @{ url = $u }
}
$config = @{
    startUrls = $startUrls
    resultsLimit = 8
    maxPosts = ($urls.Count * 8)
    commentsMode = "NONE"
}
$json = $config | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'scripts/apify_actor_config_54.json'), $json, [System.Text.Encoding]::UTF8)
Write-Host "Successfully generated scripts/apify_actor_config_54.json with $($urls.Count) pages and 8 posts limit!"
