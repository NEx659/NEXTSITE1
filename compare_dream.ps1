[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$f286 = "C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json"
$content286 = Get-Content $f286 -Raw -Encoding UTF8 | ConvertFrom-Json
$items286 = if ($content286 -is [array]) { $content286 } else { $content286.items }
Write-Host "File 286 items count: $($items286.Count)"

$f522 = "C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json"
$content522 = Get-Content $f522 -Raw -Encoding UTF8 | ConvertFrom-Json
$items522 = if ($content522 -is [array]) { $content522 } else { $content522.items }
Write-Host "File 522 items count: $($items522.Count)"

Write-Host "--- Dream Up in File 286 ---"
$d286 = $items286 | Where-Object { 
    $u = [string]$_.user.name; $p = [string]$_.pageName; $inp = [string]$_.inputUrl; $fb = [string]$_.facebookUrl; $t = [string]$_.text
    $t -match 'DREAM UP' -or $u -match 'Udonhouse' -or $p -match 'Dreamuphousebuilder' -or $inp -match 'Dreamuphousebuilder' -or $fb -match 'Dreamuphousebuilder'
}
Write-Host "Total Dream Up in File 286: $($d286.Count)"
foreach ($d in $d286) {
    Write-Host "[$($d.url)] $(($d.text -split '\r?\n')[0]) | $(($d.text -split '\r?\n')[1])"
}

Write-Host "--- Dream Up in File 522 ---"
$d522 = $items522 | Where-Object { 
    $u = [string]$_.user.name; $p = [string]$_.pageName; $inp = [string]$_.inputUrl; $fb = [string]$_.facebookUrl; $t = [string]$_.text
    $t -match 'DREAM UP' -or $u -match 'Udonhouse' -or $p -match 'Dreamuphousebuilder' -or $inp -match 'Dreamuphousebuilder' -or $fb -match 'Dreamuphousebuilder'
}
Write-Host "Total Dream Up in File 522: $($d522.Count)"
foreach ($d in $d522) {
    Write-Host "[$($d.url)] $(($d.text -split '\r?\n')[0]) | $(($d.text -split '\r?\n')[1])"
}
