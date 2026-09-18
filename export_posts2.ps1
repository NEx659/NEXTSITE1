$posts = Get-Content -Raw -Encoding UTF8 "scratch/lecrown_posts.json" | ConvertFrom-Json
$lines = [System.Collections.Generic.List[string]]::new()

$lines.Add("# Total Posts: " + $posts.Count)
$lines.Add("")

for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    $lines.Add("==================================================")
    $lines.Add("POST #" + ($i + 1))
    $lines.Add("Post ID: " + $p.postId)
    $lines.Add("Time: " + $p.time)
    $lines.Add("URL: " + $p.url)
    $lines.Add("Likes: " + $p.likes + " | Shares: " + $p.shares + " | TopReactions: " + $p.topReactionsCount)
    $lines.Add("Media Count: " + $p.media.Count)
    $lines.Add("TEXT:")
    $lines.Add($p.text)
    $lines.Add("MEDIA:")
    if ($p.media) {
        foreach ($m in $p.media) {
            if ($m.ocrText) {
                $lines.Add("  [OCR]: " + $m.ocrText)
            }
            if ($m.image -and $m.image.uri) {
                $lines.Add("  [Image]: " + $m.image.uri)
            }
        }
    }
    $lines.Add("")
}

[System.IO.File]::WriteAllLines("scratch/all_10_posts_decoded.txt", $lines, [System.Text.Encoding]::UTF8)
Write-Host "Success"
