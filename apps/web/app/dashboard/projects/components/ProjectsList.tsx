"use client";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
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

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChangeAction: (offset: number) => void;
  onProjectUpdateAction: () => void;
}

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.Planning:
      return "#757575";
    case ProjectStatus.InProgress:
      return "#2196f3";
    case ProjectStatus.OnHold:
      return "#ff9800";
    case ProjectStatus.Completed:
      return "#4caf50";
    case ProjectStatus.Cancelled:
      return "#f44336";
    default:
      return "#757575";
  }
};

const getPriorityColor = (priority: ProjectPriority) => {
  switch (priority) {
    case ProjectPriority.Low:
      return "#4caf50";
    case ProjectPriority.Medium:
      return "#ff9800";
    case ProjectPriority.High:
      return "#f44336";
    case ProjectPriority.Critical:
      return "#9c27b0";
    default:
      return "#757575";
  }
};

const getStatusLabel = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.Planning:
      return "Lập kế hoạch";
    case ProjectStatus.InProgress:
      return "Đang thực hiện";
    case ProjectStatus.OnHold:
      return "Tạm dừng";
    case ProjectStatus.Completed:
      return "Hoàn thành";
    case ProjectStatus.Cancelled:
      return "Đã hủy";
    default:
      return status;
  }
};

const getPriorityLabel = (priority: ProjectPriority) => {
  switch (priority) {
    case ProjectPriority.Low:
      return "Thấp";
    case ProjectPriority.Medium:
      return "Trung bình";
    case ProjectPriority.High:
      return "Cao";
    case ProjectPriority.Critical:
      return "Khẩn cấp";
    default:
      return priority;
  }
};

const ProjectRow = ({
  project,
}: {
  project: Project;
  onUpdateAction: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const isOverdue =
    project.endDate &&
    new Date(project.endDate) < new Date() &&
    project.status !== ProjectStatus.Completed;

  return (
    <TableRow
      hover
      sx={{
        "& td": {
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        },
        ...(isOverdue && {
          backgroundColor: "#ffebee",
        }),
      }}
    >
      {/* Project Name */}
      <TableCell>
        <Box>
          <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
            {project.name}
          </Typography>
          {project.description && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {project.description}
            </Typography>
          )}
        </Box>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Chip
          label={getStatusLabel(project.status)}
          size="small"
          sx={{
            backgroundColor: `${getStatusColor(project.status)}15`,
            color: getStatusColor(project.status),
            fontWeight: 600,
          }}
        />
      </TableCell>

      {/* Priority */}
      <TableCell>
        <Chip
          label={getPriorityLabel(project.priority)}
          size="small"
          sx={{
            backgroundColor: `${getPriorityColor(project.priority)}15`,
            color: getPriorityColor(project.priority),
            fontWeight: 600,
          }}
        />
      </TableCell>

      {/* Progress */}
      <TableCell>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 120 }}
        >
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: (theme) => theme.palette.grey[200],
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                backgroundColor: getStatusColor(project.status),
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{ minWidth: 35, textAlign: "right" }}
          >
            {project.progress}%
          </Typography>
        </Box>
      </TableCell>

      {/* Owner */}
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }} src={project.owner.avatar}>
            {project.owner.displayName?.charAt(0)}
          </Avatar>
          <Typography variant="body2">{project.owner.displayName}</Typography>
        </Box>
      </TableCell>

      {/* Members */}
      <TableCell>
        {project.members && project.members.length > 0 ? (
          <AvatarGroup
            max={4}
            sx={{
              "& .MuiAvatar-root": { width: 28, height: 28, fontSize: 12 },
            }}
          >
            {project.members.map((member) => (
              <Avatar key={member._id} src={member.avatar}>
                {member.displayName?.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        )}
      </TableCell>

      {/* End Date */}
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CalendarTodayIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography
            variant="body2"
            color={isOverdue ? "error.main" : "text.primary"}
          >
            {formatDate(project.endDate)}
          </Typography>
        </Box>
      </TableCell>

      {/* Actions */}
      <TableCell align="right">
        <IconButton size="small" onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleMenuClose}>Xem chi tiết</MenuItem>
          <MenuItem onClick={handleMenuClose}>Chỉnh sửa</MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
            Xóa
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

const ProjectRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton width="60%" height={24} />
    </TableCell>
    <TableCell>
      <Skeleton width={80} height={24} />
    </TableCell>
    <TableCell>
      <Skeleton width={60} height={24} />
    </TableCell>
    <TableCell>
      <Skeleton width="100%" height={24} />
    </TableCell>
    <TableCell>
      <Skeleton width={100} height={32} />
    </TableCell>
    <TableCell>
      <Skeleton width={80} height={32} />
    </TableCell>
    <TableCell>
      <Skeleton width={80} height={24} />
    </TableCell>
    <TableCell>
      <Skeleton width={24} height={24} />
    </TableCell>
  </TableRow>
);

function ProjectsList({
  projects,
  isLoading,
  total,
  currentPage,
  pageSize,
  onPageChangeAction,
  onProjectUpdateAction,
}: ProjectsListProps) {
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    onPageChangeAction((page - 1) * pageSize);
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Dự án</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Độ ưu tiên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tiến độ</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Người phụ trách</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Thành viên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hạn chót</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, index) => (
                  <ProjectRowSkeleton key={index} />
                ))
              : projects.map((project) => (
                  <ProjectRow
                    key={project._id}
                    project={project}
                    onUpdateAction={onProjectUpdateAction}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Không tìm thấy dự án nào
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Thử thay đổi bộ lọc hoặc tạo dự án mới
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ProjectsList;
