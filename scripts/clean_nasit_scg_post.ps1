$dataPath = "c:\Users\pannipan\Downloads\N\js\data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$prefix = $raw.Substring(0, $firstBracket)
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$suffix = $raw.Substring($lastBracket + 1)

$companies = $jsonStr | ConvertFrom-Json

foreach ($c in $companies) {
    if ($c.id -eq 'comp-udon-09') {
        # Keep only the 2 authentic construction job sites (กุมภวาปี and บ้านคุณหมู อ.เมือง)
        $c.projects = @($c.projects | Where-Object { $_.name -notlike '*ศรีธาตุ*' -and $_.caption -notlike '*ศรีธาตุ*' })
        $c.totalProjects = $c.projects.Count
        $c.newProjectsThisMonth = $c.projects.Count
        $c.totalValueMillion = [Math]::Round($c.projects.Count * 5.5, 1)
        
        $c.stageBreakdown = [PSCustomObject]@{
            groundbreak = 0
            foundation = 0
            structure = 0
            finishing = $c.projects.Count
        }
        $c.aiShortRec = "พบ $($c.projects.Count) ไซต์งานก่อสร้างจริงใน จ.อุดรธานี (อ.กุมภวาปี 500 ตร.ม. และบ้านคุณหมู อ.เมือง)"
    }
}

$newJson = $companies | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", ($prefix + $newJson + $suffix), [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\baseline_1_data.js", ($prefix + $newJson + $suffix), [System.Text.Encoding]::UTF8)

Write-Output "Successfully cleaned comp-udon-09!"
