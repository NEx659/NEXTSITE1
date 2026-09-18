$raw = [System.IO.File]::ReadAllText("c:\Users\pannipan\Downloads\N\js\data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $raw -replace '^\s*(var|let|const|window\.)?\s*UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$data = $jsonStr | ConvertFrom-Json
$comp = $data | Where-Object { $_.id -eq 'comp-udon-01' }
Write-Output "Total companies: $($data.Count)"
Write-Output "comp-udon-01 name: $($comp.name)"
Write-Output "comp-udon-01 totalProjects: $($comp.totalProjects)"
Write-Output "comp-udon-01 projects count: $($comp.projects.Count)"
for ($i = 0; $i -lt $comp.projects.Count; $i++) {
    $p = $comp.projects[$i]
    Write-Output "--- Project $($i + 1) ---"
    Write-Output "  ID: $($p.projectId)"
    Write-Output "  Name: $($p.projectName)"
    Write-Output "  Location: $($p.location)"
    Write-Output "  Date: $($p.postDate)"
    Write-Output "  Stage: $($p.stage) ($($p.stageProgress)%)"
    Write-Output "  URL: $($p.postUrl)"
}
