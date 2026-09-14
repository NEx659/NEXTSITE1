[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Accept" = "application/json"
}

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.comp-udon-08&select=id,name,crm_note,crm_status,crm_sales_rep,crm_next_date"
try {
    $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    Write-Host "RESULT FOR comp-udon-08:"
    $res | ForEach-Object {
        Write-Host "ID: $($_.id)"
        Write-Host "crm_note: $($_.crm_note)"
        Write-Host "crm_status: $($_.crm_status)"
        Write-Host "crm_sales_rep: $($_.crm_sales_rep)"
        Write-Host "crm_next_date: $($_.crm_next_date)"
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
