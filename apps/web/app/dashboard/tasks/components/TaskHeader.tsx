"use client";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import { useRouter } from "next/navigation";
import { TaskViewMode } from "../types/task";
import CreateTaskDialog from "./CreateTaskDialog";

interface TaskHeaderProps {
  viewMode: TaskViewMode;
  setViewModeAction: (mode: TaskViewMode) => void;
}

export default function TaskHeader({ viewMode, setViewModeAction }: TaskHeaderProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const router = useRouter();

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: TaskViewMode | null
  ) => {
    if (newViewMode !== null) {
      setViewModeAction(newViewMode);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          p: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(226, 232, 240, 0.6)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)",
            backgroundSize: "300% 100%",
            animation: "gradientShift 3s ease infinite",
          },
          "@keyframes gradientShift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleBackToDashboard}
            sx={{
              mr: 2,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #764ba2, #667eea)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #1e293b, #475569)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                fontSize: "2.5rem",
                lineHeight: 1.2,
              }}
            >
              Quản lý công việc
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: "1.1rem",
                fontWeight: 500,
                opacity: 0.9,
              }}
            >
              Tạo, phân công và theo dõi tiến độ công việc trong dự án
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 2.5,
              padding: "4px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: 2,
                px: 2,
                py: 1,
                color: "#64748b",
                fontWeight: 600,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  color: "#3b82f6",
                  transform: "scale(1.05)",
                },
                "&.Mui-selected": {
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                  transform: "scale(1.05)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    transform: "scale(1.05)",
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
          <Tooltip title="Tìm kiếm" arrow>
            <IconButton
              sx={{
                backgroundColor: "rgba(241, 245, 249, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                borderRadius: 2.5,
                width: 48,
                height: 48,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderColor: "#3b82f6",
                  transform: "translateY(-2px) scale(1.05)",
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
                },
              }}
            >
              <SearchIcon sx={{ color: "#64748b", fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Bộ lọc" arrow>
            <IconButton
              sx={{
                backgroundColor: "rgba(241, 245, 249, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                borderRadius: 2.5,
                width: 48,
                height: 48,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  borderColor: "#8b5cf6",
                  transform: "translateY(-2px) scale(1.05)",
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.15)",
                },
              }}
            >
              <FilterListIcon sx={{ color: "#64748b", fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          {/* Create Task Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.95rem",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                transition: "left 0.6s ease",
              },
              "&:hover": {
                background: "linear-gradient(135deg, #059669, #047857)",
                boxShadow: "0 12px 35px rgba(16, 185, 129, 0.4)",
                transform: "translateY(-2px) scale(1.02)",
                "&::before": {
                  left: "100%",
                },
              },
              "&:active": {
                transform: "translateY(0) scale(0.98)",
              },
            }}
          >
            Tạo công việc
          </Button>

          <Tooltip title="Thêm tùy chọn" arrow>
            <IconButton
              sx={{
                backgroundColor: "rgba(241, 245, 249, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                borderRadius: 2.5,
                width: 48,
                height: 48,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  borderColor: "#6366f1",
                  transform: "translateY(-2px) scale(1.05)",
                  boxShadow: "0 8px 25px rgba(99, 102, 241, 0.15)",
                },
              }}
            >
              <MoreVertIcon sx={{ color: "#64748b", fontSize: 20 }} />
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
