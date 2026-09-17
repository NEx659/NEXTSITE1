$appJs = Get-Content 'c:\Users\pannipan\Downloads\N\js\app.js' -Raw -Encoding UTF8
$indexHtml = Get-Content 'c:\Users\pannipan\Downloads\N\index.html' -Raw -Encoding UTF8
$sakonHtml = Get-Content 'c:\Users\pannipan\Downloads\N\NEX SAKON.html' -Raw -Encoding UTF8

$hasWantIndex = $indexHtml.Contains('id="user-cnt-want-followup"')
$hasFollowIndex = $indexHtml.Contains('id="user-cnt-following"')
$hasBtnWant = $indexHtml.Contains('id="user-filter-want-btn"')
$hasBtnFollow = $indexHtml.Contains('id="user-filter-following-btn"')

Write-Host "1. Check HTML elements in index.html:"
Write-Host " - user-cnt-want-followup: $hasWantIndex"
Write-Host " - user-cnt-following: $hasFollowIndex"
Write-Host " - user-filter-want-btn: $hasBtnWant"
Write-Host " - user-filter-following-btn: $hasBtnFollow"

$hasWantSakon = $sakonHtml.Contains('id="user-cnt-want-followup"')
$hasFollowSakon = $sakonHtml.Contains('id="user-cnt-following"')

Write-Host "`n2. Check HTML elements in NEX SAKON.html:"
Write-Host " - user-cnt-want-followup: $hasWantSakon"
Write-Host " - user-cnt-following: $hasFollowSakon"

$hasFnUpdate = $appJs.Contains('function updateUserCrmStatusSummary()')
$hasFnFilter = $appJs.Contains('function filterByUserCrmStatus(statusType)')
$hasUserWant = $appJs.Contains("activeFollowupStatusFilter === 'user-want'")
$hasUserFollowing = $appJs.Contains("activeFollowupStatusFilter === 'user-following'")

Write-Host "`n3. Check functions in js/app.js:"
Write-Host " - updateUserCrmStatusSummary: $hasFnUpdate"
Write-Host " - filterByUserCrmStatus: $hasFnFilter"
Write-Host " - user-want filter: $hasUserWant"
Write-Host " - user-following filter: $hasUserFollowing"
