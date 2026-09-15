[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

$payload = @{
    name = "บริษัท บ้านวิศวะพัฒนา จำกัด"
    english_name = "Baanwisawa Pattana Co., Ltd."
    sales_2025 = 0
    sales_2026 = 238997
} | ConvertTo-Json

$bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.comp-udon-27"

try {
    $res = Invoke-RestMethod -Uri $url -Method Patch -Headers $headers -Body $bytes
    Write-Host "SUPABASE UPDATE SUCCESS:" ($res | ConvertTo-Json)
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
