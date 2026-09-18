$content = Get-Content 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$data = $jsonStr | ConvertFrom-Json

$nayoo = $data | Where-Object { $_.id -eq 'comp-udon-03' }
if ($nayoo) {
    Write-Output ("Name: " + $nayoo.name)
    Write-Output ("Total Projects: " + $nayoo.projects.Count)
    Write-Output ("Opportunity Score: " + $nayoo.opportunityScore)
    Write-Output ("customDiagnostic: " + $nayoo.customDiagnostic)
    Write-Output ("customRecommendations count: " + $nayoo.customRecommendations.Count)
    $i = 1
    foreach ($p in $nayoo.projects) {
        Write-Output ("  Project " + $i + ": " + $p.name + " | Stage: " + $p.stage + " | Time: " + $p.postedTime)
        $i++
    }
} else {
    Write-Output "Nayoo House NOT found!"
}
