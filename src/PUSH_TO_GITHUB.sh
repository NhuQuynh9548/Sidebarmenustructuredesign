#!/bin/bash

# ========================================
# BLUEBOLT Finance - GitHub Push Script
# ========================================
# Automated script to push project to GitHub
# Usage: bash PUSH_TO_GITHUB.sh

echo "🚀 BLUEBOLT Finance - GitHub Push Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Step 1: Check if Git is installed
echo "Step 1: Checking Git installation..."
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi
print_success "Git is installed: $(git --version)"
echo ""

# Step 2: Check Git configuration
echo "Step 2: Checking Git configuration..."
GIT_NAME=$(git config --global user.name)
GIT_EMAIL=$(git config --global user.email)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
    print_warning "Git user not configured"
    echo ""
    read -p "Enter your name: " user_name
    read -p "Enter your email: " user_email
    git config --global user.name "$user_name"
    git config --global user.email "$user_email"
    print_success "Git configuration updated"
else
    print_info "Git user: $GIT_NAME <$GIT_EMAIL>"
fi
echo ""

# Step 3: Get repository URL
echo "Step 3: GitHub repository setup..."
print_info "Please create a repository on GitHub first if you haven't already."
print_info "Repository URL format: https://github.com/YOUR_USERNAME/bluebolt-finance.git"
echo ""
read -p "Enter your GitHub repository URL: " repo_url

if [ -z "$repo_url" ]; then
    print_error "Repository URL is required"
    exit 1
fi
echo ""

# Step 4: Initialize Git (if not already)
echo "Step 4: Initializing Git repository..."
if [ ! -d ".git" ]; then
    git init
    print_success "Git repository initialized"
else
    print_info "Git repository already initialized"
fi
echo ""

# Step 5: Check for sensitive files
echo "Step 5: Checking for sensitive files..."
print_warning "Make sure the following files are NOT being committed:"
echo "  - .env files"
echo "  - node_modules/"
echo "  - API keys or secrets"
echo ""
read -p "Have you reviewed sensitive files? (y/n): " confirmed

if [ "$confirmed" != "y" ]; then
    print_error "Please review sensitive files before continuing"
    exit 1
fi
print_success "Sensitive files check passed"
echo ""

# Step 6: Add files
echo "Step 6: Adding files to Git..."
git add .
print_success "All files staged"
echo ""

# Step 7: Check what will be committed
echo "Step 7: Files to be committed:"
git status --short
echo ""
read -p "Proceed with these files? (y/n): " proceed

if [ "$proceed" != "y" ]; then
    print_error "Commit cancelled"
    exit 1
fi
echo ""

# Step 8: Create commit
echo "Step 8: Creating commit..."
git commit -m "Initial commit: BLUEBOLT Financial Management System

Complete React + TypeScript + Tailwind CSS application with:
- Dashboard with charts and KPIs
- Business Units management with drag & drop
- Transaction management with auto-generated codes
- Employee and Partner management
- Admin panel with user management
- Master data modules
- Supabase backend integration
- Role-based access control
- Comprehensive documentation

Tech Stack:
- Frontend: React 18, TypeScript, Tailwind CSS 4
- Backend: Supabase (PostgreSQL + Edge Functions)
- Charts: Recharts
- DnD: React DnD
- Router: React Router 7

Features:
- 16 pages with full functionality
- 40+ API endpoints
- 5 custom hooks
- 25+ components
- Drag & drop columns
- Auto transaction codes (T0126_01 format)
- Approval workflows
- 6 demo accounts

Documentation:
- README.md - Main documentation
- QUICK_START.md - 5-minute setup
- INTEGRATION_GUIDE.md - API integration
- GITHUB_SETUP.md - Git workflow
- PROJECT_SUMMARY.md - Complete overview
"

if [ $? -eq 0 ]; then
    print_success "Commit created successfully"
else
    print_error "Commit failed"
    exit 1
fi
echo ""

# Step 9: Add remote
echo "Step 9: Adding remote repository..."
git remote remove origin 2>/dev/null  # Remove if exists
git remote add origin "$repo_url"

if [ $? -eq 0 ]; then
    print_success "Remote repository added: $repo_url"
else
    print_error "Failed to add remote repository"
    exit 1
fi
echo ""

# Step 10: Create main branch
echo "Step 10: Setting up main branch..."
git branch -M main
print_success "Main branch created"
echo ""

# Step 11: Push to GitHub
echo "Step 11: Pushing to GitHub..."
print_warning "You may need to enter your GitHub credentials"
print_info "Note: Use Personal Access Token as password (not your account password)"
echo ""
git push -u origin main

if [ $? -eq 0 ]; then
    print_success "Successfully pushed to GitHub!"
    echo ""
    echo "=========================================="
    echo "🎉 SUCCESS! Your project is now on GitHub"
    echo "=========================================="
    echo ""
    print_info "Repository URL: $repo_url"
    print_info "View your project: ${repo_url%.git}"
    echo ""
    print_info "Next steps:"
    echo "  1. Visit your repository on GitHub"
    echo "  2. Add topics/tags to your repo"
    echo "  3. Add collaborators if needed"
    echo "  4. Setup GitHub Pages (optional)"
    echo "  5. Deploy to production (Vercel/Netlify)"
    echo ""
else
    print_error "Push failed"
    echo ""
    print_warning "Common issues:"
    echo "  1. Authentication failed - Use Personal Access Token"
    echo "  2. Repository already exists - Use 'git push -f' to force"
    echo "  3. Network issues - Check your internet connection"
    echo ""
    print_info "To create Personal Access Token:"
    echo "  GitHub → Settings → Developer settings → Personal access tokens"
    echo "  Generate new token → Select 'repo' scope → Copy token"
    echo "  Use token as password when pushing"
    exit 1
fi

# Step 12: Summary
echo "📊 Summary:"
echo "  - Repository: $repo_url"
echo "  - Branch: main"
echo "  - Commit: $(git rev-parse --short HEAD)"
echo "  - Files: $(git ls-files | wc -l) files committed"
echo ""
print_success "All done! Happy coding! 🚀"
