"use client";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreIcon from "@mui/icons-material/Restore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export default function ArchivedProjectsPage() {
  const theme = useTheme();

  const archivedProjects = [
    {
      id: "archived1",
      name: "Website cũ",
      description: "Website phiên bản cũ đã được thay thế",
      archivedDate: "2024-01-15",
      status: "Completed",
      reason: "Đã hoàn thành và thay thế",
    },
    {
      id: "archived2",
      name: "Dự án thí điểm",
      description: "Dự án thí nghiệm cho công nghệ mới",
      archivedDate: "2023-12-20",
      status: "Cancelled",
      reason: "Thay đổi chiến lược công ty",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "#10b981";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Completed":
        return "Đã hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
          Dự án đã lưu trữ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Các dự án đã hoàn thành hoặc không còn hoạt động
        </Typography>
      </Box>

      <Card
        sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ArchiveIcon
            sx={{ color: theme.palette.text.secondary, fontSize: 40 }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Lưu trữ dự án
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Các dự án đã lưu trữ không hiển thị trong danh sách chính nhưng
              vẫn có thể được khôi phục hoặc xóa vĩnh viễn.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {archivedProjects.length === 0 ? (
        <Card
          sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
        >
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <ArchiveIcon
              sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Chưa có dự án nào được lưu trữ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Các dự án đã hoàn thành hoặc bị hủy sẽ xuất hiện ở đây
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {archivedProjects.map((project) => (
            <Card
              key={project.id}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {project.name}
                      </Typography>
                      <Chip
                        label={getStatusText(project.status)}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(
                            project.status
                          )}15`,
                          color: getStatusColor(project.status),
                          fontWeight: 500,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {project.description}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Lưu trữ ngày:{" "}
                      {new Date(project.archivedDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </Typography>

                    {project.reason && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        Lý do: {project.reason}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RestoreIcon />}
                      sx={{ textTransform: "none" }}
                    >
                      Khôi phục
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DeleteForeverIcon />}
                      color="error"
                      sx={{ textTransform: "none" }}
                    >
                      Xóa vĩnh viễn
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
