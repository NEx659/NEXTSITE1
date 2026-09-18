$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

$m = @($data | Where-Object { $_.facebookUrl -match 'siarchitecture' -or $_.inputUrl -match 'siarchitecture' -or $_.url -match 'siarchitecture' })
Write-Output "Matches: $($m.Count)"

$lines = [System.Collections.Generic.List[string]]::new()
for ($i = 0; $i -lt $m.Count; $i++) {
    $lines.Add("==================================================")
    $lines.Add("โพสต์ที่ $($i+1)")
    $lines.Add("วันที่ / เวลา: $($m[$i].time)")
    $lines.Add("URL: $($m[$i].url)")
    $lines.Add("Likes: $($m[$i].likes) | Comments: $($m[$i].comments) | Shares: $($m[$i].shares)")
    $lines.Add("ข้อความ:")
    $lines.Add("$($m[$i].text)")
    $lines.Add("==================================================")
    $lines.Add("")
}

[System.IO.File]::WriteAllLines('c:\Users\pannipan\Downloads\N\scratch\si_10posts_final.txt', $lines, [System.Text.Encoding]::UTF8)
Write-Output "Saved to si_10posts_final.txt"
