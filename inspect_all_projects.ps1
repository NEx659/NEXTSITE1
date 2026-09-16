$dataPath = "c:\Users\pannipan\Downloads\N\js\data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$comps = $jsonStr | ConvertFrom-Json

$allProjects = @()

foreach ($c in $comps) {
    if (-not $c.projects -or $c.projects.Count -eq 0) { continue }
    foreach ($p in $c.projects) {
        $firstLine = ($p.caption -split "`n")[0]
        if (-not $firstLine) { $firstLine = $p.name }
        
        $allProjects += [PSCustomObject]@{
            CompId = $c.id
            CompName = $c.name
            ProjName = $p.name
            Stage = $p.stageKey
            District = $p.district
            FirstLine = $firstLine.Substring(0, [Math]::Min(60, $firstLine.Length))
            FullCaption = $p.caption
        }
    }
}

Write-Output "Total Projects: $($allProjects.Count)"

$i = 1
foreach ($ap in $allProjects) {
    Write-Output "[$i] $($ap.CompId) | $($ap.CompName)"
    Write-Output "    Proj: $($ap.ProjName) | Stage: $($ap.Stage) | Dist: $($ap.District)"
    Write-Output "    Cap: $($ap.FirstLine)"
    Write-Output ""
    $i++
}
