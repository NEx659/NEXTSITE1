[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataJs = Get-Content -LiteralPath 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$startTag = 'var UDON_COMPANIES = '
$sIdx = $dataJs.IndexOf($startTag)
$endTag = "];`r`n`r`nif (typeof window"
if (-not $dataJs.Contains($endTag)) {
    $endTag = "];`n`nif (typeof window"
}
$eIdx = $dataJs.IndexOf($endTag)
$jsonPart = $dataJs.Substring($sIdx + $startTag.Length, $eIdx - ($sIdx + $startTag.Length) + 1).Trim()
$companies = $jsonPart | ConvertFrom-Json

$totalProjects = 0
$companiesWithProjects = 0

foreach ($c in $companies) {
    $pCnt = if ($c.projects) { $c.projects.Count } else { 0 }
    $totalProjects += $pCnt
    if ($pCnt -gt 0) {
        $companiesWithProjects++
    }
}

Write-Host "=========================================="
Write-Host "VERIFICATION RESULTS:"
Write-Host "Total Companies: $($companies.Count)"
Write-Host "Companies with Projects: $companiesWithProjects"
Write-Host "TOTAL PROJECTS IN DATA.JS: $totalProjects"
Write-Host "=========================================="
