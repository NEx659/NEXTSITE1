[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json
$m = @($data | Where-Object { $_.facebookUrl -match 'siarchitecture' -or $_.inputUrl -match 'siarchitecture' -or $_.url -match 'siarchitecture' })

for ($i = 0; $i -lt $m.Count; $i++) {
    Write-Host "=================================================="
    Write-Host "POST_$($i+1)"
    Write-Host "TIME: $($m[$i].time)"
    Write-Host "URL: $($m[$i].url)"
    Write-Host "LIKES: $($m[$i].likes) | COMMENTS: $($m[$i].comments) | SHARES: $($m[$i].shares)"
    Write-Host "TEXT:"
    Write-Host $m[$i].text
    Write-Host "=================================================="
    Write-Host ""
}
