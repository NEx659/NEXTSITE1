$c = [System.IO.File]::ReadAllText("$PSScriptRoot/bake_out.html", [System.Text.Encoding]::UTF8)
Write-Output "bake_out.html length: $($c.Length)"

if ($c -match '<pre id="baked-json">([\s\S]*?)</pre>') {
    $baked = $matches[1]
    $baked = [System.Net.WebUtility]::HtmlDecode($baked)
    Write-Output "Baked string length: $($baked.Length)"
    
    # Check if it parses
    $cleanJson = $baked -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
    try {
        $arr = $cleanJson | ConvertFrom-Json
        Write-Output "Successfully parsed $($arr.Count) companies from bake_out.html!"
        
        # Now update comp-udon-06 inside this array!
        $updateObj = Get-Content -Path "$PSScriptRoot/comp06_update_2posts.json" -Raw -Encoding UTF8 | ConvertFrom-Json
        $compUpdate = $updateObj.company
        
        $replaced = $false
        for ($i = 0; $i -lt $arr.Count; $i++) {
            if ($arr[$i].id -eq "comp-udon-06") {
                $arr[$i] = $compUpdate
                $replaced = $true
                Write-Output "Replaced comp-udon-06 at index $i"
                break
            }
        }
        if (-not $replaced) {
            $arr += $compUpdate
            Write-Output "Appended comp-udon-06"
        }
        
        $newJson = $arr | ConvertTo-Json -Depth 20
        $finalContent = "var UDON_COMPANIES = " + $newJson + ";"
        [System.IO.File]::WriteAllText("$PSScriptRoot/../js/data.js", $finalContent, [System.Text.Encoding]::UTF8)
        Write-Output "Saved clean updated js/data.js! Length: $($finalContent.Length)"
    } catch {
        Write-Output "Error: $_"
    }
} else {
    Write-Output "baked-json not found"
}
