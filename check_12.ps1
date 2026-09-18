$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$item = $dataList | Where-Object { $_.id -eq "comp-udon-12" }
Write-Output ("ID: " + $item.id + " | Tag: " + $item.tag + " | Projects: " + $item.projects.Count)
