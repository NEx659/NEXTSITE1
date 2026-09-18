$content = Get-Content 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$data = $jsonStr | ConvertFrom-Json

$suksakon = $data | Where-Object { $_.id -eq 'comp-udon-09' }
if ($suksakon) {
    Write-Output ("Name: " + $suksakon.name)
    Write-Output ("Total Projects: " + $suksakon.projects.Count)
    Write-Output ("Opportunity Score: " + $suksakon.opportunityScore)
    Write-Output ("customDiagnostic: " + $suksakon.customDiagnostic)
    Write-Output ("customRecommendations count: " + $suksakon.customRecommendations.Count)
    $i = 1
    foreach ($p in $suksakon.projects) {
        Write-Output ("  Project " + $i + ": " + $p.name + " | Stage: " + $p.stage + " | Time: " + $p.postedTime)
        $i++
    }
} else {
    Write-Output "Suksakon NOT found!"
}
