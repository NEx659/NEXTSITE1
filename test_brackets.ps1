$txt = Get-Content -Raw js/app.js
$oc = ($txt -split '\{').Count - 1
$cc = ($txt -split '\}').Count - 1
$op = ($txt -split '\(').Count - 1
$cp = ($txt -split '\)').Count - 1
$ob = ($txt -split '\[').Count - 1
$cb = ($txt -split '\]').Count - 1
Write-Host "js/app.js -> Curly: $oc / $cc, Paren: $op / $cp, Bracket: $ob / $cb"
