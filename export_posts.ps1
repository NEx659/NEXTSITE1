[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$posts = Get-Content -Raw -Encoding UTF8 "scratch/lecrown_posts.json" | ConvertFrom-Json

$out = @()
$out += "# รายการโพสต์ทั้งหมดของ บริษัท เลอ คราวน์ ดีไซน์ จำกัด (10 โพสต์)`n"

for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    $out += "## โพสต์ที่ $($i+1): Post ID $($p.postId)"
    $out += "- **วันที่/เวลา:** $($p.time)"
    $out += "- **URL:** $($p.url)"
    $out += "- **Engagement:** ถูกใจ $($p.likes) | แชร์ $($p.shares) | Reactions $($p.topReactionsCount)"
    $out += "- **จำนวนรูปภาพ/สื่อ:** $($p.media.Count) รูป"
    $out += "- **ข้อความโพสต์:**`n```text"
    $out += $p.text
    $out += "```"
    if ($p.media) {
        $out += "- **OCR / คำบรรยายภาพ:**"
        foreach ($m in $p.media) {
            if ($m.ocrText) {
                $out += "  - $($m.ocrText)"
            }
        }
    }
    $out += "`n---`n"
}

$out | Out-File -FilePath "scratch/all_10_posts_decoded.md" -Encoding UTF8
Write-Host "Done writing scratch/all_10_posts_decoded.md"
