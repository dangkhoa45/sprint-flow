import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
interface LoadingProps {
  loadingPage?: boolean;
}
function LoadingComponent({ loadingPage }: LoadingProps) {
  return (
    <Box
      sx={{
        position: !loadingPage ? "absolute" : "",
        width: 1,
        height: loadingPage ? "100vh" : 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
      <Typography
        variant="caption"
        mt={3}
        mb={5}
      >
        Đang tải...
      </Typography>
    </Box>
  );
}

export default LoadingComponent;
