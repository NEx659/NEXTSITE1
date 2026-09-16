$dataPath = "c:\Users\pannipan\Downloads\N\js\data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$prefix = $raw.Substring(0, $firstBracket)
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$suffix = $raw.Substring($lastBracket + 1)

$companies = $jsonStr | ConvertFrom-Json

# Also load raw scraped posts to match exact post URLs
$rawPostsJson = [System.IO.File]::ReadAllText("c:\Users\pannipan\Downloads\N\scripts\facebook_54_pages_posts.json", [System.Text.Encoding]::UTF8)
$allRawPosts = $rawPostsJson | ConvertFrom-Json

$updatedCount = 0

foreach ($c in $companies) {
    if (-not $c.projects -or $c.projects.Count -eq 0) { continue }
    
    foreach ($p in $c.projects) {
        $targetUrl = $p.facebookPostUrl
        if (-not $targetUrl) { $targetUrl = $p.postUrl }
        
        # If still missing or pointing to main page, find matching post in raw json
        if (-not $targetUrl -or $targetUrl -eq $c.facebookUrl) {
            $matched = $allRawPosts | Where-Object { 
                ($_.text -and $p.caption -and ($_.text.Contains($p.caption.Substring(0, [Math]::Min(30, $p.caption.Length))) -or $p.caption.Contains($_.text.Substring(0, [Math]::Min(30, $_.text.Length))))) -or
                ($_.text -and $p.name -and $_.text.Contains($p.name))
            } | Select-Object -First 1
            
            if ($matched) {
                $targetUrl = $matched.url
            }
        }
        
        if ($targetUrl) {
            # Unescape any unicode or html entities
            $targetUrl = $targetUrl.Replace('\u0026', '&').Replace('&amp;', '&')
            $p.postUrl = $targetUrl
            $p.facebookPostUrl = $targetUrl
            if (-not $p.siteProof) {
                $p.siteProof = [PSCustomObject]@{
                    postUrl = $targetUrl
                    postedTime = $p.lastUpdate
                    caption = $p.caption
                }
            } else {
                $p.siteProof.postUrl = $targetUrl
            }
            $updatedCount++
        }
    }
}

$newJson = $companies | ConvertTo-Json -Depth 10
# Ensure & is not escaped as \u0026 by ConvertTo-Json
$cleanJson = $newJson.Replace('\u0026', '&')

[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", ($prefix + $cleanJson + $suffix), [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\baseline_1_data.js", ($prefix + $cleanJson + $suffix), [System.Text.Encoding]::UTF8)

Write-Output "Successfully updated direct post URLs for $updatedCount projects!"
