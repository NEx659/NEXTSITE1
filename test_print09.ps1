[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataJs = Get-Content 'js\data.js' -Raw -Encoding UTF8
$clean = $dataJs -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$arr = $clean | ConvertFrom-Json
$c09 = $arr | Where-Object { $_.id -eq 'comp-udon-09' }
Write-Output "NASIT HOME Total Projects: $($c09.projects.Count)"
foreach ($p in $c09.projects) {
    Write-Output "- [$($p.projectId)] $($p.siteKey)"
    Write-Output "  Name: $($p.name)"
    Write-Output "  Stage: $($p.stage) ($($p.stageKey) - $($p.progressPercent)%)"
    Write-Output "  URL: $($p.postUrl)"
}
