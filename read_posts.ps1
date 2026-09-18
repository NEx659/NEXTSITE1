$posts = Get-Content -Raw -Encoding UTF8 "scratch/lecrown_posts.json" | ConvertFrom-Json
Write-Host "Total posts count: $($posts.Count)"

for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    Write-Output "--------------------------------------------------"
    Write-Output "POST #$($i+1)"
    Write-Output "Post ID: $($p.postId)"
    Write-Output "Date/Time: $($p.time)"
    Write-Output "URL: $($p.url)"
    Write-Output "Engagement: Likes=$($p.likes), Shares=$($p.shares), TopReactions=$($p.topReactionsCount)"
    Write-Output "Media Count: $($p.media.Count)"
    Write-Output "Text:"
    Write-Output $p.text
    if ($p.media) {
        $ocrList = $p.media | Where-Object { $_.ocrText } | Select-Object -ExpandProperty ocrText
        if ($ocrList) {
            Write-Output "OCR Highlights:"
            $ocrList | Select-Object -First 3 | ForEach-Object { Write-Output "  - $_" }
        }
    }
}
