#!/bin/bash

# Script để cập nhật task mapping khi có issue mới hoặc thay đổi
# Usage: ./scripts/update-task-mapping.sh [issue_number] [task_id] [file_patterns...]

TASK_MAPPING_FILE=".github/task-mapping.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to add a new task mapping
add_task_mapping() {
    local issue_number=$1
    local task_id=$2
    shift 2
    local patterns=("$@")
    
    print_status "Adding task mapping for issue #$issue_number"
    print_status "Task ID: $task_id"
    print_status "Patterns: ${patterns[*]}"
    
    # Create new task object
    local new_task=$(jq -n \
        --arg task_id "$task_id" \
        --arg issue_number "$issue_number" \
        --arg description "Task mapping for $task_id" \
        --argjson patterns "$(printf '%s\n' "${patterns[@]}" | jq -R -s -c 'split("\n")[:-1]')" \
        '{
            task_id: $task_id,
            issue_number: ($issue_number | tonumber),
            patterns: $patterns,
            description: $description
        }')
    
    # Add to existing mapping
    jq --argjson new_task "$new_task" '.tasks += [$new_task]' "$TASK_MAPPING_FILE" > "${TASK_MAPPING_FILE}.tmp"
    mv "${TASK_MAPPING_FILE}.tmp" "$TASK_MAPPING_FILE"
    
    print_status "Task mapping added successfully!"
}

# Function to remove a task mapping
remove_task_mapping() {
    local task_id=$1
    
    print_status "Removing task mapping for: $task_id"
    
    # Remove task from mapping
    jq --arg task_id "$task_id" 'del(.tasks[] | select(.task_id == $task_id))' "$TASK_MAPPING_FILE" > "${TASK_MAPPING_FILE}.tmp"
    mv "${TASK_MAPPING_FILE}.tmp" "$TASK_MAPPING_FILE"
    
    print_status "Task mapping removed successfully!"
}

# Function to list all task mappings
list_task_mappings() {
    print_header "Current Task Mappings:"
    echo ""
    
    jq -r '.tasks[] | "Issue #\(.issue_number): \(.task_id)\n  Patterns: \(.patterns | join(", "))\n  Description: \(.description)\n"' "$TASK_MAPPING_FILE"
}

# Function to validate task mapping
validate_task_mapping() {
    print_status "Validating task mapping file..."
    
    # Check if file exists
    if [ ! -f "$TASK_MAPPING_FILE" ]; then
        print_error "Task mapping file not found: $TASK_MAPPING_FILE"
        exit 1
    fi
    
    # Validate JSON structure
    if ! jq empty "$TASK_MAPPING_FILE" 2>/dev/null; then
        print_error "Invalid JSON in task mapping file"
        exit 1
    fi
    
    # Check for required fields
    local invalid_tasks=$(jq -r '.tasks[] | select(.task_id == null or .issue_number == null or .patterns == null) | .task_id' "$TASK_MAPPING_FILE")
    
    if [ -n "$invalid_tasks" ]; then
        print_error "Found tasks with missing required fields: $invalid_tasks"
        exit 1
    fi
    
    print_status "Task mapping file is valid!"
}

# Function to generate task mapping from issues.json
generate_from_issues() {
    print_header "Generating task mapping from issues.json..."
    
    if [ ! -f "issues.json" ]; then
        print_error "issues.json not found"
        exit 1
    fi
    
    # Create new task mapping structure
    local new_mapping=$(jq -n '{
        version: "1.0",
        description: "Mapping between code file patterns and issue tasks for auto-checking",
        tasks: []
    }')
    
    # Process each issue
    local issue_number=1
    jq -c '.[]' issues.json | while read -r issue; do
        local title=$(echo "$issue" | jq -r '.title')
        local body=$(echo "$issue" | jq -r '.body')
        
        print_status "Processing issue #$issue_number: $title"
        
        # Extract checkbox tasks from body
        local tasks=$(echo "$body" | grep -E '^- \[ \] ' | sed 's/^- \[ \] //')
        
        while IFS= read -r task; do
            if [ -n "$task" ]; then
                print_status "  Found task: $task"
                
                # Generate patterns based on task content
                local patterns=()
                
                # Add common patterns based on task type
                if [[ "$task" == *"entity"* ]]; then
                    patterns+=("apps/server/src/modules/*/entities/*.entity.ts")
                fi
                
                if [[ "$task" == *"controller"* ]]; then
                    patterns+=("apps/server/src/modules/*/*.controller.ts")
                fi
                
                if [[ "$task" == *"service"* ]]; then
                    patterns+=("apps/server/src/modules/*/*.service.ts")
                fi
                
                if [[ "$task" == *"frontend"* ]] || [[ "$task" == *"component"* ]]; then
                    patterns+=("apps/web/components/*/*.tsx")
                    patterns+=("apps/web/app/(local)/*/*.tsx")
                fi
                
                if [[ "$task" == *"hook"* ]]; then
                    patterns+=("apps/web/hooks/*.ts")
                fi
                
                # Add task to mapping
                local new_task=$(jq -n \
                    --arg task_id "$task" \
                    --arg issue_number "$issue_number" \
                    --arg description "Auto-generated from issue #$issue_number" \
                    --argjson patterns "$(printf '%s\n' "${patterns[@]}" | jq -R -s -c 'split("\n")[:-1]')" \
                    '{
                        task_id: $task_id,
                        issue_number: ($issue_number | tonumber),
                        patterns: $patterns,
                        description: $description
                    }')
                
                new_mapping=$(echo "$new_mapping" | jq --argjson new_task "$new_task" '.tasks += [$new_task]')
            fi
        done <<< "$tasks"
        
        ((issue_number++))
    done
    
    # Save new mapping
    echo "$new_mapping" > "$TASK_MAPPING_FILE"
    print_status "Task mapping generated successfully!"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  add <issue_number> <task_id> <pattern1> [pattern2] ..."
    echo "    Add a new task mapping"
    echo ""
    echo "  remove <task_id>"
    echo "    Remove a task mapping"
    echo ""
    echo "  list"
    echo "    List all task mappings"
    echo ""
    echo "  validate"
    echo "    Validate the task mapping file"
    echo ""
    echo "  generate"
    echo "    Generate task mapping from issues.json"
    echo ""
    echo "Examples:"
    echo "  $0 add 1 'Create Task entity' 'apps/server/src/modules/tasks/entities/*.ts'"
    echo "  $0 remove 'Create Task entity'"
    echo "  $0 list"
    echo "  $0 validate"
    echo "  $0 generate"
}

# Main script logic
case "${1:-}" in
    "add")
        if [ $# -lt 4 ]; then
            print_error "Usage: $0 add <issue_number> <task_id> <pattern1> [pattern2] ..."
            exit 1
        fi
        add_task_mapping "$2" "$3" "${@:4}"
        ;;
    "remove")
        if [ $# -lt 2 ]; then
            print_error "Usage: $0 remove <task_id>"
            exit 1
        fi
        remove_task_mapping "$2"
        ;;
    "list")
        list_task_mappings
        ;;
    "validate")
        validate_task_mapping
        ;;
    "generate")
        generate_from_issues
        ;;
    *)
        show_usage
        exit 1
        ;;
esac 