$token = "apify_api_3GUGpFA4CffFy8xeDH99xx91yh4ufV035rHI"
$configPath = "c:\Users\pannipan\Downloads\N\scripts\apify_actor_config.json"
$configJson = [System.IO.File]::ReadAllText($configPath, [System.Text.Encoding]::UTF8)

Write-Host "=========================================="
Write-Host "NEXTSITE AI - TRIGGERING APIFY SCRAPER"
Write-Host "=========================================="

$headers = @{
    "Content-Type" = "application/json; charset=utf-8"
}
$url = "https://api.apify.com/v2/acts/apify~facebook-posts-scraper/runs?token=" + $token

Write-Host "Sending request to Apify Actor (apify/facebook-posts-scraper)..."
try {
    $runResponse = Invoke-RestMethod -Uri $url -Method Post -Body $configJson -Headers $headers
    $runId = $runResponse.data.id
    $datasetId = $runResponse.data.defaultDatasetId
    $runUrl = "https://console.apify.com/actors/apify~facebook-posts-scraper/runs/" + $runId

    Write-Host "Actor Run Started Successfully!"
    Write-Host "Run ID: $runId"
    Write-Host "Dataset ID: $datasetId"
    Write-Host "Track Live on Apify: $runUrl"
    Write-Host "Waiting for Apify to scrape posts across 33 pages (15 posts per page)..."

    $status = "RUNNING"
    $startTime = Get-Date

    while ($status -eq "READY" -or $status -eq "RUNNING") {
        Start-Sleep -Seconds 10
        $elapsed = [math]::Round(((Get-Date) - $startTime).TotalSeconds)
        
        $statusUrl = "https://api.apify.com/v2/actor-runs/" + $runId + "?token=" + $token
        $statusRes = Invoke-RestMethod -Uri $statusUrl
        $status = $statusRes.data.status
        
        Write-Host "[$elapsed s] Status: $status..."
    }

    Write-Host ""
    if ($status -eq "SUCCEEDED") {
        Write-Host "APIFY RUN COMPLETED SUCCESSFULLY!"
        
        $datasetUrl = "https://api.apify.com/v2/datasets/" + $datasetId + "/items?token=" + $token + "&format=json"
        $datasetRaw = Invoke-RestMethod -Uri $datasetUrl
        
        $rawPath = "c:\Users\pannipan\Downloads\N\scripts\apify_raw_dataset.json"
        $datasetJsonStr = $datasetRaw | ConvertTo-Json -Depth 20
        [System.IO.File]::WriteAllText($rawPath, $datasetJsonStr, [System.Text.Encoding]::UTF8)
        
        Write-Host "Saved raw posts to: $rawPath"
        Write-Host "Total posts scraped: " $datasetRaw.Count
    } else {
        Write-Host "Apify Run ended with status: $status"
    }
} catch {
    Write-Host "Error occurred: $_"
}
