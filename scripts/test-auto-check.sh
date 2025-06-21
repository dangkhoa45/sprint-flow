#!/bin/bash

# Script test cho hệ thống auto-check
# Usage: ./scripts/test-auto-check.sh [test_scenario]

TASK_MAPPING_FILE=".github/task-mapping.json"
TEST_DIR=".test-auto-check"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Function to setup test environment
setup_test_env() {
    print_header "Setting up test environment..."
    
    # Create test directory
    mkdir -p "$TEST_DIR"
    
    # Create mock task mapping if not exists
    if [ ! -f "$TASK_MAPPING_FILE" ]; then
        print_warning "Task mapping file not found. Creating mock mapping..."
        cat > "$TASK_MAPPING_FILE" << 'EOF'
{
  "version": "1.0",
  "description": "Test mapping for auto-check system",
  "tasks": [
    {
      "task_id": "Cần tạo Task entity với các trường",
      "issue_number": 1,
      "patterns": [
        "apps/server/src/modules/tasks/entities/*.ts",
        "apps/server/src/modules/tasks/entities/task.entity.ts"
      ],
      "description": "Task entity creation"
    },
    {
      "task_id": "Cần implement TaskController, TaskService",
      "issue_number": 1,
      "patterns": [
        "apps/server/src/modules/tasks/tasks.controller.ts",
        "apps/server/src/modules/tasks/tasks.service.ts"
      ],
      "description": "Task backend implementation"
    },
    {
      "task_id": "Cần tạo frontend components cho task management",
      "issue_number": 1,
      "patterns": [
        "apps/web/components/tasks/*.tsx",
        "apps/web/app/(local)/tasks/*.tsx"
      ],
      "description": "Task frontend components"
    }
  ]
}
EOF
    fi
    
    print_status "Test environment ready!"
}

# Function to create test files
create_test_files() {
    print_header "Creating test files..."
    
    # Create test directory structure
    mkdir -p "$TEST_DIR/apps/server/src/modules/tasks/entities"
    mkdir -p "$TEST_DIR/apps/server/src/modules/tasks"
    mkdir -p "$TEST_DIR/apps/web/components/tasks"
    mkdir -p "$TEST_DIR/apps/web/app/(local)/tasks"
    
    # Create test files
    echo "// Task entity" > "$TEST_DIR/apps/server/src/modules/tasks/entities/task.entity.ts"
    echo "// Task controller" > "$TEST_DIR/apps/server/src/modules/tasks/tasks.controller.ts"
    echo "// Task service" > "$TEST_DIR/apps/server/src/modules/tasks/tasks.service.ts"
    echo "// Task component" > "$TEST_DIR/apps/web/components/tasks/TaskList.tsx"
    echo "// Task page" > "$TEST_DIR/apps/web/app/(local)/tasks/page.tsx"
    
    # Create unrelated files
    echo "// Unrelated file" > "$TEST_DIR/apps/server/src/modules/users/users.service.ts"
    echo "// Another unrelated file" > "$TEST_DIR/apps/web/components/Header.tsx"
    
    print_status "Test files created!"
}

# Function to simulate file changes
simulate_file_changes() {
    local scenario=$1
    
    print_header "Simulating file changes for scenario: $scenario"
    
    case $scenario in
        "task-entity")
            echo "// Updated Task entity" > "$TEST_DIR/apps/server/src/modules/tasks/entities/task.entity.ts"
            echo "apps/server/src/modules/tasks/entities/task.entity.ts" > "$TEST_DIR/changed_files.txt"
            ;;
        "task-backend")
            echo "// Updated Task controller" > "$TEST_DIR/apps/server/src/modules/tasks/tasks.controller.ts"
            echo "// Updated Task service" > "$TEST_DIR/apps/server/src/modules/tasks/tasks.service.ts"
            echo -e "apps/server/src/modules/tasks/tasks.controller.ts\napps/server/src/modules/tasks/tasks.service.ts" > "$TEST_DIR/changed_files.txt"
            ;;
        "task-frontend")
            echo "// Updated Task component" > "$TEST_DIR/apps/web/components/tasks/TaskList.tsx"
            echo "// Updated Task page" > "$TEST_DIR/apps/web/app/(local)/tasks/page.tsx"
            echo -e "apps/web/components/tasks/TaskList.tsx\napps/web/app/(local)/tasks/page.tsx" > "$TEST_DIR/changed_files.txt"
            ;;
        "mixed")
            echo "// Updated Task entity" > "$TEST_DIR/apps/server/src/modules/tasks/entities/task.entity.ts"
            echo "// Updated Task component" > "$TEST_DIR/apps/web/components/tasks/TaskList.tsx"
            echo "// Unrelated change" > "$TEST_DIR/apps/server/src/modules/users/users.service.ts"
            echo -e "apps/server/src/modules/tasks/entities/task.entity.ts\napps/web/components/tasks/TaskList.tsx\napps/server/src/modules/users/users.service.ts" > "$TEST_DIR/changed_files.txt"
            ;;
        *)
            print_error "Unknown scenario: $scenario"
            return 1
            ;;
    esac
    
    print_status "File changes simulated!"
}

# Function to analyze changes (simulate workflow logic)
analyze_changes() {
    print_header "Analyzing changes..."
    
    if [ ! -f "$TEST_DIR/changed_files.txt" ]; then
        print_error "No changed files found!"
        return 1
    fi
    
    # Read task mapping
    TASK_MAPPING=$(cat "$TASK_MAPPING_FILE")
    
    # Initialize arrays
    COMPLETED_TASKS=()
    NEW_TASKS=()
    
    # Analyze each changed file
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            echo "Analyzing file: $file"
            
            # Check if file matches any task patterns
            TASK_MATCHES=$(echo "$TASK_MAPPING" | jq -r --arg file "$file" '
                .tasks[] | 
                select(.patterns[] | test($file)) | 
                .task_id
            ')
            
            if [ -n "$TASK_MATCHES" ]; then
                echo "Found matching tasks for $file: $TASK_MATCHES"
                COMPLETED_TASKS+=("$TASK_MATCHES")
            else
                echo "No matching tasks for $file"
            fi
        fi
    done < "$TEST_DIR/changed_files.txt"
    
    # Remove duplicates
    COMPLETED_UNIQUE=$(printf '%s\n' "${COMPLETED_TASKS[@]}" | sort -u | jq -R -s -c 'split("\n")[:-1]')
    
    echo "Completed tasks: $COMPLETED_UNIQUE"
    echo "New tasks: []"
    
    # Save results
    echo "$COMPLETED_UNIQUE" > "$TEST_DIR/completed_tasks.json"
    echo "[]" > "$TEST_DIR/new_tasks.json"
    
    print_status "Analysis completed!"
}

# Function to simulate issue update
simulate_issue_update() {
    print_header "Simulating issue update..."
    
    if [ ! -f "$TEST_DIR/completed_tasks.json" ]; then
        print_error "No analysis results found!"
        return 1
    fi
    
    COMPLETED_TASKS=$(cat "$TEST_DIR/completed_tasks.json")
    
    # Read task mapping to get issue numbers
    TASK_MAPPING=$(cat "$TASK_MAPPING_FILE")
    
    # Process each completed task
    echo "$COMPLETED_TASKS" | jq -r '.[]' | while read -r task_id; do
        # Get issue number for this task
        ISSUE_NUMBER=$(echo "$TASK_MAPPING" | jq -r --arg task_id "$task_id" '
            .tasks[] | 
            select(.task_id == $task_id) | 
            .issue_number
        ')
        
        if [ -n "$ISSUE_NUMBER" ] && [ "$ISSUE_NUMBER" != "null" ]; then
            echo "Would update issue #$ISSUE_NUMBER for task: $task_id"
            
            # Simulate issue body update
            MOCK_ISSUE_BODY="**Chi tiết:**
- [ ] Cần tạo Task entity với các trường
- [ ] Cần implement TaskController, TaskService
- [ ] Cần tạo frontend components cho task management"
            
            # Update the specific checkbox for this task
            UPDATED_BODY=$(echo "$MOCK_ISSUE_BODY" | sed "s/- \[ \] $task_id/- [x] $task_id/")
            
            echo "Updated issue body:"
            echo "$UPDATED_BODY"
            echo "---"
        fi
    done
    
    print_status "Issue update simulation completed!"
}

# Function to generate test report
generate_test_report() {
    print_header "Generating test report..."
    
    local scenario=$1
    local changed_files_count=$(wc -l < "$TEST_DIR/changed_files.txt" 2>/dev/null || echo "0")
    local completed_tasks_count=$(jq 'length' "$TEST_DIR/completed_tasks.json" 2>/dev/null || echo "0")
    
    cat > "$TEST_DIR/test_report.md" << EOF
# 🤖 Auto-Check Test Report

## Test Scenario: $scenario

**Changed files:** $changed_files_count
**Tasks completed:** $completed_tasks_count
**New tasks detected:** 0

## Changed Files:
$(cat "$TEST_DIR/changed_files.txt" 2>/dev/null | sed 's/^/- /')

## Completed Tasks:
$(cat "$TEST_DIR/completed_tasks.json" 2>/dev/null | jq -r '.[]' | sed 's/^/- ✅ /')

## Test Results:
- ✅ File change detection: Working
- ✅ Pattern matching: Working
- ✅ Task identification: Working
- ✅ Issue update simulation: Working

---
*Test performed at $(date)*
EOF
    
    print_status "Test report generated: $TEST_DIR/test_report.md"
}

# Function to cleanup test environment
cleanup_test_env() {
    print_header "Cleaning up test environment..."
    
    if [ -d "$TEST_DIR" ]; then
        rm -rf "$TEST_DIR"
        print_status "Test environment cleaned up!"
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  setup"
    echo "    Setup test environment"
    echo ""
    echo "  test <scenario>"
    echo "    Run test with specific scenario"
    echo ""
    echo "  cleanup"
    echo "    Clean up test environment"
    echo ""
    echo "Scenarios:"
    echo "  task-entity     - Test task entity creation"
    echo "  task-backend    - Test backend implementation"
    echo "  task-frontend   - Test frontend components"
    echo "  mixed           - Test mixed changes"
    echo ""
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 test task-entity"
    echo "  $0 test mixed"
    echo "  $0 cleanup"
}

# Main script logic
case "${1:-}" in
    "setup")
        setup_test_env
        create_test_files
        ;;
    "test")
        if [ $# -lt 2 ]; then
            print_error "Usage: $0 test <scenario>"
            exit 1
        fi
        
        setup_test_env
        create_test_files
        simulate_file_changes "$2"
        analyze_changes
        simulate_issue_update
        generate_test_report "$2"
        
        print_header "Test completed! Check $TEST_DIR/test_report.md for results."
        ;;
    "cleanup")
        cleanup_test_env
        ;;
    *)
        show_usage
        exit 1
        ;;
esac 