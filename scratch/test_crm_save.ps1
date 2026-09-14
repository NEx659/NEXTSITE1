[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

$crmData = @{
    status = "visited"
    note = "Visited manager, offered SCG cement"
    nextDate = "2026-09-20"
    salesRep = "SCG Sales Team"
    products = @("Cement", "Concrete")
    updatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
}

$updatePayload = @{
    crm_note = "Test CRM Note for comp-udon-08"
    crm_status = "visited"
    crm_sales_rep = "SCG Sales Team"
    crm_next_date = "2026-09-20"
} | ConvertTo-Json

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.comp-udon-08"

try {
    $res = Invoke-RestMethod -Uri $url -Method Patch -Headers $headers -Body $updatePayload
    Write-Host "SUCCESS: Updated CRM note in Supabase!"
    Write-Host "Stored data: crm_note=$($res.crm_note), crm_status=$($res.crm_status)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
