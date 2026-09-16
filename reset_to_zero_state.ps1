[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataJs = Get-Content -LiteralPath 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$startTag = 'var UDON_COMPANIES = '
$sIdx = $dataJs.IndexOf($startTag)
$endTag = "];`r`n`r`nif (typeof window"
if (-not $dataJs.Contains($endTag)) {
    $endTag = "];`n`nif (typeof window"
}
$eIdx = $dataJs.IndexOf($endTag)
$jsonPart = $dataJs.Substring($sIdx + $startTag.Length, $eIdx - ($sIdx + $startTag.Length) + 1).Trim()
$companies = $jsonPart | ConvertFrom-Json

Write-Host "Resetting all $($companies.Count) companies to Clean 0 state..."

foreach ($c in $companies) {
    $c.projects = @()
    $c.totalProjects = 0
    $c.newProjectsThisMonth = 0
    $c.totalValueMillion = 0.0
    $c.revenuePotentialText = "฿0.0M - ฿0.0M"
    $c.opportunityScore = 15
    $c.stageBreakdown = [pscustomobject]@{
        groundbreak = 0
        foundation = 0
        structure = 0
        finishing = 0
    }
    $c.facebookSignal = [pscustomobject]@{
        postDate = "-"
        pageName = $c.name
        caption = "รอรับข้อมูลจาก Apify Facebook Posts Scraper"
        likes = 0
        comments = 0
        shares = 0
        detectedKeywords = @()
    }
    $c.aiShortRec = "รอสแกน Apify (0 โครงการ)"
    $c.aiRecommendation = "รอรับข้อมูลไซต์งานก่อสร้างจริงจากไฟล์ Apify JSON"
}

$newJson = $companies | ConvertTo-Json -Depth 10
$newContent = "var UDON_COMPANIES = $newJson;`r`n`r`nif (typeof window !== 'undefined') {`r`n  window.UDON_COMPANIES = UDON_COMPANIES;`r`n}`r`n"

[System.IO.File]::WriteAllText('c:\Users\pannipan\Downloads\N\js\data.js', $newContent, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText('c:\Users\pannipan\Downloads\N\js\baseline_1_data.js', $newContent, [System.Text.Encoding]::UTF8)

Write-Host "SUCCESS: Reset js/data.js and js/baseline_1_data.js to 0 projects."
