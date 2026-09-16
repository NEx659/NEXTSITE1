$headers = @{
    'apikey' = 'sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4'
    'Authorization' = 'Bearer sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4'
    'Content-Type' = 'application/json'
}

$bodyObj = @{
    crm_note = 'ทดสอบบันทึกโน้ตอัตโนมัติ 100% ผ่าน Cloud'
    crm_status = 'contacted'
}

$bodyJson = $bodyObj | ConvertTo-Json
$res = Invoke-RestMethod -Uri 'https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.comp-udon-08' -Method Patch -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($bodyJson))

# Read back
$check = Invoke-RestMethod -Uri 'https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/companies?id=eq.comp-udon-08' -Headers $headers
Write-Host "Read back after PATCH:" ($check | ConvertTo-Json)
