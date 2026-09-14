[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Accept" = "application/json"
}

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?select=id,name,tag,sales_2026&limit=3"
try {
    $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    Write-Host "SUCCESS! Read $($res.Count) rows from Supabase:"
    $res | Format-Table -AutoSize | Out-String | Write-Host
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
