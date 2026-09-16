[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$files = Get-ChildItem "C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_*.json"
foreach ($f in $files) {
    Write-Host "========================================="
    Write-Host "File: $($f.Name)"
    $content = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    $items = if ($content -is [array]) { $content } else { $content.items }
    Write-Host "Total items: $($items.Count)"
    
    $dream = $items | Where-Object { 
        $u = [string]$_.user.name
        $p = [string]$_.pageName
        $inp = [string]$_.inputUrl
        $fb = [string]$_.facebookUrl
        $t = [string]$_.text
        $t -match 'DREAM UP' -or $u -match 'Udonhouse' -or $p -match 'Dreamuphousebuilder' -or $inp -match 'Dreamuphousebuilder' -or $fb -match 'Dreamuphousebuilder'
    }
    
    Write-Host "Dream Up posts count: $($dream.Count)"
    $idx = 1
    foreach ($d in $dream) {
        $lines = $d.text -split "\r?\n"
        Write-Host "  [$idx] $($d.url) | $($lines[0]) | $($lines[1])"
        $idx++
    }
}
