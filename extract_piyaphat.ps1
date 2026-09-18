[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

$m = @($data | Where-Object { 
    $fb = "$($_.facebookUrl) $($_.inputUrl) $($_.url) $($_.pageName) $($_.user.name) $($_.user.id) $($_.text)"
    $fb -match "61579292830014" -or $fb -match "ปิยภัทร" -or $fb -match "083-1616352" -or $fb -match "0997496885"
})

Write-Host "Total matches for Piyaphat125: $($m.Count)"

for ($i = 0; $i -lt $m.Count; $i++) {
    Write-Host "=================================================="
    Write-Host "POST_$($i+1)"
    Write-Host "TIME: $($m[$i].time)"
    Write-Host "URL: $($m[$i].url)"
    Write-Host "PAGE: $($m[$i].pageName) | USER: $($m[$i].user.name)"
    Write-Host "LIKES: $($m[$i].likes) | COMMENTS: $($m[$i].comments) | SHARES: $($m[$i].shares)"
    Write-Host "TEXT:"
    Write-Host $m[$i].text
    Write-Host "=================================================="
    Write-Host ""
}
