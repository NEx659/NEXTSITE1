$testHtml = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test A-House Verification</title>
</head>
<body>
    <div id="output"></div>
    <script src="../js/data.js"></script>
    <script>
        const c = UDON_COMPANIES.find(x => x.id === 'comp-udon-40');
        const res = {
            id: c.id,
            name: c.name,
            totalProjects: c.totalProjects,
            totalValueMillion: c.totalValueMillion,
            projectsCount: c.projects.length,
            projects: c.projects.map(p => ({
                id: p.projectId,
                name: p.name,
                stageKey: p.stageKey,
                stage: p.stage,
                location: p.location,
                postUrl: p.postUrl
            }))
        };
        document.getElementById('output').innerText = JSON.stringify(res, null, 2);
    </script>
</body>
</html>
"@

Set-Content -Path 'c:\Users\pannipan\Downloads\N\scratch\test_ahouse.html' -Value $testHtml -Encoding UTF8

$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }
$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/test_ahouse.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_ahouse_out.html'
Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=2000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$html = Get-Content $tempOut -Raw -Encoding UTF8
if ($html -match '<div id="output">([\s\S]*?)</div>') {
    Write-Output $matches[1]
} else {
    Write-Output "Verification failed or output not found."
}
