[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Accept" = "application/json"
}

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?select=id,rank,name"
$res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
foreach ($r in $res) {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    Write-Host "ID: $($r.id) | Rank: $($r.rank) | Name: $($r.name)"
}
