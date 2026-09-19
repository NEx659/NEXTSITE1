$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$data = $jsonStr | ConvertFrom-Json

Write-Host "Total companies: " $data.Count
$s = ($data | Where-Object { $_.tag -eq "strategic" }).Count
$g = ($data | Where-Object { $_.tag -eq "growth" }).Count
$o = ($data | Where-Object { $_.tag -eq "opportunity" }).Count
$p = ($data | Where-Object { $_.tag -eq "prospect" }).Count

Write-Host "Strategic: $s | Growth: $g | Opportunity: $o | Prospect: $p"
