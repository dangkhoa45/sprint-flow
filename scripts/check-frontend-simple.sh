#!/bin/bash

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=== Frontend Component Check ==="

# Check if key components exist
echo "Checking key components..."

COMPONENTS=(
    "$PROJECT_ROOT/apps/web/app/(local)/projects/[id]/page.tsx"
    "$PROJECT_ROOT/apps/web/app/(local)/projects/components/ProjectGrid.tsx"
    "$PROJECT_ROOT/apps/web/app/(local)/projects/components/MilestoneList.tsx"
    "$PROJECT_ROOT/apps/web/app/(local)/projects/components/AttachmentList.tsx"
    "$PROJECT_ROOT/apps/web/app/(local)/projects/components/FileUpload.tsx"
    "$PROJECT_ROOT/apps/web/app/(local)/projects/components/MilestoneTimeline.tsx"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $(basename "$component") exists"
    else
        echo "❌ $(basename "$component") missing"
    fi
done

# Check TypeScript compilation
echo -e "\nChecking TypeScript compilation..."
cd "$PROJECT_ROOT/apps/web"
if npx tsc --noEmit; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# Check if API files exist
echo -e "\nChecking API files..."
API_FILES=(
    "$PROJECT_ROOT/apps/web/api/projects.ts"
    "$PROJECT_ROOT/apps/web/api/milestones.ts"
    "$PROJECT_ROOT/apps/web/api/attachments.ts"
)

for api_file in "${API_FILES[@]}"; do
    if [ -f "$api_file" ]; then
        echo "✅ $(basename "$api_file") exists"
    else
        echo "❌ $(basename "$api_file") missing"
    fi
done

# Check if type definitions exist
echo -e "\nChecking type definitions..."
TYPE_FILES=(
    "$PROJECT_ROOT/apps/web/types/project.ts"
    "$PROJECT_ROOT/apps/web/types/milestone.ts"
    "$PROJECT_ROOT/apps/web/types/attachment.ts"
)

for type_file in "${TYPE_FILES[@]}"; do
    if [ -f "$type_file" ]; then
        echo "✅ $(basename "$type_file") exists"
    else
        echo "❌ $(basename "$type_file") missing"
    fi
done

echo -e "\n=== Frontend Check Complete ===" 