$dataset = Get-Content -Encoding UTF8 -Path "scratch/dataset.json" | ConvertFrom-Json
$uniquePages = $dataset | Select-Object -ExpandProperty pageName -Unique
Write-Output ("Total unique page names in dataset: " + $uniquePages.Count)
$uniquePages | Where-Object { $_ -like "*พีเอ*" -or $_ -like "*PA*" -or $_ -like "*PATN*" }
