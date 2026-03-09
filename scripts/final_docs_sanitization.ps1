$files = Get-ChildItem -Path "." -Include "*.md", "REPORT", "*.json" -Recurse
foreach ($file in $files) {
    if ($file.FullName -like "*node_modules*" -or $file.FullName -like "*.git*") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Standard replacements
    $content = $content -replace "Hacker Challenge", "Sfida Pro"
    $content = $content -replace "hacker-challenge", "sfida-pro"
    $content = $content -replace "Hacker Terminal", "Terminale Avanzato"
    $content = $content -replace "HackerTerminal", "ProTerminal"
    $content = $content -replace "Hacker Mindset", "Mentalità da Esperto"
    $content = $content -replace "Hacker Knowledge", "Conoscenza Avanzata"
    $content = $content -replace "Hacker String", "Stringa Pro"
    $content = $content -replace "Hacker Quiz", "Quiz Pro"
    $content = $content -replace "Quiz Hacker", "Quiz Pro"
    
    # Specific sentences
    $content = $content -replace "built by hackers, for hackers", "costruito da esperti, per gli esperti"
    $content = $content -replace "costruito da hacker, per gli hacker", "costruito da professionisti, per i professionisti"
    
    # Case insensitive catch-all for remaining "hacker" in text
    $content = $content -replace "(?i)hacker", "PRO"

    if ($content -ne $original) {
        Write-Host "Cleaning $($file.FullName)..."
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    }
}
Write-Host "Done."
