$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

$m = @($data | Where-Object { $_.facebookUrl -match 'siarchitecture' -or $_.inputUrl -match 'siarchitecture' -or $_.url -match 'siarchitecture' })
Write-Output "Matches: $($m.Count)"

$lines = @()
for ($i = 0; $i -lt $m.Count; $i++) {
    $lines += "=================================================="
    $lines += "โพสต์ที่ $($i+1)"
    $lines += "วันที่ / เวลา: $($m[$i].time)"
    $lines += "URL: $($m[$i].url)"
    $lines += "Likes: $($m[$i].likes) | Comments: $($m[$i].comments) | Shares: $($m[$i].shares)"
    $lines += "ข้อความ:"
    $lines += "$($m[$i].text)"
    $lines += "=================================================="
    $lines += ""
}

Set-Content -Path 'c:\Users\pannipan\Downloads\N\scratch\si_10posts_all.txt' -Value $lines -Encoding UTF8
Write-Output "Saved to c:\Users\pannipan\Downloads\N\scratch\si_10posts_all.txt"
