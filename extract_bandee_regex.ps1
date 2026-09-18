[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content -Path "scratch/dataset.json" -Raw -Encoding UTF8
$chunks = $raw -split '(?="facebookUrl":\s*"https://www.facebook.com/bandee\.udee")'

$sb = [System.Text.StringBuilder]::new()
$idx = 1
foreach ($chunk in $chunks) {
    if ($chunk -notmatch '"facebookUrl":\s*"https://www.facebook.com/bandee\.udee"') { continue }
    
    $url = ""
    if ($chunk -match '"url":\s*"([^"]+)"') { $url = $matches[1] }
    
    $topUrl = ""
    if ($chunk -match '"topLevelUrl":\s*"([^"]+)"') { $topUrl = $matches[1] }
    
    $time = ""
    if ($chunk -match '"time":\s*"([^"]+)"') { $time = $matches[1] }
    
    $id = ""
    if ($chunk -match '"postId":\s*"([^"]+)"') { $id = $matches[1] }
    
    $text = ""
    if ($chunk -match '"text":\s*"([\s\S]*?)",\s*"textReferences"') {
        $text = $matches[1] -replace '\\n', "`n" -replace '\\"', '"'
    } elseif ($chunk -match '"text":\s*"([\s\S]*?)",\s*"likes"') {
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

Set-Content -Path "scratch/bandee_posts_clean.txt" -Value $sb.ToString() -Encoding UTF8
Write-Output "Extracted $($idx - 1) posts to scratch/bandee_posts_clean.txt"
