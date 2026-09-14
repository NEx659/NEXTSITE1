[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

$updatePayload = @{
    scg_customer_id = "10482913"
    sales_2025 = 1570146.44
    sales_2026 = 3396188.25
} | ConvertTo-Json

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.comp-udon-10"
try {
    Invoke-RestMethod -Uri $url -Method Patch -Headers $headers -Body $updatePayload
    Write-Host "SUCCESS: Updated comp-udon-10 in Supabase with TT Design sales data!"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
