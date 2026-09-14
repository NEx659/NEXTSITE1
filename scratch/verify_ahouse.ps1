[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Accept" = "application/json"
}

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.comp-udon-42&select=id,name,scg_customer_id,sales_2025,sales_2026"
try {
    $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    $res | ForEach-Object {
        Write-Host "ID: $($_.id) | Name: $($_.name) | SCG Code: $($_.scg_customer_id) | 2025: $($_.sales_2025) | 2026: $($_.sales_2026)"
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
