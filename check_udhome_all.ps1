[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Check comp-udon-11 in bake_out.html, ct_data.json, data.js, udhome_posts.json
Write-Output "=== 1. Checking udhome_posts.json ==="
if (Test-Path "scratch/udhome_posts.json") {
    $udPosts = Get-Content "scratch/udhome_posts.json" -Raw -Encoding UTF8 | ConvertFrom-Json
    Write-Output "udhome_posts.json count: $($udPosts.Count)"
    $i = 1
    foreach ($p in $udPosts) {
        Write-Output "[$i] Date: $($p.time) | URL: $($p.url)"
        $snippet = if ($p.text) { $p.text.Substring(0, [Math]::Min(120, $p.text.Length)) -replace "`n", " " } else { "" }
        Write-Output "    $snippet"
        $i++
    }
}

Write-Output "`n=== 2. Checking comp-udon-11 in js/data.js ==="
$c = [System.IO.File]::ReadAllText("js/data.js", [System.Text.Encoding]::UTF8)
$clean = $c -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$arr = $clean | ConvertFrom-Json
$u = $arr | Where-Object { $_.id -eq 'comp-udon-11' }
Write-Output "In data.js: $($u.name) | Projects count: $($u.projects.Count)"
if ($u.projects.Count -gt 0) {
    $u.projects | ForEach-Object { Write-Output " - $($_.name) [$($_.stageKey)]" }
}

Write-Output "`n=== 3. Checking comp-udon-11 in ct_data.json ==="
if (Test-Path "scratch/ct_data.json") {
    $ctArr = Get-Content "scratch/ct_data.json" -Raw -Encoding UTF8 | ConvertFrom-Json
    $ct11 = $ctArr | Where-Object { $_.id -eq 'comp-udon-11' }
    if ($ct11) {
        Write-Output "In ct_data.json: $($ct11.name) | Projects: $($ct11.projects.Count)"
    }
}
