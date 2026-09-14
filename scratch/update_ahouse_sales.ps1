[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

$updatePayload = @{
    scg_customer_id = "10051168"
    sales_2025 = 15209
    sales_2026 = 22100
} | ConvertTo-Json

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.comp-udon-42"
try {
    Invoke-RestMethod -Uri $url -Method Patch -Headers $headers -Body $updatePayload
    Write-Host "SUCCESS: Updated comp-udon-42 in Supabase with sales data!"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
