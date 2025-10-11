# 🧹 Cleanup Commands - Clario UI Refactoring

## 📋 Overview
This document contains all commands needed to complete the final cleanup of the UI refactoring project.

---

## ⚠️ IMPORTANT: Do Not Run These Yet!

Before uninstalling @heroui/react, we need to complete the migration of all remaining components.

---

## 🔍 Verification Commands

### 1. Check for @heroui/react Usage
```bash
# Search for all files using @heroui/react
grep -r "@heroui/react" frontend/src --exclude-dir=node_modules

# Count files using @heroui/react
grep -r "@heroui/react" frontend/src --exclude-dir=node_modules | wc -l

# On Windows (PowerShell):
Get-ChildItem -Path frontend\src -Recurse -Include *.tsx,*.ts | Select-String "@heroui/react" | Select-Object Path -Unique
```

### 2. Check for Custom Component Usage
```bash
# Check if CustomButton is used anywhere
grep -r "CustomButton" frontend/src/app --exclude-dir=node_modules

# Check if CustomBadge is used anywhere
grep -r "CustomBadge" frontend/src/app --exclude-dir=node_modules

# Check if CustomAvatar is used anywhere
grep -r "CustomAvatar" frontend/src/app --exclude-dir=node_modules

# On Windows (PowerShell):
Get-ChildItem -Path frontend\src\app -Recurse | Select-String "CustomButton" | Select-Object Path -Unique
```

### 3. Verify Linting
```bash
cd frontend
npm run lint

# Or with auto-fix:
npm run lint -- --fix
```

### 4. Check TypeScript Errors
```bash
cd frontend
npx tsc --noEmit
```

---

## 🗑️ Safe Deletion Commands

### 1. Delete Legacy Auth Component
```bash
# Unix/Mac:
rm -rf frontend/src/app/_auth-old

# Windows:
rmdir /s /q frontend\src\app\_auth-old

# Or use PowerShell:
Remove-Item -Recurse -Force frontend\src\app\_auth-old
```

### 2. Delete Unused Atom Wrappers (After Verification)
```bash
# Only run these if grep shows no usage!

# Unix/Mac:
rm frontend/src/components/atoms/CustomButton.tsx
rm frontend/src/components/atoms/CustomBadge.tsx
rm frontend/src/components/atoms/CustomAvatar.tsx
rm frontend/src/components/atoms/ProgressBar.tsx

# Windows:
del frontend\src\components\atoms\CustomButton.tsx
del frontend\src\components\atoms\CustomBadge.tsx
del frontend\src\components\atoms\CustomAvatar.tsx
del frontend\src\components\atoms\ProgressBar.tsx
```

### 3. Delete Unused Molecule Components (After Verification)
```bash
# Only if verified as unused

# Unix/Mac:
rm frontend/src/components/molecules/LoginDropup.tsx
rm frontend/src/components/molecules/AuthFeaturesPanel.tsx

# Windows:
del frontend\src\components\molecules\LoginDropup.tsx
del frontend\src\components\molecules\AuthFeaturesPanel.tsx
```

---

## 📦 Package Management Commands

### 1. Uninstall @heroui/react (After Migration Complete)
```bash
cd frontend
npm uninstall @heroui/react

# Verify it's removed from package.json
cat package.json | grep heroui
# Should return nothing

# On Windows:
type package.json | findstr heroui
```

### 2. Clean Install
```bash
cd frontend

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Windows:
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### 3. Verify Dependencies
```bash
cd frontend
npm list @heroui/react
# Should show: (empty) or error "not found"

# Check for any orphaned peer dependencies
npm outdated
```

---

## 🧪 Testing Commands

### 1. Run Development Server
```bash
cd frontend
npm run dev
```

### 2. Run Linting
```bash
cd frontend
npm run lint
```

### 3. Run Type Checking
```bash
cd frontend
npx tsc --noEmit
```

### 4. Build for Production
```bash
cd frontend
npm run build
```

### 5. Start Production Build
```bash
cd frontend
npm run start
```

---

## 🔧 Troubleshooting Commands

### If Build Fails After Uninstall:

#### 1. Clear Next.js Cache
```bash
cd frontend
rm -rf .next

# Windows:
rmdir /s /q .next
```

#### 2. Clear TypeScript Cache
```bash
cd frontend
rm -rf .tsbuildinfo
rm -rf tsconfig.tsbuildinfo

# Windows:
del .tsbuildinfo
del tsconfig.tsbuildinfo
```

#### 3. Full Clean and Rebuild
```bash
cd frontend

# Remove all generated files
rm -rf node_modules .next out dist package-lock.json

# Windows:
rmdir /s /q node_modules .next out dist
del package-lock.json

# Reinstall and build
npm install
npm run build
```

---

## 📊 Verification Checklist

### Before Uninstalling @heroui/react:
```bash
# 1. Count remaining @heroui/react imports
grep -r "@heroui/react" frontend/src --exclude-dir=node_modules | wc -l
# Target: 0 files

# 2. Run linting
cd frontend && npm run lint
# Target: No errors

# 3. Run type checking  
cd frontend && npx tsc --noEmit
# Target: No errors

# 4. Test development build
cd frontend && npm run dev
# Target: App starts without errors

# 5. Test production build
cd frontend && npm run build
# Target: Build succeeds
```

### After Uninstalling @heroui/react:
```bash
# 1. Verify package removed
npm list @heroui/react
# Target: Package not found

# 2. Check package.json
cat package.json | grep heroui
# Target: No results

# 3. Run linting again
npm run lint
# Target: No errors

# 4. Build again
npm run build
# Target: Build succeeds

# 5. Test in browser
npm run dev
# Navigate through all pages
# Target: Everything works, no console errors
```

---

## 🎯 Complete Cleanup Script

### Safe Cleanup (Run After Migration Complete)

```bash
#!/bin/bash

echo "🧹 Starting Clario UI Cleanup..."

# Navigate to frontend directory
cd frontend

# Step 1: Verify no @heroui/react usage
echo "📋 Checking for @heroui/react usage..."
HEROUI_COUNT=$(grep -r "@heroui/react" src --exclude-dir=node_modules | wc -l)

if [ "$HEROUI_COUNT" -gt 0 ]; then
  echo "⚠️  Warning: Found $HEROUI_COUNT file(s) still using @heroui/react"
  echo "Please complete migration before running cleanup."
  exit 1
fi

# Step 2: Delete legacy components
echo "🗑️  Deleting legacy components..."
rm -rf src/app/_auth-old
echo "✅ Deleted _auth-old directory"

# Step 3: Run linting
echo "🔍 Running linting..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix errors before continuing."
  exit 1
fi

# Step 4: Run type checking
echo "📝 Running TypeScript check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Please fix errors before continuing."
  exit 1
fi

# Step 5: Uninstall @heroui/react
echo "📦 Uninstalling @heroui/react..."
npm uninstall @heroui/react

# Step 6: Clean install
echo "🔄 Cleaning and reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install

# Step 7: Build
echo "🏗️  Building production bundle..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please check errors above."
  exit 1
fi

echo ""
echo "✅ Cleanup complete!"
echo "🎉 @heroui/react has been successfully removed"
echo "🚀 Project is ready for deployment"
```

**Save as:** `frontend/cleanup.sh`

**Make executable (Unix/Mac):**
```bash
chmod +x frontend/cleanup.sh
```

**Run:**
```bash
./frontend/cleanup.sh
```

---

## 📝 Windows PowerShell Script

```powershell
# cleanup.ps1

Write-Host "🧹 Starting Clario UI Cleanup..." -ForegroundColor Cyan

# Navigate to frontend
Set-Location frontend

# Step 1: Check for @heroui/react
Write-Host "📋 Checking for @heroui/react usage..." -ForegroundColor Yellow
$heroUIFiles = Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "@heroui/react" | Select-Object Path -Unique

if ($heroUIFiles.Count -gt 0) {
    Write-Host "⚠️  Warning: Found $($heroUIFiles.Count) file(s) still using @heroui/react" -ForegroundColor Red
    Write-Host "Please complete migration before running cleanup." -ForegroundColor Red
    exit 1
}

# Step 2: Delete legacy
Write-Host "🗑️  Deleting legacy components..." -ForegroundColor Yellow
if (Test-Path "src\app\_auth-old") {
    Remove-Item -Recurse -Force "src\app\_auth-old"
    Write-Host "✅ Deleted _auth-old directory" -ForegroundColor Green
}

# Step 3: Lint
Write-Host "🔍 Running linting..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Linting failed" -ForegroundColor Red
    exit 1
}

# Step 4: Type check
Write-Host "📝 Running TypeScript check..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Type checking failed" -ForegroundColor Red
    exit 1
}

# Step 5: Uninstall
Write-Host "📦 Uninstalling @heroui/react..." -ForegroundColor Yellow
npm uninstall @heroui/react

# Step 6: Clean install
Write-Host "🔄 Cleaning and reinstalling..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install

# Step 7: Build
Write-Host "🏗️  Building..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host "🎉 @heroui/react has been successfully removed" -ForegroundColor Green
Write-Host "🚀 Project is ready for deployment" -ForegroundColor Green
```

**Save as:** `frontend/cleanup.ps1`

**Run (PowerShell):**
```powershell
.\frontend\cleanup.ps1
```

---

## ⚠️ Important Notes

### Do Not Run Uninstall Until:
1. ✅ All 14 files migrated away from @heroui/react
2. ✅ Tracks page uses shadcn/ui components
3. ✅ Header component refactored
4. ✅ All atom wrappers verified as unused
5. ✅ Linting passes with no errors
6. ✅ TypeScript compilation succeeds
7. ✅ Development build works perfectly
8. ✅ All pages tested and functional

### After Uninstall:
1. Test entire application thoroughly
2. Check for any console errors
3. Verify all animations still work
4. Test on multiple browsers
5. Run production build
6. Deploy to staging for QA

---

## 🎯 Quick Reference

```bash
# Check remaining HeroUI usage
grep -r "@heroui/react" frontend/src | wc -l

# Delete legacy auth
rm -rf frontend/src/app/_auth-old

# Uninstall HeroUI (when ready)
cd frontend && npm uninstall @heroui/react

# Full clean rebuild
cd frontend && rm -rf node_modules .next && npm install && npm run build

# Test everything
cd frontend && npm run lint && npx tsc --noEmit && npm run build && npm run dev
```

---

**Status:** Ready to execute after migration complete  
**Risk Level:** Low (if verification steps followed)  
**Estimated Time:** 5-10 minutes for full cleanup

