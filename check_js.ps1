Get-ChildItem js/*.js | ForEach-Object {
    $name = $_.Name
    $content = Get-Content $_.FullName -Raw
    $oc = ($content.ToCharArray() | Where-Object { $_ -eq '{' }).Count
    $cc = ($content.ToCharArray() | Where-Object { $_ -eq '}' }).Count
    $op = ($content.ToCharArray() | Where-Object { $_ -eq '(' }).Count
    $cp = ($content.ToCharArray() | Where-Object { $_ -eq ')' }).Count
    $ob = ($content.ToCharArray() | Where-Object { $_ -eq '[' }).Count
    $cb = ($content.ToCharArray() | Where-Object { $_ -eq ']' }).Count
    Write-Host "$name -> Curly: $oc / $cc, Paren: $op / $cp, Bracket: $ob / $cb"
}
