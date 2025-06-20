"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import LinearProgress from "@mui/material/LinearProgress";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef, GridRowsProp, GridActionsCellItem } from "@mui/x-data-grid";
import { Project, ProjectStatus, ProjectPriority } from "../../../../types/project";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ProjectListProps {
  searchQuery: string;
}

const mockProjects: Project[] = [
  {
    _id: "1",
    name: "Nền tảng Thương mại điện tử",
    description: "Xây dựng hệ thống thương mại điện tử hiện đại với React và Node.js",
    status: ProjectStatus.InProgress,
    priority: ProjectPriority.High,
    progress: 75,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    owner: {
      _id: "user1",
      displayName: "Nguyễn Văn A",
      username: "nguyenvana",
      role: "Admin" as any,
      status: "Active" as any,
      avatar: "/avatars/user1.jpg"
    },
    members: [
      { _id: "user2", displayName: "Trần Thị B", username: "tranthib", role: "User" as any, status: "Active" as any },
      { _id: "user3", displayName: "Lê Văn C", username: "levanc", role: "User" as any, status: "Active" as any }
    ],
    actualHours: 320,
    actualCost: 0,
    tags: ["React", "Node.js", "MongoDB"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15"
  },
  {
    _id: "2",
    name: "Ứng dụng di động iOS",
    description: "Phát triển ứng dụng mobile native cho iOS",
    status: ProjectStatus.Planning,
    priority: ProjectPriority.Medium,
    progress: 25,
    startDate: "2024-02-01",
    endDate: "2024-08-30",
    owner: {
      _id: "user2",
      displayName: "Trần Thị B",
      username: "tranthib",
      role: "User" as any,
      status: "Active" as any,
      avatar: "/avatars/user2.jpg"
    },
    members: [
      { _id: "user1", displayName: "Nguyễn Văn A", username: "nguyenvana", role: "Admin" as any, status: "Active" as any }
    ],
    actualHours: 80,
    actualCost: 0,
    tags: ["iOS", "Swift", "Mobile"],
    createdAt: "2024-01-15",
    updatedAt: "2024-02-01"
  },
  {
    _id: "3",
    name: "Hệ thống CRM",
    description: "Xây dựng hệ thống quản lý khách hàng tích hợp AI",
    status: ProjectStatus.Completed,
    priority: ProjectPriority.Critical,
    progress: 100,
    startDate: "2023-10-01",
    endDate: "2024-01-31",
    owner: {
      _id: "user3",
      displayName: "Lê Văn C",
      username: "levanc",
      role: "User" as any,
      status: "Active" as any,
      avatar: "/avatars/user3.jpg"
    },
    members: [
      { _id: "user1", displayName: "Nguyễn Văn A", username: "nguyenvana", role: "Admin" as any, status: "Active" as any },
      { _id: "user2", displayName: "Trần Thị B", username: "tranthib", role: "User" as any, status: "Active" as any }
    ],
    actualHours: 640,
    actualCost: 0,
    tags: ["CRM", "AI", "Python"],
    createdAt: "2023-10-01",
    updatedAt: "2024-01-31"
  }
];

const ProjectList = ({ searchQuery }: ProjectListProps) => {
  const theme = useTheme();

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return "#f59e0b";
      case ProjectStatus.InProgress:
        return "#10b981";
      case ProjectStatus.OnHold:
        return "#f97316";
      case ProjectStatus.Completed:
        return "#6366f1";
      case ProjectStatus.Cancelled:
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const getStatusText = (status: ProjectStatus) => {
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

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Low:
        return "#10b981";
      case ProjectPriority.Medium:
        return "#f59e0b";
      case ProjectPriority.High:
        return "#f97316";
      case ProjectPriority.Critical:
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const getPriorityText = (priority: ProjectPriority) => {
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

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (id: string) => {
    console.log("Xem chi tiết dự án:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Chỉnh sửa dự án:", id);
  };

  const handleCopy = (id: string) => {
    console.log("Sao chép dự án:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Xóa dự án:", id);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Tên dự án",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {params.row.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
            {params.row.description}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={getStatusText(params.value)}
          size="small"
          sx={{
            backgroundColor: `${getStatusColor(params.value)}15`,
            color: getStatusColor(params.value),
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "priority",
      headerName: "Độ ưu tiên",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={getPriorityText(params.value)}
          size="small"
          sx={{
            backgroundColor: `${getPriorityColor(params.value)}15`,
            color: getPriorityColor(params.value),
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "progress",
      headerName: "Tiến độ",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
          <LinearProgress
            variant="determinate"
            value={params.value}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: `${getStatusColor(params.row.status)}15`,
              "& .MuiLinearProgress-bar": {
                backgroundColor: getStatusColor(params.row.status),
                borderRadius: 3,
              },
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 35 }}>
            {params.value}%
          </Typography>
        </Box>
      ),
    },
    {
      field: "owner",
      headerName: "Chủ sở hữu",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={params.value.avatar}
            sx={{ width: 32, height: 32 }}
          >
            {params.value.displayName.charAt(0)}
          </Avatar>
          <Typography variant="body2">
            {params.value.displayName}
          </Typography>
        </Box>
      ),
    },
    {
      field: "members",
      headerName: "Thành viên",
      width: 150,
      renderCell: (params) => (
        <AvatarGroup
          max={3}
          sx={{
            "& .MuiAvatar-root": {
              width: 28,
              height: 28,
              fontSize: "0.75rem",
              border: `2px solid ${theme.palette.background.paper}`,
            },
          }}
        >
          {params.value.map((member: any) => (
            <Avatar key={member._id} alt={member.displayName} src={member.avatar}>
              {member.displayName.charAt(0)}
            </Avatar>
          ))}
        </AvatarGroup>
      ),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString("vi-VN") : "-"}
        </Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Thao tác",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<VisibilityIcon />}
          label="Xem chi tiết"
          onClick={() => handleView(params.id as string)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Chỉnh sửa"
          onClick={() => handleEdit(params.id as string)}
        />,
        <GridActionsCellItem
          key="copy"
          icon={<ContentCopyIcon />}
          label="Sao chép"
          onClick={() => handleCopy(params.id as string)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleDelete(params.id as string)}
        />,
      ],
    },
  ];

  const rows: GridRowsProp = filteredProjects.map((project) => ({
    id: project._id,
    name: project.name,
    description: project.description,
    status: project.status,
    priority: project.priority,
    progress: project.progress,
    owner: project.owner,
    members: project.members,
    endDate: project.endDate,
  }));

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        checkboxSelection
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          "& .MuiDataGrid-cell": {
            py: 1.5,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-row": {
            minHeight: "70px !important",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.grey[50],
            borderRadius: `8px 8px 0 0`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            "& .MuiDataGrid-columnHeader": {
              fontWeight: 600,
            },
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${theme.palette.divider}`,
            borderRadius: `0 0 8px 8px`,
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-row:focus": {
            outline: "none",
          },
        }}
      />
    </Box>
  );
};

export default ProjectList;
