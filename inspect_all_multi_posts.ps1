[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Run pipeline functions
. 'scripts/find_duplicate_projects.ps1'

$byPage = $valid | Group-Object -Property pageName
foreach ($bp in $byPage) {
    if ($bp.Count -gt 1) {
        Write-Host ''
        Write-Host ('==================================================')
        Write-Host ('Page: ' + $bp.Name + ' (Total valid posts: ' + $bp.Count + ')')
        Write-Host ('==================================================')
        foreach ($p in $bp.Group) {
            $snip = ($p.text -replace '\s+', ' ')
            if ($snip.Length -gt 110) { $snip = $snip.Substring(0, 110) + '...' }
            Write-Host ('  - [' + $p.time + '] ' + $snip)
        }
    }
}
