[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?on_conflict=id"
$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"

$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Content-Type" = "application/json"
    "Prefer" = "resolution=merge-duplicates"
}

$testItem = @{
    id = "comp-udon-52"
    rank = 52
    name = "Ch. Rungarun"
    english_name = "Ch. Rungarun Construction Co., Ltd."
    district = "Prachak"
    province = "Udon Thani"
    scg_customer_id = "10484743"
    tag = "Focus"
    sales_2025 = 151787.5
    sales_2026 = 189440
    opportunity_score = 40
    revenue_potential = "฿0.0M - ฿0.0M"
    ai_recommendation = "Contractor"
    facebook_url = "https://www.facebook.com/share/1FFVcPSUWS/?mibextid=wwXIfr"
    google_maps_url = "https://maps.app.goo.gl/JSuoMGZYTfQER3ZQ9"
    posts_count = 0
}

$body = @($testItem) | ConvertTo-Json -Depth 5

try {
    $res = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
    Write-Host "SUCCESS: Upsert test record to Supabase completed successfully!"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
