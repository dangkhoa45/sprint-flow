"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowsProp,
} from "@mui/x-data-grid";
import { Project } from "../../../types/project";
import {
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
} from "../../../utils/projectHelpers";

interface ProjectTableConfigProps {
  theme: Theme;
  onViewAction: (id: string) => void;
  onEditAction: (id: string) => void;
  onDeleteAction: (id: string) => void;
}

export const useProjectTableConfig = ({
  theme,
  onViewAction,
  onEditAction,
  onDeleteAction,
}: ProjectTableConfigProps) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Tên dự án",
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {params.row.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.875rem" }}
          >
            {params.row.description}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 0.8,
      minWidth: 140,
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
      flex: 0.7,
      minWidth: 130,
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
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}
        >
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
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={params.value.avatar} sx={{ width: 32, height: 32 }}>
            {params.value.displayName.charAt(0)}
          </Avatar>
          <Typography variant="body2">{params.value.displayName}</Typography>
        </Box>
      ),
    },
    {
      field: "members",
      headerName: "Thành viên",
      flex: 0.8,
      minWidth: 120,
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
            <Avatar
              key={member._id}
              alt={member.displayName}
              src={member.avatar}
            >
              {member.displayName.charAt(0)}
            </Avatar>
          ))}
        </AvatarGroup>
      ),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value
            ? new Date(params.value).toLocaleDateString("vi-VN")
            : "-"}
        </Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Thao tác",
      flex: 0.8,
      minWidth: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<VisibilityIcon />}
          label="Xem chi tiết"
          onClick={() => onViewAction(params.id as string)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Chỉnh sửa"
          onClick={() => onEditAction(params.id as string)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => onDeleteAction(params.id as string)}
        />,
      ],
    },
  ];

  const mapProjectsToRows = (projects: Project[]): GridRowsProp => {
    return projects.map((project) => ({
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
  };

  return {
    columns,
    mapProjectsToRows,
  };
};
