$content = Get-Content -Encoding UTF8 scratch/rungrat_posts.json -Raw
$posts = $content | ConvertFrom-Json
foreach ($idx in @(3, 5, 7)) {
    $p = $posts[$idx]
    Write-Output "=== POST $($idx+1) ==="
    Write-Output ("Date: " + $p.date + " | Time: " + $p.time)
    $lines = $p.text.Split("`n")
    foreach ($line in $lines) {
        if ($line -match "เคสที่|บ้านครอบครัว|เขตงานสร้าง|ตำบล|อำเภอ|จังหวัด|อัปเดต") {
            Write-Output $line
        }
    }
    Write-Output ""
}
