[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Accept" = "application/json"
}

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?select=*&limit=1"
try {
    $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    $res[0].PSObject.Properties | ForEach-Object {
        Write-Host "$($_.Name) = $($_.Value)"
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
