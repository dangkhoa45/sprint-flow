"use client";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { ToastMessage } from "../hooks/useToast";

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveAction: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemoveAction }: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => onRemoveAction(toast.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            top: `${24 + index * 70}px !important`,
          }}
        >
          <Alert
            onClose={() => onRemoveAction(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{
              width: "100%",
              minWidth: 300,
              boxShadow: (theme) => theme.shadows[6],
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
