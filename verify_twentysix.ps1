$content = Get-Content 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$data = $jsonStr | ConvertFrom-Json
Write-Output ("Total companies in data.js: " + $data.Count)

$twentysix = $data | Where-Object { $_.id -eq 'comp-udon-08' }
if ($twentysix) {
    Write-Output ("Twentysix Name: " + $twentysix.name)
    Write-Output ("Total Projects: " + $twentysix.projects.Count)
    Write-Output ("Opportunity Score: " + $twentysix.opportunityScore)
    Write-Output ("customDiagnostic: " + $twentysix.customDiagnostic)
    Write-Output ("customRecommendations count: " + $twentysix.customRecommendations.Count)
    $i = 1
    foreach ($p in $twentysix.projects) {
        Write-Output ("  Project " + $i + ": " + $p.name + " | Stage: " + $p.stage + " | Time: " + $p.postedTime)
        $i++
    }
} else {
    Write-Output "Twentysix NOT found!"
}
