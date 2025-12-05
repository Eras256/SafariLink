#!/bin/bash
# Script to replace secrets in all files
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.txt" -o -name "*.ps1" -o -name "*.bat" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" \) ! -path "./.git/*" -exec sed -i "s/your_gemini_api_key_here/your_gemini_api_key_here/g" {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.txt" -o -name "*.ps1" -o -name "*.bat" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" \) ! -path "./.git/*" -exec sed -i "s/your_talent_protocol_api_key_here/your_talent_protocol_api_key_here/g" {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.txt" -o -name "*.ps1" -o -name "*.bat" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" \) ! -path "./.git/*" -exec sed -i "s/your_reown_project_id_here/your_reown_project_id_here/g" {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.txt" -o -name "*.ps1" -o -name "*.bat" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" \) ! -path "./.git/*" -exec sed -i "s/your_unsplash_access_key_here/your_unsplash_access_key_here/g" {} \;

