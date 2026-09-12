$content = Get-Content -Path 'js/data.js' -Raw -Encoding UTF8
$jsonStr = $content -replace '^var UDON_COMPANIES =\s*', '' -replace ';\s*$', ''
$companies = $jsonStr | ConvertFrom-Json

foreach ($c in $companies) {
    $c.totalProjects = 0
    $c.newProjectsThisMonth = 0
    $c.totalValueMillion = 0.0
    $c.revenuePotentialText = "฿0.0M - ฿0.0M"
    $c.latestTimelineStage = "groundbreak"
    $c.stageBreakdown = [PSCustomObject]@{
        groundbreak = 0
        foundation = 0
        structure = 0
        finishing = 0
    }
    $c.projects = @()
    $c.salesActionPlan = @()
    $c.aiShortRec = "รอสแกน Apify"
    $c.aiRecommendation = "รอรับข้อมูลไซต์งานก่อสร้างจริงจาก Apify Facebook Posts JSON"
    if ($c.facebookSignal) {
        $c.facebookSignal.postDate = "รอสแกน Apify"
        $c.facebookSignal.caption = "รอรับข้อมูลจาก Apify Facebook Posts Scraper"
        $c.facebookSignal.likes = 0
        $c.facebookSignal.comments = 0
        $c.facebookSignal.shares = 0
        $c.facebookSignal.detectedKeywords = @()
    }
}

$newJson = $companies | ConvertTo-Json -Depth 10
$finalContent = "// NEXTSITE AI - VERIFIED UDON THANI CONTRACTORS MASTER DATASET (54 COMPANIES)" + [Environment]::NewLine + "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText((Resolve-Path 'js/data.js').Path, $finalContent, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText((Resolve-Path 'js/baseline_1_data.js').Path, $finalContent, [System.Text.Encoding]::UTF8)

Write-Host "Successfully reset all $($companies.Count) Udon Thani companies to Clean Zero (0 projects, 0 new this month)."
