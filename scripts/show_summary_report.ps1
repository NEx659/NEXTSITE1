$dataPath = "c:\Users\pannipan\Downloads\N\js\data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)

$companies = $jsonStr | ConvertFrom-Json

$results = @()
$totalProj = 0

foreach ($c in $companies) {
    $count = if ($c.projects) { $c.projects.Count } else { 0 }
    $totalProj += $count
    $locs = if ($c.projects) { ($c.projects | Select-Object -ExpandProperty district -Unique) -join ", " } else { "-" }
    
    $results += [PSCustomObject]@{
        ID = $c.id
        Name = $c.name
        ProjectsCount = $count
        Districts = $locs
    }
}

$results | Format-Table -AutoSize | Out-String | Write-Output
Write-Output "TOTAL ACTIVE UDON THANI PROJECTS ACROSS ALL COMPANIES: $totalProj"
