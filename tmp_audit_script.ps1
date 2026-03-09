$files = Get-ChildItem -Path "src/content/it/*.mdx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $quizzes = ([regex]::Matches($content, '<Quiz')).Count
    $challenges = ([regex]::Matches($content, '<HackerTerminal')).Count
    Write-Output "$($file.Name): Q=$quizzes, H=$challenges"
}
