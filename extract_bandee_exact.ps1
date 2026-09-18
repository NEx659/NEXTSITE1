[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content -Path "scratch/dataset.json" -Raw -Encoding UTF8

# Find all blocks with "facebookId": "100091437234511" or "facebookUrl": "https://www.facebook.com/bandee.udee"
# Let's split by `{` at top level or parse objects
$matches = [regex]::Matches($raw, '\{\s*"facebookUrl":\s*"https://www\.facebook\.com/bandee\.udee"[\s\S]*?(?=\n\{|\Z)')

$sb = [System.Text.StringBuilder]::new()
$idx = 1
foreach ($m in $matches) {
    $chunk = $m.Value
    
    $url = ""
    if ($chunk -match '"url":\s*"([^"]+)"') { $url = $matches[1] }
    
    $topUrl = ""
    if ($chunk -match '"topLevelUrl":\s*"([^"]+)"') { $topUrl = $matches[1] }
    
    $time = ""
    if ($chunk -match '"time":\s*"([^"]+)"') { $time = $matches[1] }
    
    $id = ""
    if ($chunk -match '"postId":\s*"([^"]+)"') { $id = $matches[1] }
    
    $text = ""
    if ($chunk -match '"text":\s*"([\s\S]*?)",\s*"(?:textReferences|likes|reactionLikeCount)"') {
        $text = $matches[1] -replace '\\n', "`n" -replace '\\"', '"'
    }
    
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("POST #$idx")
    [void]$sb.AppendLine("ID: $id")
    [void]$sb.AppendLine("Time: $time")
    [void]$sb.AppendLine("URL: $url")
    [void]$sb.AppendLine("TopLevelURL: $topUrl")
    [void]$sb.AppendLine("TEXT:")
    [void]$sb.AppendLine($text)
    [void]$sb.AppendLine("")
    $idx++
}

Set-Content -Path "scratch/bandee_10posts_exact.txt" -Value $sb.ToString() -Encoding UTF8
Write-Output "Found $($idx - 1) exact posts for Bandee Udee Design"
