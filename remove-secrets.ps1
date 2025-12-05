# Script to remove secrets from files
$files = Get-ChildItem -Recurse -File | Where-Object {
    $ext = [System.IO.Path]::GetExtension($_.FullName)
    $ext -in @('.ts', '.tsx', '.js', '.jsx', '.md', '.txt', '.ps1', '.bat', '.yml', '.yaml', '.json', '.sh') -and
    $_.FullName -notlike '*\.git\*' -and
    $_.FullName -notlike '*\node_modules\*'
}

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $original = $content
        
        $content = $content -replace 'your_gemini_api_key_here', 'your_gemini_api_key_here'
        $content = $content -replace 'your_talent_protocol_api_key_here', 'your_talent_protocol_api_key_here'
        $content = $content -replace 'your_reown_project_id_here', 'your_reown_project_id_here'
        $content = $content -replace 'your_unsplash_access_key_here', 'your_unsplash_access_key_here'
        
        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($file.FullName, $content)
        }
    } catch {
        # Skip files that can't be read
    }
}

