[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Prefer" = "return=representation"
}

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=in.(comp-udon-30,comp-udon-38)"
try {
    $res = Invoke-RestMethod -Uri $url -Method Delete -Headers $headers
    Write-Host "DELETED ROWS: $($res.Count)"
    $res | ForEach-Object { Write-Host "Deleted ID: $($_.id)" }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
