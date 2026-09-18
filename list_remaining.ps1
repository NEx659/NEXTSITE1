$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$remaining = $dataList | Where-Object { $_.tag -ne "focus" }
Write-Output "Remaining non-focus companies: $($remaining.Count)"
foreach ($r in $remaining | Select-Object -First 10) {
    Write-Output ($r.id + " | " + $r.name)
}
