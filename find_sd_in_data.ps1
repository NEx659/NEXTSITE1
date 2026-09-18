$c = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $c.Substring($c.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

for ($i=0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].name -like "*เอสดี*" -or $companies[$i].engName -like "*SD*" -or $companies[$i].name -like "*SD*") {
        Write-Host "Found at index $i -> ID: $($companies[$i].id) | Name: $($companies[$i].name) | Eng: $($companies[$i].engName)"
    }
}
