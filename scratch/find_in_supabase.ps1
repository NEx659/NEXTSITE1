[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Accept" = "application/json"
}

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?select=id,name,rank"
try {
    $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    Write-Host "Found $($res.Count) rows in Supabase."
    foreach ($r in $res) {
        if ($r.name -like "*เปเป้*" -or $r.name -like "*Pepe*" -or $r.name -like "*บ้านทุ่ง*" -or $r.name -like "*ณัชชา*") {
            Write-Host "MATCH FOUND IN SUPABASE -> ID: $($r.id) | Rank: $($r.rank) | Name: $($r.name)"
        }
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
