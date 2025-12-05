#!/bin/bash
# Script to replace secrets in all files
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.txt" -o -name "*.ps1" -o -name "*.bat" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" -o -name "*.sh" \) ! -path "*/.git/*" ! -path "*/node_modules/*" -print0 | while IFS= read -r -d '' file; do
    if [ -f "$file" ]; then
        sed -i.bak \
            -e 's/your_gemini_api_key_here/your_gemini_api_key_here/g' \
            -e 's/your_talent_protocol_api_key_here/your_talent_protocol_api_key_here/g' \
            -e 's/your_reown_project_id_here/your_reown_project_id_here/g' \
            -e 's/your_unsplash_access_key_here/your_unsplash_access_key_here/g' \
            "$file" 2>/dev/null || true
        rm -f "$file.bak" 2>/dev/null || true
    fi
done

