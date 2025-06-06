"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewIcon from "@mui/icons-material/Visibility";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
  Project,
  ProjectPriority,
  ProjectStatus,
} from "../../../../types/project";

interface ProjectListProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onView?: (project: Project) => void;
}

const statusConfig = {
  [ProjectStatus.PLANNING]: {
    label: "Lập kế hoạch",
    color: "#2196f3",
    bgColor: "rgba(33, 150, 243, 0.1)",
  },
  [ProjectStatus.IN_PROGRESS]: {
    label: "Đang thực hiện",
    color: "#4caf50",
    bgColor: "rgba(76, 175, 80, 0.1)",
  },
  [ProjectStatus.COMPLETED]: {
    label: "Hoàn thành",
    color: "#8bc34a",
    bgColor: "rgba(139, 195, 74, 0.1)",
  },
  [ProjectStatus.ON_HOLD]: {
    label: "Tạm dừng",
    color: "#ff9800",
    bgColor: "rgba(255, 152, 0, 0.1)",
  },
  [ProjectStatus.CANCELLED]: {
    label: "Đã hủy",
    color: "#f44336",
    bgColor: "rgba(244, 67, 54, 0.1)",
  },
};

const priorityConfig = {
  [ProjectPriority.LOW]: { label: "Thấp", color: "#9e9e9e" },
  [ProjectPriority.MEDIUM]: { label: "Trung bình", color: "#ff9800" },
  [ProjectPriority.HIGH]: { label: "Cao", color: "#ff5722" },
  [ProjectPriority.URGENT]: { label: "Khẩn cấp", color: "#f44336" },
};

export default function ProjectList({
  projects,
  onEdit,
  onDelete,
  onView,
}: ProjectListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, project: Project) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleEdit = () => {
    if (selectedProject) {
      onEdit?.(selectedProject);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedProject) {
      onDelete?.(selectedProject);
    }
    handleMenuClose();
  };

  const handleView = (project: Project) => {
    onView?.(project);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: 600, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              Dự án
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              Trạng thái
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              Độ ưu tiên
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              Tiến độ
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              Thành viên
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              Ngày kết thúc
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => {
            const statusInfo = statusConfig[project.status];
            const priorityInfo = priorityConfig[project.priority];

            return (
              <TableRow
                key={project._id}
                onClick={() => handleView(project)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <TableCell sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "white", fontWeight: 600, mb: 0.5 }}
                    >
                      {project.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "300px",
                      }}
                    >
                      {project.description}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <Chip
                    size="small"
                    label={statusInfo.label}
                    sx={{
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.color,
                      border: `1px solid ${statusInfo.color}30`,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <Chip
                    size="small"
                    label={priorityInfo.label}
                    sx={{
                      backgroundColor: "transparent",
                      color: priorityInfo.color,
                      border: `1px solid ${priorityInfo.color}`,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 120 }}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: statusInfo.color,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "white", fontWeight: 600, minWidth: "35px" }}
                    >
                      {project.progress}%
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <AvatarGroup
                    max={3}
                    sx={{
                      "& .MuiAvatar-root": {
                        width: 28,
                        height: 28,
                        fontSize: "0.75rem",
                        border: "2px solid rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    {project.members.map((member) => (
                      <Avatar
                        key={member._id}
                        src={member.avatar}
                        sx={{
                          bgcolor: `hsl(${
                            (member.displayName.charCodeAt(0) * 137.5) % 360
                          }, 70%, 50%)`,
                        }}
                      >
                        {member.displayName.charAt(0).toUpperCase()}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {project.endDate ? formatDate(project.endDate) : "Chưa xác định"}
                  </Typography>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, project)}
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 2,
          },
        }}
      >
        <MenuItem
          onClick={() => selectedProject && handleView(selectedProject)}
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          <ViewIcon sx={{ mr: 1, fontSize: 18 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={handleEdit}
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{
            color: "#f44336",
            "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.1)" },
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Xóa
        </MenuItem>
      </Menu>
    </TableContainer>
  );
}
