"use client";
import WarningIcon from "@mui/icons-material/Warning";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { TimelineEvent } from "../../../../types/timeline";

interface DeleteTimelineEventDialogProps {
  open: boolean;
  event: TimelineEvent | null;
  onCloseAction: () => void;
  onConfirmAction: (eventId: string) => void;
  loading?: boolean;
}

export default function DeleteTimelineEventDialog({
  open,
  event,
  onCloseAction,
  onConfirmAction,
  loading = false,
}: DeleteTimelineEventDialogProps) {
  const handleConfirm = () => {
    if (event) {
      onConfirmAction(event._id);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onCloseAction();
    }
  };

  if (!event) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 3,
          color: "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 2,
            background: "rgba(244, 67, 54, 0.1)",
            color: "#f44336",
          }}
        >
          <WarningIcon />
        </Box>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          Xác nhận xóa sự kiện
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Warning Message */}
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6 }}
          >
            Bạn có chắc chắn muốn xóa sự kiện này không? Hành động này không thể hoàn tác.
          </Typography>

          {/* Event Details */}
          <Box
            sx={{
              p: 3,
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              borderRadius: 2,
              border: "1px solid rgba(244, 67, 54, 0.3)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: "#f44336", fontWeight: 600, mb: 2 }}
            >
              Thông tin sự kiện sẽ bị xóa:
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 80 }}
                >
                  Tiêu đề:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: 500 }}
                >
                  {event.title}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 80 }}
                >
                  Mô tả:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: 500 }}
                >
                  {event.description}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 80 }}
                >
                  Tạo bởi:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: 500 }}
                >
                  {event.user.displayName}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 80 }}
                >
                  Tạo lúc:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: 500 }}
                >
                  {event.createdAt.toLocaleString('vi-VN')}
                </Typography>
              </Box>

              {event.project && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 80 }}
                  >
                    Dự án:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "white", fontWeight: 500 }}
                  >
                    {event.project.name}
                  </Typography>
                </Box>
              )}

              {event.task && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 80 }}
                  >
                    Task:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "white", fontWeight: 500 }}
                  >
                    {event.task.title}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Additional Warning */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "rgba(255, 193, 7, 0.1)",
              borderRadius: 2,
              border: "1px solid rgba(255, 193, 7, 0.3)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#ffc107",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <WarningIcon fontSize="small" />
              Lưu ý: Sau khi xóa, bạn sẽ không thể khôi phục sự kiện này.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            borderColor: "rgba(255, 255, 255, 0.3)",
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.5)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #f44336, #e53935)",
            "&:hover": {
              background: "linear-gradient(45deg, #d32f2f, #c62828)",
            },
            "&:disabled": {
              background: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          {loading ? "Đang xóa..." : "Xóa sự kiện"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
