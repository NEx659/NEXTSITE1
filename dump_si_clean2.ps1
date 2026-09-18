$raw = Get-Content "c:\Users\pannipan\Downloads\N\scratch\dataset.json" -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

$matches = @($data | Where-Object { 
    $_.facebookUrl -match "siarchitecture" -or $_.inputUrl -match "siarchitecture" -or $_.url -match "siarchitecture"
})

Write-Host "Matches found: $($matches.Length)"

$outList = @()
$i = 1
foreach ($m in $matches) {
    $outList += "=================================================="
    $outList += "โพสต์ที่ $i"
    $outList += "วันที่ / เวลา: $($m.time)"
    $outList += "URL: $($m.url)"
    $outList += "Likes: $($m.likes) | Comments: $($m.comments) | Shares: $($m.shares)"
    $outList += "ข้อความ (Post Text):"
    $outList += "$($m.text)"
    $outList += "=================================================="
    $outList += ""
    $i++
}

$outList | Out-File -FilePath "c:\Users\pannipan\Downloads\N\scratch\si_10posts_clean.txt" -Encoding utf8
Write-Host "Written lines: $($outList.Length)"
