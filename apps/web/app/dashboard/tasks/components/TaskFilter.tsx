"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ClearIcon from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";
import { TaskStatus, TaskPriority } from "../types/task";

const statusOptions = [
  { value: TaskStatus.TODO, label: "Chưa bắt đầu", color: "#6b7280" },
  { value: TaskStatus.IN_PROGRESS, label: "Đang thực hiện", color: "#2563eb" },
  { value: TaskStatus.IN_REVIEW, label: "Đang xem xét", color: "#f59e0b" },
  { value: TaskStatus.DONE, label: "Hoàn thành", color: "#059669" },
  { value: TaskStatus.BLOCKED, label: "Bị chặn", color: "#dc2626" },
];

const priorityOptions = [
  { value: TaskPriority.LOWEST, label: "Thấp nhất", color: "#64748b" },
  { value: TaskPriority.LOW, label: "Thấp", color: "#06b6d4" },
  { value: TaskPriority.MEDIUM, label: "Trung bình", color: "#10b981" },
  { value: TaskPriority.HIGH, label: "Cao", color: "#f59e0b" },
  { value: TaskPriority.HIGHEST, label: "Cao nhất", color: "#ef4444" },
];

// Mock data cho assignees và projects
const assigneeOptions = [
  { value: "user1", label: "Nguyễn Văn A" },
  { value: "user2", label: "Trần Thị B" },
  { value: "user3", label: "Lê Văn C" },
];

const projectOptions = [
  { value: "proj1", label: "Project Alpha" },
  { value: "proj2", label: "Project Beta" },
  { value: "proj3", label: "Project Gamma" },
];

interface TaskFilterProps {
  onFiltersChange?: (filters: {
    status: string[];
    priority: string[];
    assignee: string[];
    project: string[];
  }) => void;
}

export default function TaskFilter({ onFiltersChange }: TaskFilterProps = {}) {
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string[]>([]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedStatus([]);
    setSelectedPriority([]);
    setSelectedAssignee([]);
    setSelectedProject([]);
    onFiltersChange?.({
      status: [],
      priority: [],
      assignee: [],
      project: []
    });
  };

  const handleFilterChange = (type: string, value: string[]) => {
    switch (type) {
      case 'status':
        setSelectedStatus(value);
        break;
      case 'priority':
        setSelectedPriority(value);
        break;
      case 'assignee':
        setSelectedAssignee(value);
        break;
      case 'project':
        setSelectedProject(value);
        break;
    }
    
    // Notify parent component
    onFiltersChange?.({
      status: type === 'status' ? value : selectedStatus,
      priority: type === 'priority' ? value : selectedPriority,
      assignee: type === 'assignee' ? value : selectedAssignee,
      project: type === 'project' ? value : selectedProject,
    });
  };

  const hasActiveFilters = 
    searchTerm || 
    selectedStatus.length > 0 || 
    selectedPriority.length > 0 || 
    selectedAssignee.length > 0 || 
    selectedProject.length > 0;

  return (
    <Card sx={{ mb: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: expanded ? 3 : 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1e293b",
              }}
            >
              Bộ lọc và tìm kiếm
            </Typography>
            {hasActiveFilters && (
              <Chip
                label="Có bộ lọc đang áp dụng"
                size="small"
                color="primary"
                onDelete={clearAllFilters}
                deleteIcon={<ClearIcon />}
              />
            )}
          </Box>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              transition: "transform 0.2s",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        {/* Quick Search (Always Visible) */}
        <TextField
          fullWidth
          placeholder="Tìm kiếm công việc theo tiêu đề, mô tả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm("")}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f8fafc",
              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
              "&.Mui-focused": {
                backgroundColor: "white",
              },
            },
          }}
        />

        {/* Advanced Filters */}
        <Collapse in={expanded}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Status Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  multiple
                  value={selectedStatus}
                  onChange={(e) => handleFilterChange('status', e.target.value as string[])}
                  input={<OutlinedInput label="Trạng thái" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const option = statusOptions.find(opt => opt.value === value);
                        return (
                          <Chip
                            key={value}
                            label={option?.label}
                            size="small"
                            sx={{
                              backgroundColor: option?.color + "20",
                              color: option?.color,
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: option.color,
                          }}
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Priority Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Độ ưu tiên</InputLabel>
                <Select
                  multiple
                  value={selectedPriority}
                  onChange={(e) => handleFilterChange('priority', e.target.value as string[])}
                  input={<OutlinedInput label="Độ ưu tiên" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const option = priorityOptions.find(opt => opt.value === value);
                        return (
                          <Chip
                            key={value}
                            label={option?.label}
                            size="small"
                            sx={{
                              backgroundColor: option?.color + "20",
                              color: option?.color,
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 0,
                            height: 0,
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderBottom: `12px solid ${option.color}`,
                          }}
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Assignee Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Người được giao</InputLabel>
                <Select
                  multiple
                  value={selectedAssignee}
                  onChange={(e) => handleFilterChange('assignee', e.target.value as string[])}
                  input={<OutlinedInput label="Người được giao" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const option = assigneeOptions.find(opt => opt.value === value);
                        return (
                          <Chip
                            key={value}
                            label={option?.label}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {assigneeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Project Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Dự án</InputLabel>
                <Select
                  multiple
                  value={selectedProject}
                  onChange={(e) => handleFilterChange('project', e.target.value as string[])}
                  input={<OutlinedInput label="Dự án" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const option = projectOptions.find(opt => opt.value === value);
                        return (
                          <Chip
                            key={value}
                            label={option?.label}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {projectOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
}
