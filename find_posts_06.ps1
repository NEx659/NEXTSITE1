# Search dataset.json for Function Design
$datasetPath = "$PSScriptRoot/dataset.json"
Write-Output "Checking dataset.json..."

# Let's search line by line or json stream if possible
[System.IO.File]::ReadLines($datasetPath, [System.Text.Encoding]::UTF8) | ForEach-Object {
    if ($_ -match '100077712244902' -or $_ -match 'Function Design' -or $_ -match 'ฟังก์ชั่น ดีไซน์') {
        Write-Output "Found matching line in dataset: $($_.Substring(0, [Math]::Min(200, $_.Length)))"
    }
}
