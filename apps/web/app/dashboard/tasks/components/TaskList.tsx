"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Checkbox from "@mui/material/Checkbox";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CommentIcon from "@mui/icons-material/Comment";
import { Task, TaskStatus, TaskPriority } from "../types/task";

interface TaskListProps {
  filter?: string;
}

// Mock data - same as TaskBoard
const mockTasks = [
  {
    _id: "1",
    title: "Thiết kế giao diện đăng nhập",
    description: "Tạo giao diện đăng nhập theo mockup đã được approve",
    status: TaskStatus.TODO,
    priority: "HIGH",
    assignee: {
      _id: "user1",
      displayName: "Nguyễn Văn A",
      avatar: "",
      username: "nguyenvana",
      role: "Developer"
    },
    reporter: {
      _id: "user2",
      displayName: "Trần Thị B",
      avatar: "",
      username: "tranthib",
      role: "Manager"
    },
    project: {
      _id: "proj1",
      name: "Sprint Flow",
      key: "SF",
      color: "#10b981"
    },
    dueDate: new Date("2025-06-15"),
    createdAt: new Date("2025-06-08"),
    updatedAt: new Date("2025-06-08"),
    tags: ["UI/UX", "Frontend"],
    attachments: [],
    comments: [],
    estimatedHours: 8,
    loggedHours: 0,
    subtasks: []
  },
  {
    _id: "2",
    title: "API authentication",
    description: "Xây dựng API cho việc xác thực người dùng",
    status: TaskStatus.IN_PROGRESS,
    priority: "MEDIUM",
    assignee: {
      _id: "user3",
      displayName: "Lê Văn C",
      avatar: "",
      username: "levanc",
      role: "Backend Developer"
    },
    reporter: {
      _id: "user2",
      displayName: "Trần Thị B",
      avatar: "",
      username: "tranthib",
      role: "Manager"
    },
    project: {
      _id: "proj1",
      name: "Sprint Flow",
      key: "SF",
      color: "#10b981"
    },
    dueDate: new Date("2025-06-12"),
    createdAt: new Date("2025-06-05"),
    updatedAt: new Date("2025-06-08"),
    tags: ["Backend", "Security"],
    attachments: [],
    comments: [],
    estimatedHours: 12,
    loggedHours: 4,
    subtasks: []
  },
  {
    _id: "3",
    title: "Database schema design",
    description: "Thiết kế cơ sở dữ liệu cho hệ thống",
    status: TaskStatus.DONE,
    priority: "HIGH",
    assignee: {
      _id: "user3",
      displayName: "Lê Văn C",
      avatar: "",
      username: "levanc",
      role: "Backend Developer"
    },
    reporter: {
      _id: "user2",
      displayName: "Trần Thị B",
      avatar: "",
      username: "tranthib",
      role: "Manager"
    },
    project: {
      _id: "proj1",
      name: "Sprint Flow",
      key: "SF",
      color: "#10b981"
    },
    dueDate: new Date("2025-06-10"),
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2025-06-07"),
    tags: ["Database", "Architecture"],
    attachments: [],
    comments: [],
    estimatedHours: 16,
    loggedHours: 16,
    subtasks: []
  }
];

const statusConfig = {
  [TaskStatus.TODO]: { label: "Chưa bắt đầu", color: "#6b7280", bgColor: "#f9fafb" },
  [TaskStatus.IN_PROGRESS]: { label: "Đang thực hiện", color: "#2563eb", bgColor: "#eff6ff" },
  [TaskStatus.IN_REVIEW]: { label: "Đang xem xét", color: "#f59e0b", bgColor: "#fffbeb" },
  [TaskStatus.DONE]: { label: "Hoàn thành", color: "#059669", bgColor: "#f0fdf4" },
  [TaskStatus.BLOCKED]: { label: "Bị chặn", color: "#dc2626", bgColor: "#fef2f2" },
};

const priorityConfig = {
  [TaskPriority.LOWEST]: { label: "Thấp nhất", color: "#64748b", icon: "▼" },
  [TaskPriority.LOW]: { label: "Thấp", color: "#06b6d4", icon: "▼" },
  [TaskPriority.MEDIUM]: { label: "Trung bình", color: "#10b981", icon: "●" },
  [TaskPriority.HIGH]: { label: "Cao", color: "#f59e0b", icon: "▲" },
  [TaskPriority.HIGHEST]: { label: "Cao nhất", color: "#ef4444", icon: "▲▲" },
};

type Order = 'asc' | 'desc';
type OrderBy = 'title' | 'status' | 'priority' | 'assignee' | 'dueDate' | 'createdAt';

export default function TaskList({ filter }: TaskListProps) {
  const [tasks] = useState(mockTasks);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderBy>('createdAt');

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredTasks.map((task) => task._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === "assigned-to-me") {
      return task.assignee?._id === "user1";
    }
    if (filter === "created-by-me") {
      return task.reporter._id === "user1";
    }
    if (filter === "completed") {
      return task.status === TaskStatus.DONE;
    }
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue: any = a[orderBy];
    let bValue: any = b[orderBy];

    if (orderBy === 'assignee') {
      aValue = a.assignee?.displayName || '';
      bValue = b.assignee?.displayName || '';
    }

    if (orderBy === 'dueDate' || orderBy === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (order === 'desc') {
      return bValue > aValue ? 1 : -1;
    }
    return aValue > bValue ? 1 : -1;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const isOverdue = (date: Date) => new Date(date) < new Date();
  const isDueSoon = (date: Date) => {
    const now = new Date();
    const dueDate = new Date(date);
    return dueDate > now && dueDate <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < filteredTasks.length}
                  checked={filteredTasks.length > 0 && selected.length === filteredTasks.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleRequestSort('title')}
                >
                  Công việc
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Trạng thái
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={orderBy === 'priority' ? order : 'asc'}
                  onClick={() => handleRequestSort('priority')}
                >
                  Độ ưu tiên
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'assignee'}
                  direction={orderBy === 'assignee' ? order : 'asc'}
                  onClick={() => handleRequestSort('assignee')}
                >
                  Người thực hiện
                </TableSortLabel>
              </TableCell>
              <TableCell>Tiến độ</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'dueDate'}
                  direction={orderBy === 'dueDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('dueDate')}
                >
                  Hạn hoàn thành
                </TableSortLabel>
              </TableCell>
              <TableCell>Thông tin thêm</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTasks.map((task) => {
              const isItemSelected = isSelected(task._id);
              const status = statusConfig[task.status];
              const priority = priorityConfig[task.priority as TaskPriority] || priorityConfig[TaskPriority.MEDIUM];
              const progress = task.estimatedHours ? 
                Math.round((task.loggedHours || 0) / task.estimatedHours * 100) : 0;

              return (
                <TableRow
                  hover
                  onClick={() => handleClick(task._id)}
                  role="checkbox"
                  tabIndex={-1}
                  key={task._id}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                    />
                  </TableCell>
                  
                  {/* Task Info */}
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {task.project && (
                          <Chip
                            label={task.project.key}
                            size="small"
                            sx={{
                              backgroundColor: task.project.color + "20",
                              color: task.project.color,
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              height: 20,
                            }}
                          />
                        )}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {task.title}
                        </Typography>
                      </Box>
                      {task.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748b",
                            fontSize: "0.875rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {task.description}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        backgroundColor: status.bgColor,
                        color: status.color,
                        fontWeight: 600,
                        border: `1px solid ${status.color}30`,
                      }}
                    />
                  </TableCell>

                  {/* Priority */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        sx={{
                          color: priority.color,
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        {priority.icon}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: priority.color,
                          fontWeight: 500,
                        }}
                      >
                        {priority.label}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Assignee */}
                  <TableCell>
                    {task.assignee ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
                          src={task.assignee.avatar}
                        >
                          {task.assignee.displayName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2">
                          {task.assignee.displayName}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Chưa giao
                      </Typography>
                    )}
                  </TableCell>

                  {/* Progress */}
                  <TableCell>
                    {task.estimatedHours ? (
                      <Box sx={{ width: 100 }}>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {task.loggedHours || 0}/{task.estimatedHours}h ({progress}%)
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(progress, 100)}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: "#e2e8f0",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: progress >= 100 ? "#10b981" : "#3b82f6",
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Chưa ước lượng
                      </Typography>
                    )}
                  </TableCell>

                  {/* Due Date */}
                  <TableCell>
                    {task.dueDate ? (
                      <Typography
                        variant="body2"
                        sx={{
                          color: isOverdue(task.dueDate) 
                            ? "#dc2626" 
                            : isDueSoon(task.dueDate) 
                            ? "#f59e0b" 
                            : "#64748b",
                          fontWeight: isOverdue(task.dueDate) || isDueSoon(task.dueDate) ? 600 : 400,
                        }}
                      >
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && " (Quá hạn)"}
                        {isDueSoon(task.dueDate) && " (Sắp hết hạn)"}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Không có hạn
                      </Typography>
                    )}
                  </TableCell>

                  {/* Metadata */}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {task.attachments && task.attachments.length > 0 && (
                        <Tooltip title={`${task.attachments.length} tệp đính kèm`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AttachFileIcon sx={{ fontSize: 16, color: "#64748b" }} />
                            <Typography variant="caption" sx={{ color: "#64748b" }}>
                              {task.attachments.length}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
                      {task.comments && task.comments.length > 0 && (
                        <Tooltip title={`${task.comments.length} bình luận`}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CommentIcon sx={{ fontSize: 16, color: "#64748b" }} />
                            <Typography variant="caption" sx={{ color: "#64748b" }}>
                              {task.comments.length}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
