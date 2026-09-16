$dataPath = "c:\Users\pannipan\Downloads\N\js\data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$comps = $jsonStr | ConvertFrom-Json

foreach ($c in ($comps | Where-Object { $_.id -in @('comp-udon-02', 'comp-udon-03', 'comp-udon-05', 'comp-udon-06', 'comp-udon-10', 'comp-udon-13', 'comp-udon-16', 'comp-udon-17', 'comp-udon-18') })) {
    Write-Output "=================================================="
    Write-Output "COMPANY: $($c.id) | $($c.name)"
    foreach ($p in $c.projects) {
        Write-Output "----------------------------------------"
        Write-Output "PROJECT: $($p.name) | Stage: $($p.stageKey) | District: $($p.district)"
        Write-Output "CAPTION:"
        Write-Output $p.caption
    }
}
