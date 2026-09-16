$raw = Get-Content -Path 'scripts\udon_raw.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$urls = @()
$seen = @{}

foreach ($c in $raw) {
    if ($c.fb -and -not $seen.ContainsKey($c.fb)) {
        $seen[$c.fb] = $true
        $urls += @{ "url" = $c.fb }
    }
}

Write-Output "Total URLs extracted: $($urls.Count)"

$apifyInput = @{
    "startUrls" = $urls
    "resultsLimit" = 15
    "maxPosts" = $urls.Count * 15
    "commentsMode" = "NONE"
    "caption" = $true
}

$jsonOutput = $apifyInput | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("scripts\apify_actor_config_58.json", $jsonOutput, [System.Text.Encoding]::UTF8)
Write-Output "Saved scripts\apify_actor_config_58.json successfully!"
