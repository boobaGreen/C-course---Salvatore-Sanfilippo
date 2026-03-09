$files = Get-ChildItem -Path "src/content" -Filter "*.mdx" -Recurse
foreach ($file in $files) {
    Write-Host "Processing $($file.FullName)..."
    $content = Get-Content $file.FullName -Raw
    
    # English replacements
    $content = $content -replace "Hacker Challenge", "Pro Challenge"
    $content = $content -replace "hacker-challenge", "pro-challenge"
    $content = $content -replace "Hacker Terminal", "Advanced Terminal"
    
    # Italian replacements
    $content = $content -replace "Sfida Hacker", "Sfida Pro"
    $content = $content -replace "sfida-hacker", "sfida-pro"
    
    # Generic/Code replacements
    $content = $content -replace 'type="hacker"', 'type="pro"'
    $content = $content -replace "Hacker Mindset", "Expert Mindset"
    
    # Fix component name if used as tag
    $content = $content -replace '<HackerTerminal', '<ProTerminal'
    $content = $content -replace '</HackerTerminal>', '</ProTerminal>'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
Write-Host "Done."
