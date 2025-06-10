"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TasksByTimeReport from "../components/TasksByTimeReport";

export default function TasksByTimeReportPage() {
  return (
    <Card
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        minHeight: "calc(100vh - 160px)",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <TasksByTimeReport />
      </CardContent>
    </Card>
  );
}
