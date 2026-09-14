[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
}

$ids = @("comp-udon-30", "comp-udon-38")

foreach ($cid in $ids) {
    $url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.$cid"
    try {
        Invoke-RestMethod -Uri $url -Method Delete -Headers $headers
        Write-Host "DELETED from Supabase: $cid"
    } catch {
        Write-Host "ERROR deleting $cid : $($_.Exception.Message)"
    }
}
