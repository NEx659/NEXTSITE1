$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

$matches = @($data | Where-Object { 
    $_.facebookUrl -match 'siarchitecture' -or 
    $_.inputUrl -match 'siarchitecture' -or 
    $_.pageName -match 'เอสไอ' -or
    $_.postUrl -match 'siarchitecture' -or
    $_.url -match 'siarchitecture' -or
    $_.user -match 'siarchitecture'
})

Write-Output "Found matches: $($matches.Count)"
if ($matches.Count -gt 0) {
    $matches | ConvertTo-Json -Depth 5 | Set-Content -Path 'scratch/si_posts.json' -Encoding UTF8
    Write-Output "Exported to scratch/si_posts.json"
}
