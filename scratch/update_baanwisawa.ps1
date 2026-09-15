[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

$payloadBytes = [System.IO.File]::ReadAllBytes("$PSScriptRoot\baanwisawa_payload.json")
$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.comp-udon-27"

try {
    $res = Invoke-RestMethod -Uri $url -Method Patch -Headers $headers -Body $payloadBytes
    Write-Host "SUPABASE UPDATE SUCCESS: Comp-udon-27 updated!"
} catch {
    Write-Host "Supabase Update Error: $($_.Exception.Message)"
}
