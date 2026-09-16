$dataContent = Get-Content -Path "c:\Users\pannipan\Downloads\N\js\data.js" -Raw -Encoding UTF8
$htmlContent = Get-Content -Path "c:\Users\pannipan\Downloads\N\index.html" -Raw -Encoding UTF8

$injection = @"
    <!-- Embedded Full 64 Projects Master Dataset -->
    <script>
$dataContent
    </script>
    <!-- App JS modules -->
    <script src="js/scoring.js"></script>
    <script src="js/charts.js"></script>
    <script src="js/map.js"></script>
    <script src="js/app.js"></script>
"@

# Replace the script block
$targetPattern = '(?s)(<!-- Embedded Full 64 Projects Master Dataset -->|<!-- App JS modules -->).*?<script src="js/app\.js"></script>'
$newHtml = [regex]::Replace($htmlContent, $targetPattern, $injection)

Set-Content -Path "c:\Users\pannipan\Downloads\N\index.html" -Value $newHtml -Encoding UTF8
Set-Content -Path "c:\Users\pannipan\Downloads\N\NEX SAKON.html" -Value $newHtml -Encoding UTF8

Write-Host "✅ Successfully embedded full 64 projects database directly inside index.html and NEX SAKON.html!"
