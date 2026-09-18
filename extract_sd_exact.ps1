$raw = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/dataset.json", [System.Text.Encoding]::UTF8)
$dataset = $raw | ConvertFrom-Json

$pageId = "100069382099777"
$matched = @()

foreach ($item in $dataset) {
    $str = $item | ConvertTo-Json -Depth 4
    if ($str.IndexOf($pageId) -ge 0) {
        $matched += $item
    }
}

Write-Host "Matched posts for 100069382099777: $($matched.Count)"

$out = ""
$idx = 1
foreach ($item in $matched) {
    $time = $item.time
    $url = $item.url
    $likes = $item.likes
    $comments = $item.comments
    $shares = $item.shares
    $text = $item.text
    
    $out += "==================================================" + [Environment]::NewLine
    $out += "POST_$idx" + [Environment]::NewLine
    $out += "TIME: $time" + [Environment]::NewLine
    $out += "URL: $url" + [Environment]::NewLine
    $out += "LIKES: $likes | COMMENTS: $comments | SHARES: $shares" + [Environment]::NewLine
    $out += "TEXT:" + [Environment]::NewLine
    $out += "$text" + [Environment]::NewLine
    $out += "==================================================" + [Environment]::NewLine + [Environment]::NewLine
    $idx++
}

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/scratch/sd_exact_10posts.txt", $out, [System.Text.Encoding]::UTF8)
Write-Host "Saved to sd_exact_10posts.txt"
