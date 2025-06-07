"use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { TaskViewMode } from "../types/task";
import TaskBoard from "./TaskBoard";
import TaskFilter from "./TaskFilter";
import TaskHeader from "./TaskHeader";
import TaskList from "./TaskList";
import TaskStats from "./TaskStats";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TaskManagement() {
  const [viewMode, setViewMode] = useState<TaskViewMode>("board");
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 3,
      }}
    >
      <Container maxWidth={false}>
        <TaskHeader viewMode={viewMode} setViewModeAction={setViewMode} />

        <TaskStats />

        <TaskFilter />

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minHeight: "48px",
              },
              "& .Mui-selected": {
                color: "#1976d2",
              },
            }}
          >
            <Tab label="Tất cả công việc" />
            <Tab label="Được giao cho tôi" />
            <Tab label="Do tôi tạo" />
            <Tab label="Đã hoàn thành" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          {viewMode === "board" ? <TaskBoard /> : <TaskList />}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {viewMode === "board" ? (
            <TaskBoard filter="assigned-to-me" />
          ) : (
            <TaskList filter="assigned-to-me" />
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {viewMode === "board" ? (
            <TaskBoard filter="created-by-me" />
          ) : (
            <TaskList filter="created-by-me" />
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {viewMode === "board" ? (
            <TaskBoard filter="completed" />
          ) : (
            <TaskList filter="completed" />
          )}
        </TabPanel>
      </Container>
    </Box>
  );
}
