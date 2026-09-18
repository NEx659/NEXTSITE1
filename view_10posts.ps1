$txt = [System.IO.File]::ReadAllText("$PSScriptRoot/function_design_10posts_clean.txt", [System.Text.Encoding]::UTF8)
Write-Output $txt
