[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{ "apikey" = $key; "Authorization" = "Bearer $key" }
$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.comp-udon-27&select=*"
try {
    $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    $res | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
