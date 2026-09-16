$Token = "apify_api_4kCGgEIakDbpgy6N53hUdC27IMcULy1ddh5B"
$ConfigFile = Join-Path (Get-Location) "scripts\apify_actor_config_54.json"
$OutputFile = Join-Path (Get-Location) "scripts\facebook_54_pages_posts.json"

Write-Host "================================================================="
Write-Host "NEXTSITE AI - Starting Apify Facebook 54 Pages Scraper"
Write-Host "================================================================="

$inputJson = Get-Content $ConfigFile -Raw -Encoding UTF8

# 1. Trigger Apify Actor Run
$startUrl = "https://api.apify.com/v2/acts/apify~facebook-posts-scraper/runs?token=$Token"
Write-Host "Sending request to start Apify Actor..."

$headers = @{
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $startUrl -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($inputJson)) -Headers $headers
    $runId = $response.data.id
    $datasetId = $response.data.defaultDatasetId
    $status = $response.data.status
    Write-Host "Actor Run Started Successfully!"
    Write-Host "Run ID: $runId"
    Write-Host "Dataset ID: $datasetId"
    Write-Host "Status: $status"
} catch {
    Write-Host "Failed to start Actor: $_"
    exit 1
}

# 2. Wait for Run to Complete
$statusUrl = "https://api.apify.com/v2/actor-runs/$runId`?token=$Token"
$maxWaitSeconds = 900
$elapsed = 0

Write-Host "Waiting for scraper to finish..."

while ($elapsed -lt $maxWaitSeconds) {
    Start-Sleep -Seconds 10
    $elapsed += 10
    
    try {
        $runInfo = Invoke-RestMethod -Uri $statusUrl -Method Get
        $status = $runInfo.data.status
        Write-Host "[$elapsed s] Status: $status"
        
        if ($status -eq "SUCCEEDED") {
            Write-Host "Scraper finished with status: SUCCEEDED!"
            break
        } elseif ($status -eq "FAILED" -or $status -eq "TIMED-OUT" -or $status -eq "ABORTED") {
            Write-Host "Scraper ended with status: $status"
            exit 1
        }
    } catch {
        Write-Host "Checking status..."
    }
}

# 3. Download Dataset Items
Write-Host "Downloading dataset items from Dataset ID: $datasetId..."
$datasetUrl = "https://api.apify.com/v2/datasets/$datasetId/items?clean=true&format=json&token=$Token"

try {
    Invoke-RestMethod -Uri $datasetUrl -OutFile $OutputFile
    $fileInfo = Get-Item $OutputFile
    Write-Host "Successfully saved dataset to: $OutputFile"
} catch {
    Write-Host "Failed to download dataset: $_"
    exit 1
}

Write-Host "================================================================="
Write-Host "All Done! 54 Facebook Pages Scraped and Saved."
Write-Host "================================================================="
