 = Get-Content 'js/data.js' -Raw -Encoding UTF8
 =  -replace '^[\s\S]*?window\.CONTRACTORS_DATA\s*=\s*', '' -replace ';\s*$', ''
 =  | ConvertFrom-Json
 =  | Where-Object { .id -eq 'comp-udon-11' }
Write-Output  Company: 
Write-Output  Total Projects: 0 
foreach ( in .projects) {
    Write-Output  - [] 
}
