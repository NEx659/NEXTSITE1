[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataJs = Get-Content 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$startTag = 'var UDON_COMPANIES = '
$sIdx = $dataJs.IndexOf($startTag)
$endTag = "];`r`n`r`nif (typeof window"
if (-not $dataJs.Contains($endTag)) {
    $endTag = "];`n`nif (typeof window"
}
$eIdx = $dataJs.IndexOf($endTag)
$jsonPart = $dataJs.Substring($sIdx + $startTag.Length, $eIdx - ($sIdx + $startTag.Length) + 1).Trim()
$allCompanies = $jsonPart | ConvertFrom-Json

$uName = "รับสร้างบ้านอุดรธานี udonhouse".ToLower().Trim()
$pName = "dreamuphousebuilder".ToLower().Trim()
$pUrl = "dreamuphousebuilder"
$inSlug = "dreamuphousebuilder"

function Clean-Slug($url) {
    if (-not $url) { return '' }
    $u = [string]$url.ToLower().Trim()
    $u = $u -replace '^https?:\/\/(www\.|m\.|mobile\.|web\.)?facebook\.com\/', ''
    if ($u -match 'profile\.php\?id=([0-9]+)') { return "profile.php?id=" + $matches[1] }
    $u = $u -replace '\/posts\/.*$', '' -replace '\/videos\/.*$', '' -replace '\/photos\/.*$', '' -replace '\/reels?\/.*$', ''
    $u = $u -replace '\?.*$', '' -replace '\/$', '' -replace 'people\/[^\/]+\/', ''
    return $u
}

Write-Host "Testing which companies match Dream Up's post:"
foreach ($comp in $allCompanies) {
    $cSlug = Clean-Slug $comp.facebookUrl
    $cName = [string]$comp.name.ToLower()
    $cEng = [string]$comp.engName.ToLower()

    $matched = $false
    $reason = ''

    if ($cSlug -and $pUrl -and ($pUrl -eq $cSlug -or $pUrl.Contains($cSlug) -or $cSlug.Contains($pUrl))) {
        $matched = $true; $reason = "cSlug ($cSlug) matched pUrl ($pUrl)"
    } elseif ($cSlug -and $inSlug -and ($inSlug -eq $cSlug -or $inSlug.Contains($cSlug) -or $cSlug.Contains($inSlug))) {
        $matched = $true; $reason = "cSlug ($cSlug) matched inSlug ($inSlug)"
    } elseif ($pName -and ($cName.Contains($pName) -or $pName.Contains($cName))) {
        $matched = $true; $reason = "pName ($pName) matched cName ($cName)"
    } elseif ($uName -and ($cName.Contains($uName) -or $uName.Contains($cName))) {
        $matched = $true; $reason = "uName ($uName) matched cName ($cName)"
    } elseif ($cEng -and $pName -and ($cEng.Contains($pName) -or $pName.Contains($cEng))) {
        $matched = $true; $reason = "cEng ($cEng) matched pName ($pName)"
    }

    if ($matched) {
        Write-Host "Matched company: $($comp.id) - $($comp.name) | Reason: $reason"
    }
}
