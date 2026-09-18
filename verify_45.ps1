$testHtml = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verify comp-45</title>
</head>
<body>
    <div id="res"></div>
    <script src="../js/data.js"></script>
    <script>
        const c = UDON_COMPANIES.find(x => x.id === 'comp-udon-45');
        document.getElementById('res').innerText = JSON.stringify({
            id: c.id,
            name: c.name,
            totalProjects: c.totalProjects,
            projectsLength: c.projects.length,
            aiShortRec: c.aiShortRec
        }, null, 2);
    </script>
</body>
</html>
"@

Set-Content -Path 'c:\Users\pannipan\Downloads\N\scratch\test_45.html' -Value $testHtml -Encoding UTF8

$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }
$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/test_45.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_45_out.html'
Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=1500', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$html = Get-Content $tempOut -Raw -Encoding UTF8
if ($html -match '<div id="res">([\s\S]*?)</div>') {
    Write-Output $matches[1]
} else {
    Write-Output "Failed to find result."
}
