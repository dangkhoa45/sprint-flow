"use client";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ViewListIcon from "@mui/icons-material/ViewList";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { TaskViewMode } from "../types/task";
import CreateTaskDialog from "./CreateTaskDialog";

interface TaskHeaderProps {
  viewMode: TaskViewMode;
  setViewModeAction: (mode: TaskViewMode) => void;
}

export default function TaskHeader({ viewMode, setViewModeAction }: TaskHeaderProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: TaskViewMode | null
  ) => {
    if (newViewMode !== null) {
      setViewModeAction(newViewMode);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          p: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left Section */}
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              mb: 1,
            }}
          >
            Quản lý công việc
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Tạo, phân công và theo dõi tiến độ công việc trong dự án
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                border: "1px solid #e2e8f0",
                "&.Mui-selected": {
                  backgroundColor: "#3b82f6",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                  },
                },
              },
            }}
          >
            <ToggleButton value="board" aria-label="board view">
              <Tooltip title="Xem dạng bảng">
                <ViewKanbanIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <Tooltip title="Xem dạng danh sách">
                <ViewListIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Action Buttons */}
          <Tooltip title="Tìm kiếm">
            <IconButton
              sx={{
                backgroundColor: "#f1f5f9",
                "&:hover": { backgroundColor: "#e2e8f0" },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Bộ lọc">
            <IconButton
              sx={{
                backgroundColor: "#f1f5f9",
                "&:hover": { backgroundColor: "#e2e8f0" },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          {/* Create Task Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              backgroundColor: "#10b981",
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              "&:hover": {
                backgroundColor: "#059669",
                boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
              },
            }}
          >
            Tạo công việc
          </Button>

          <Tooltip title="Thêm tùy chọn">
            <IconButton
              sx={{
                backgroundColor: "#f1f5f9",
                "&:hover": { backgroundColor: "#e2e8f0" },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={createDialogOpen}
        onCloseAction={() => setCreateDialogOpen(false)}
      />
    </>
  );
}
