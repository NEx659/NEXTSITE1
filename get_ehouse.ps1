$raw = Get-Content -Path 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw | ConvertFrom-Json
$comp = $raw.companies | Where-Object { $_.name -like '*อีเฮาส์*' -or $_.id -eq 'comp-udon-17' -or $_.facebook_url -like '*esarnthaihouse*' }
Write-Output "Found company: $($comp.name) ($($comp.id))"
$i = 1
foreach ($p in $comp.posts) {
    $t = ($p.text -replace '\s+', ' ')
    if ($t.Length -gt 100) { $t = $t.Substring(0, 100) }
    Write-Output "[$i] URL: $($p.url)"
    Write-Output "    Text: $t"
    $i++
}
