$dataPath = "c:\Users\pannipan\Downloads\N\js\data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$comps = $jsonStr | ConvertFrom-Json

foreach ($c in $comps) {
    if (-not $c.projects -or $c.projects.Count -eq 0) { continue }
    Write-Output "=================================================="
    Write-Output "COMPANY: $($c.id) | $($c.name)"
    foreach ($p in $c.projects) {
        Write-Output "----------------------------------------"
        Write-Output "PROJECT: $($p.name) | Stage: $($p.stageKey) | District: $($p.district)"
        Write-Output "CAPTION:"
        Write-Output $p.caption
    }
}
