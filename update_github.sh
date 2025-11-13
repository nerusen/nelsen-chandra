#!/bin/bash

echo "🚀 Starting GitHub Update Process..."

# Pastikan di direktori yang benar
if [ "$(basename $(pwd))" != "nelsen-chandra-main" ]; then
    echo "❌ Error: Not in correct directory. Please run from nelsen-chandra-main/"
    exit 1
fi

# Cek status git
echo "📊 Checking git status..."
git status

# Tambahkan semua perubahan
echo "📁 Adding all files..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "feat: Add Smart Talk AI Chat feature

- Add login page with Google/GitHub authentication
- Implement private AI chat with OpenRouter integration
- Add real-time messaging with Supabase
- Include cooldown mechanism and welcome messages
- Add bubble chat UI with proper styling
- Update sidebar with login/logout functionality
- Add comprehensive Indonesian setup documentation"

# Force push
echo "⬆️  Force pushing to GitHub..."
git push origin main --force

echo "✅ Update completed successfully!"
echo "🔗 Check your repository at: https://github.com/nerusen/nelsenchandra"
