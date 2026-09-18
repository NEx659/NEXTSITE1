$dataset = Get-Content -Raw -Encoding UTF8 "scratch/dataset.json" | ConvertFrom-Json
Write-Host "Total dataset posts: $($dataset.Count)"

$ttPosts = @($dataset | Where-Object { 
    $_.facebookUrl -like "*100057515256596*" -or 
    $_.topLevelUrl -like "*100057515256596*" -or
    $_.user.id -eq "100057515256596" -or
    $_.user.name -like "*ทีที*"
})

Write-Host "Found TT Design posts: $($ttPosts.Count)"

$outLines = [System.Collections.Generic.List[string]]::new()
$outLines.Add("# TT Design & Construction Posts Count: " + $ttPosts.Count)
$outLines.Add("")

$pCount = [Math]::Min($ttPosts.Count, 15)
for ($i = 0; $i -lt $pCount; $i++) {
    $p = $ttPosts[$i]
    $outLines.Add("==================================================")
    $outLines.Add("POST #" + ($i + 1))
    $outLines.Add("Post ID: " + $p.postId)
    $outLines.Add("Time: " + $p.time)
    $outLines.Add("URL: " + $p.url)
    $outLines.Add("Likes: " + $p.likes + " | Shares: " + $p.shares + " | Reactions: " + $p.topReactionsCount)
    $outLines.Add("Media Count: " + $p.media.Count)
    $outLines.Add("TEXT:")
    $outLines.Add($p.text)
    if ($p.media) {
        $ocrList = $p.media | Where-Object { $_.ocrText } | Select-Object -ExpandProperty ocrText
        if ($ocrList) {
            $outLines.Add("OCR Highlights:")
            foreach ($o in $ocrList) {
                $outLines.Add("  - " + $o)
            }
        }
    }
    $outLines.Add("")
}

[System.IO.File]::WriteAllLines("scratch/tt_posts_decoded.txt", $outLines, [System.Text.Encoding]::UTF8)
Write-Host "Wrote scratch/tt_posts_decoded.txt"
