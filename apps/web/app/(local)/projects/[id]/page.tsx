"use client";
import { attachmentsApi } from "@/api/attachments";
import { milestonesApi } from "@/api/milestones";
import { projectsApi } from "@/api/projects";
import { useToast } from "@/hooks/useToast";
import { Attachment } from "@/types/attachment";
import { Milestone } from "@/types/milestone";
import { Project } from "@/types/project";
import { getProjectStatusColor, getProjectStatusText } from "@/utils/projectHelpers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditIcon from "@mui/icons-material/Edit";
import FlagIcon from "@mui/icons-material/Flag";
import GroupIcon from "@mui/icons-material/Group";
import InfoIcon from "@mui/icons-material/Info";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AttachmentList from "../components/AttachmentList";
import CreateProjectDialog from "../components/CreateProjectDialog";
import FileUpload from "../components/FileUpload";
import MilestoneList from "../components/MilestoneList";
import MilestoneTimeline from "../components/MilestoneTimeline";

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
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `project-tab-${index}`,
    'aria-controls': `project-tabpanel-${index}`,
  };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: toastError } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const projectId = params.id as string;

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, milestonesData, attachmentsData] = await Promise.all([
        projectsApi.getProject(projectId),
        milestonesApi.getProjectMilestones(projectId),
        attachmentsApi.getProjectAttachments(projectId),
      ]);
      
      setProject(projectData);
      setMilestones(milestonesData);
      setAttachments(attachmentsData);
    } catch (err: any) {
      toastError(err.message || "Không thể tải thông tin project");
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditProject = () => {
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    fetchProjectData();
    setEditDialogOpen(false);
    success("Cập nhật project thành công!");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa có";
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Không tìm thấy project</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="/projects"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={(e) => {
            e.preventDefault();
            router.push('/projects');
          }}
        >
          <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="small" />
          Projects
        </Link>
        <Typography color="text.primary">{project.name}</Typography>
      </Breadcrumbs>

      {/* Project Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12} lg={8}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                  {project.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={getProjectStatusText(project.status)}
                    color={getProjectStatusColor(project.status) as any}
                    size="small"
                  />
                  <Chip
                    label={project.priority}
                    variant="outlined"
                    size="small"
                    icon={<FlagIcon />}
                  />
                </Box>
              </Box>

              {project.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {project.description}
                </Typography>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ScheduleIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Thời gian:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <GroupIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Thành viên:
                    </Typography>
                    <Typography variant="body2">
                      {project.members?.length || 0} người
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <InfoIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Tiến độ:
                    </Typography>
                    <Typography variant="body2">
                      {project.progress}%
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AttachFileIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Chi phí:
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(project.actualCost)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {project.tags && project.tags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tags:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {project.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', lg: 'flex-end' } }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditProject}
                  size="large"
                >
                  Chỉnh sửa
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="project tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tổng quan" {...a11yProps(0)} />
          <Tab label="Milestones" {...a11yProps(1)} />
          <Tab label="Timeline" {...a11yProps(2)} />
          <Tab label="Files" {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thông tin chi tiết
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chủ sở hữu:
                    </Typography>
                    <Typography variant="body2">
                      {project.owner?.displayName || project.owner?.username}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Giờ ước tính:
                    </Typography>
                    <Typography variant="body2">
                      {project.estimatedHours || 0} giờ
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Giờ thực tế:
                    </Typography>
                    <Typography variant="body2">
                      {project.actualHours} giờ
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ngày tạo:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(project.createdAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thống kê
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Milestones:
                    </Typography>
                    <Typography variant="body2">
                      {milestones.length}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Files:
                    </Typography>
                    <Typography variant="body2">
                      {attachments.length}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Thành viên:
                    </Typography>
                    <Typography variant="body2">
                      {project.members?.length || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tiến độ
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Hoàn thành
                      </Typography>
                      <Typography variant="body2">
                        {project.progress}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        backgroundColor: 'grey.200',
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          width: `${project.progress}%`,
                          height: '100%',
                          backgroundColor: 'primary.main',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ngày bắt đầu:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(project.startDate)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ngày kết thúc:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(project.endDate)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MilestoneList
            projectId={projectId}
            milestones={milestones}
            mutate={fetchProjectData}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <MilestoneTimeline milestones={milestones} />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <FileUpload
                projectId={projectId}
                onUploadSuccess={fetchProjectData}
                maxFileSize={10 * 1024 * 1024} // 10MB
                acceptedTypes={['*/*']}
              />
            </Grid>
            <Grid item xs={12} lg={8}>
              <AttachmentList
                attachments={attachments}
                mutate={fetchProjectData}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Edit Project Dialog */}
      {project && (
        <CreateProjectDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          mode="edit"
          project={project}
          onSuccess={handleEditSuccess}
        />
      )}
    </Container>
  );
} 