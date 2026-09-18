$raw = Get-Content 'scratch/esarnthaihouse_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$ehouse = @($raw | Where-Object { $_.pageName -eq 'esarnthaihouse' })
Set-Content -Path 'scratch/ehouse_filtered.json' -Value ($ehouse | ConvertTo-Json -Depth 5) -Encoding UTF8
Write-Output "Count: $($ehouse.Count)"
