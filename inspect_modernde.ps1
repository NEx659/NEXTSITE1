$dataPath = "c:\Users\pannipan\Downloads\N\js\data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$comps = $jsonStr | ConvertFrom-Json

$c4 = $comps | Where-Object { $_.id -eq 'comp-udon-04' }

Write-Output "=== COMPANY: $($c4.name) ==="
Write-Output "Projects count: $($c4.projects.Count)"

$i = 1
foreach ($p in $c4.projects) {
    Write-Output "------------------------------------------"
    Write-Output "[$i] $($p.name)"
    Write-Output "Stage: $($p.stage) ($($p.stageKey))"
    Write-Output "District: $($p.district)"
    Write-Output "Caption: $($p.caption)"
    Write-Output "Image: $($p.imageUrl)"
    Write-Output "Link: $($p.facebookPostUrl)"
    $i++
}
