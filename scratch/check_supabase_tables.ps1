[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$key = "sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
}

$tables = @('companies', 'sales_notes', 'crm_notes', 'followup_logs', 'user_profiles')

foreach ($tbl in $tables) {
    $url = "https://jklmttvwteuaixfcxhpd.supabase.co/rest/v1/$tbl?select=id&limit=1"
    try {
        $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        Write-Host "TABLE EXISTS: $tbl (Status OK, Count: $($res.Count))"
    } catch {
        Write-Host "TABLE DOES NOT EXIST: $tbl ($($_.Exception.Message))"
    }
}
