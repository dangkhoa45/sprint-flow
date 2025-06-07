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
  { value: TaskStatus.TODO, label: "Chưa bắt đầu", color: "#6b7280", gradient: "linear-gradient(135deg, #6b7280, #4b5563)" },
  { value: TaskStatus.IN_PROGRESS, label: "Đang thực hiện", color: "#2563eb", gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
  { value: TaskStatus.IN_REVIEW, label: "Đang xem xét", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
  { value: TaskStatus.DONE, label: "Hoàn thành", color: "#059669", gradient: "linear-gradient(135deg, #059669, #047857)" },
  { value: TaskStatus.BLOCKED, label: "Bị chặn", color: "#dc2626", gradient: "linear-gradient(135deg, #dc2626, #b91c1c)" },
];

const priorityOptions = [
  { value: TaskPriority.LOWEST, label: "Thấp nhất", color: "#64748b", gradient: "linear-gradient(135deg, #64748b, #475569)" },
  { value: TaskPriority.LOW, label: "Thấp", color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" },
  { value: TaskPriority.MEDIUM, label: "Trung bình", color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { value: TaskPriority.HIGH, label: "Cao", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
  { value: TaskPriority.HIGHEST, label: "Cao nhất", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
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
    <Card 
      sx={{ 
        mb: 4,
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(226, 232, 240, 0.6)",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)",
          backgroundSize: "300% 100%",
          animation: "gradientShift 4s ease infinite",
        },
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: expanded ? 4 : 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.25rem",
                background: "linear-gradient(135deg, #1e293b, #475569)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Bộ lọc và tìm kiếm
            </Typography>
            {hasActiveFilters && (
              <Chip
                label="Có bộ lọc đang áp dụng"
                size="small"
                onDelete={clearAllFilters}
                deleteIcon={<ClearIcon />}
                sx={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "white",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                  },
                  "& .MuiChip-deleteIcon": {
                    color: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      color: "white",
                    },
                  },
                }}
              />
            )}
          </Box>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              backgroundColor: "rgba(241, 245, 249, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              borderRadius: 2.5,
              width: 44,
              height: 44,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderColor: "#3b82f6",
                transform: `${expanded ? "rotate(180deg)" : "rotate(0deg)"} scale(1.1)`,
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
              },
            }}
          >
            <ExpandMoreIcon sx={{ color: "#64748b", fontSize: 20 }} />
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
                <SearchIcon sx={{ color: "#64748b", fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm("")}
                  sx={{
                    color: "#64748b",
                    "&:hover": {
                      color: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
              borderRadius: 3,
              fontSize: "0.95rem",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              "&:hover": {
                background: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                borderColor: "#3b82f6",
              },
              "&.Mui-focused": {
                background: "white",
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
                borderColor: "#3b82f6",
                "& fieldset": {
                  border: "2px solid #3b82f6",
                },
              },
              "&.MuiOutlinedInput-notchedOutline": {
                border: "none",
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
                <InputLabel
                  sx={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  }}
                >
                  Trạng thái
                </InputLabel>
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
                              background: option?.gradient,
                              color: "white",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                              boxShadow: `0 2px 8px ${option?.color}40`,
                              border: "none",
                              "& .MuiChip-label": {
                                px: 1.5,
                              },
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                      borderRadius: 2.5,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)",
                        borderColor: "#3b82f6",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                      },
                      "&.Mui-focused": {
                        background: "white",
                        borderColor: "#3b82f6",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
                        "& fieldset": {
                          border: "2px solid #3b82f6 !important",
                        },
                      },
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      sx={{
                        borderRadius: 1.5,
                        mx: 1,
                        my: 0.5,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: `${option.color}15`,
                          transform: "translateX(4px)",
                        },
                        "&.Mui-selected": {
                          background: `${option.color}20`,
                          "&:hover": {
                            background: `${option.color}30`,
                          },
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: option.gradient,
                            boxShadow: `0 2px 6px ${option.color}40`,
                          }}
                        />
                        <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                          {option.label}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Priority Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    color: "#64748b",
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  }}
                >
                  Độ ưu tiên
                </InputLabel>
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
                              background: option?.gradient || option?.color + "20",
                              color: "white",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                              boxShadow: `0 2px 8px ${option?.color}30`,
                              border: `1px solid ${option?.color}40`,
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                transform: "translateY(-1px)",
                                boxShadow: `0 4px 12px ${option?.color}40`,
                              },
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                      borderRadius: 2.5,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                      },
                      "&.Mui-focused": {
                        background: "white",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3b82f6",
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        borderRadius: 3,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                        mt: 1,
                        "& .MuiMenuItem-root": {
                          borderRadius: 2,
                          margin: "4px 8px",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)",
                            transform: "translateX(4px)",
                          },
                          "&.Mui-selected": {
                            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                            color: "white",
                            "&:hover": {
                              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 0,
                            height: 0,
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderBottom: `12px solid ${option.color}`,
                            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.9rem",
                          }}
                        >
                          {option.label}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Assignee Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  }}
                >
                  Người được giao
                </InputLabel>
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
                            sx={{
                              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                              color: "white",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
                              border: "none",
                              "& .MuiChip-label": {
                                px: 1.5,
                              },
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                      borderRadius: 2.5,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)",
                        borderColor: "#3b82f6",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                      },
                      "&.Mui-focused": {
                        background: "white",
                        borderColor: "#3b82f6",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
                        "& fieldset": {
                          border: "2px solid #3b82f6 !important",
                        },
                      },
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        borderRadius: 3,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                        mt: 1,
                        "& .MuiMenuItem-root": {
                          borderRadius: 2,
                          margin: "4px 8px",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)",
                            transform: "translateX(4px)",
                          },
                          "&.Mui-selected": {
                            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                            color: "white",
                            "&:hover": {
                              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  {assigneeOptions.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      sx={{
                        borderRadius: 1.5,
                        mx: 1,
                        my: 0.5,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "rgba(99, 102, 241, 0.1)",
                          transform: "translateX(4px)",
                        },
                        "&.Mui-selected": {
                          background: "rgba(99, 102, 241, 0.2)",
                          "&:hover": {
                            background: "rgba(99, 102, 241, 0.3)",
                          },
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
                          }}
                        >
                          {option.label.charAt(0)}
                        </Box>
                        <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                          {option.label}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Project Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  }}
                >
                  Dự án
                </InputLabel>
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
                            sx={{
                              background: "linear-gradient(135deg, #10b981, #059669)",
                              color: "white",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                              border: "none",
                              "& .MuiChip-label": {
                                px: 1.5,
                              },
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                      borderRadius: 2.5,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)",
                        borderColor: "#3b82f6",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                      },
                      "&.Mui-focused": {
                        background: "white",
                        borderColor: "#3b82f6",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
                        "& fieldset": {
                          border: "2px solid #3b82f6 !important",
                        },
                      },
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        borderRadius: 3,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                        mt: 1,
                        "& .MuiMenuItem-root": {
                          borderRadius: 2,
                          margin: "4px 8px",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)",
                            transform: "translateX(4px)",
                          },
                          "&.Mui-selected": {
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "white",
                            "&:hover": {
                              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  {projectOptions.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      sx={{
                        borderRadius: 1.5,
                        mx: 1,
                        my: 0.5,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "rgba(16, 185, 129, 0.1)",
                          transform: "translateX(4px)",
                        },
                        "&.Mui-selected": {
                          background: "rgba(16, 185, 129, 0.2)",
                          "&:hover": {
                            background: "rgba(16, 185, 129, 0.3)",
                          },
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            boxShadow: "0 2px 6px rgba(16, 185, 129, 0.4)",
                          }}
                        />
                        <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                          {option.label}
                        </Typography>
                      </Box>
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
