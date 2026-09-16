$r1 = Invoke-WebRequest -Uri 'https://pannipanachai2-design.github.io/NEXTSITE-AI/' -UseBasicParsing
Write-Host "Index HTML status: " $r1.StatusCode
Write-Host "Contains data.js tag: " ($r1.Content.Contains('<script src="data.js"></script>'))
Write-Host "Contains js/data.js tag: " ($r1.Content.Contains('<script src="js/data.js"></script>'))

$r2 = Invoke-WebRequest -Uri 'https://pannipanachai2-design.github.io/NEXTSITE-AI/data.js' -UseBasicParsing
$compMatches = [regex]::Matches($r2.Content, '"id":\s*"comp-')
$projMatches = [regex]::Matches($r2.Content, '"projectId":\s*"proj-')

Write-Host "================================"
Write-Host "Live data.js Total Companies: " $compMatches.Count
Write-Host "Live data.js Total Projects:  " $projMatches.Count
Write-Host "================================"
