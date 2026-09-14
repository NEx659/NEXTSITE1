[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?on_conflict=id"
$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"

$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Content-Type" = "application/json"
    "Prefer" = "resolution=merge-duplicates"
}

$cText = [IO.File]::ReadAllText('js/data.js', [System.Text.Encoding]::UTF8)
$s = $cText.IndexOf('[')
$e = $cText.LastIndexOf(']')
$jsonText = $cText.Substring($s, $e - $s + 1)
$list = $jsonText | ConvertFrom-Json

$payload = @()
$idx = 1
foreach ($c in $list) {
    $payload += @{
        id = $c.id
        rank = $idx
        name = $c.name
        english_name = $c.engName
        district = $c.district
        province = $c.province
        scg_customer_id = $c.scgCode
        tag = if ($c.tag) { $c.tag } else { "Focus" }
        sales_2025 = [double]$c.sales2025
        sales_2026 = [double]$c.sales2026
        opportunity_score = [int]$c.growthRate
        revenue_potential = $c.revenuePotentialText
        ai_recommendation = $c.aiShortRec
        facebook_url = $c.facebookUrl
        google_maps_url = $c.googleMapsUrl
        posts_count = 0
    }
    $idx++
}

$body = $payload | ConvertTo-Json -Depth 5

try {
    $res = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
    Write-Host "SYNC ALL COMPANIES TO SUPABASE SUCCESS: Total $($payload.Count) companies synced!"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
