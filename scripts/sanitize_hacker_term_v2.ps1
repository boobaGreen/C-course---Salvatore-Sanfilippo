$files = Get-ChildItem -Path "src" -Include "*.mdx", "*.tsx", "*.ts", "*.json" -Recurse
foreach ($file in $files) {
    if ($file.Name -eq "sanitize_hacker_term.ps1") { continue }
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # UI Components & Imports
    $content = $content -replace "HackerTerminal", "ProTerminal"
    
    # Titles and Content
    $content = $content -replace "Hacker Challenge", "Pro Challenge"
    $content = $content -replace "Sfida Hacker", "Sfida Pro"
    $content = $content -replace "Hacker Terminal", "Advanced Terminal"
    $content = $content -replace "Hacker Key Concepts", "Concetti Avanzati"
    $content = $content -replace "Hacker Mindset", "Expert Mindset"
    $content = $content -replace "Hacker Knowledge", "Advanced Knowledge"
    $content = $content -replace "Hacker String", "Pro String"
    $content = $content -replace "hacker", "esperto"
    $content = $content -replace "Hacker", "Esperto"
    
    # Attributes & Types
    $content = $content -replace 'type="hacker"', 'type="pro"'
    $content = $content -replace "hacker-edition", "expert-edition"

    if ($original -ne $content) {
        Write-Host "Updating $($file.FullName)..."
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    }
}
Write-Host "Sanitization Complete."
