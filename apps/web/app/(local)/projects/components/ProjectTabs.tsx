"use client";
import { Attachment } from "@/types/attachment";
import { Milestone } from "@/types/milestone";
import { Project } from "@/types/project";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import AttachmentList from "./AttachmentList";
import FileUpload from "./FileUpload";
import MilestoneList from "./MilestoneList";
import MilestoneTimeline from "./MilestoneTimeline";
import ProjectOverview from "./ProjectOverview";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `project-tab-${index}`,
    "aria-controls": `project-tabpanel-${index}`,
  };
}

interface ProjectTabsProps {
  project: Project;
  milestones: Milestone[];
  attachments: Attachment[];
  projectId: string;
  onDataRefresh: () => void;
}

const TABS = ["overview", "milestones", "timeline", "files"];

export default function ProjectTabs({
  project,
  milestones,
  attachments,
  projectId,
  onDataRefresh,
}: ProjectTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const tabValue = TABS.indexOf(currentTab) !== -1 ? TABS.indexOf(currentTab) : 0;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const newTab = TABS[newValue];
    const params = new URLSearchParams(searchParams);
    params.set("tab", newTab);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'transparent', border: 'none' }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="project tabs"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "primary.main",
              height: 2,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: '0.8rem',
              color: 'text.secondary',
              "&.Mui-selected": {
                color: "text.primary",
                fontWeight: 600,
              },
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tổng quan" {...a11yProps(0)} />
          <Tab label="Mốc công việc" {...a11yProps(1)} />
          <Tab label="Dòng thời gian" {...a11yProps(2)} />
          <Tab label="Tệp" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <ProjectOverview
          project={project}
          milestones={milestones}
          attachments={attachments}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <MilestoneList
          projectId={projectId}
          milestones={milestones}
          mutate={onDataRefresh}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <MilestoneTimeline milestones={milestones} />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12}}>
            <FileUpload
              projectId={projectId}
              onUploadSuccess={onDataRefresh}
              maxFileSize={100 * 1024 * 1024} 
              acceptedTypes={["*/*"]}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <AttachmentList
              attachments={attachments}
              mutate={onDataRefresh}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </Card>
  );
} 