#!/bin/bash

# Frontend Check Script
# This script checks the frontend for syntax errors, missing imports, and other issues

set -e

echo "🔍 Checking Frontend Components..."
echo "=================================="

# Change to web directory
cd apps/web

echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

echo "🔧 Running TypeScript check..."
npx tsc --noEmit

echo "🧹 Running ESLint..."
npx eslint . --ext .ts,.tsx --max-warnings 0

echo "📁 Checking for missing files..."
echo "Checking milestone components..."
if [ ! -f "app/(local)/projects/components/MilestoneList.tsx" ]; then
    echo "❌ Missing: MilestoneList.tsx"
    exit 1
fi

if [ ! -f "app/(local)/projects/components/MilestoneDialog.tsx" ]; then
    echo "❌ Missing: MilestoneDialog.tsx"
    exit 1
fi

if [ ! -f "app/(local)/projects/components/MilestoneTimeline.tsx" ]; then
    echo "❌ Missing: MilestoneTimeline.tsx"
    exit 1
fi

echo "Checking attachment components..."
if [ ! -f "app/(local)/projects/components/AttachmentList.tsx" ]; then
    echo "❌ Missing: AttachmentList.tsx"
    exit 1
fi

if [ ! -f "app/(local)/projects/components/FileUpload.tsx" ]; then
    echo "❌ Missing: FileUpload.tsx"
    exit 1
fi

echo "Checking API files..."
if [ ! -f "api/milestones.ts" ]; then
    echo "❌ Missing: api/milestones.ts"
    exit 1
fi

if [ ! -f "api/attachments.ts" ]; then
    echo "❌ Missing: api/attachments.ts"
    exit 1
fi

echo "Checking type definitions..."
if [ ! -f "types/milestone.ts" ]; then
    echo "❌ Missing: types/milestone.ts"
    exit 1
fi

if [ ! -f "types/attachment.ts" ]; then
    echo "❌ Missing: types/attachment.ts"
    exit 1
fi

echo "Checking utility functions..."
if [ ! -f "utils/milestoneHelpers.ts" ]; then
    echo "❌ Missing: utils/milestoneHelpers.ts"
    exit 1
fi

if [ ! -f "utils/attachmentHelpers.ts" ]; then
    echo "❌ Missing: utils/attachmentHelpers.ts"
    exit 1
fi

echo "Checking project detail page..."
if [ ! -f "app/(local)/projects/[id]/page.tsx" ]; then
    echo "❌ Missing: app/(local)/projects/[id]/page.tsx"
    exit 1
fi

echo "✅ All files present!"

echo "🔗 Checking import paths..."
echo "Checking milestone imports..."
if ! grep -q "from.*@/api/milestones" app/\(local\)/projects/components/MilestoneList.tsx; then
    echo "❌ Missing milestone API import in MilestoneList"
    exit 1
fi

if ! grep -q "from.*@/types/milestone" app/\(local\)/projects/components/MilestoneList.tsx; then
    echo "❌ Missing milestone types import in MilestoneList"
    exit 1
fi

echo "Checking attachment imports..."
if ! grep -q "from.*@/api/attachments" app/\(local\)/projects/components/AttachmentList.tsx; then
    echo "❌ Missing attachment API import in AttachmentList"
    exit 1
fi

if ! grep -q "from.*@/types/attachment" app/\(local\)/projects/components/AttachmentList.tsx; then
    echo "❌ Missing attachment types import in AttachmentList"
    exit 1
fi

echo "✅ All imports correct!"

echo "🎯 Checking component props..."
echo "Checking MilestoneList props..."
if ! grep -q "interface MilestoneListProps" app/\(local\)/projects/components/MilestoneList.tsx; then
    echo "❌ Missing MilestoneListProps interface"
    exit 1
fi

echo "Checking AttachmentList props..."
if ! grep -q "interface AttachmentListProps" app/\(local\)/projects/components/AttachmentList.tsx; then
    echo "❌ Missing AttachmentListProps interface"
    exit 1
fi

echo "✅ All component props defined!"

echo ""
echo "🎉 Frontend check completed successfully!"
echo "=========================================="
echo "✅ TypeScript compilation: PASSED"
echo "✅ ESLint: PASSED"
echo "✅ All files present: PASSED"
echo "✅ Import paths: PASSED"
echo "✅ Component props: PASSED"
echo ""
echo "Frontend is ready for development! 🚀" 