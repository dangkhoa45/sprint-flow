"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ReportWrapper from "./common/ReportWrapper";

interface ResourceData {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  capacity: number; // hours per week
  allocated: number; // currently allocated hours
  utilization: number; // percentage
  skills: string[];
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  efficiency: number;
  availability: 'available' | 'busy' | 'overloaded';
}

interface ProjectResourceData {
  projectName: string;
  totalHours: number;
  allocatedHours: number;
  remainingHours: number;
  teamSize: number;
  progress: number;
  budget: number;
  spentBudget: number;
}

interface SkillData {
  skill: string;
  demandCount: number;
  supplyCount: number;
  gap: number;
  avgExperience: number;
}

// Mock data generation
const generateResourceData = (): ResourceData[] => {
  const roles = ["Frontend Developer", "Backend Developer", "DevOps Engineer", "UI/UX Designer", "QA Engineer", "Product Manager"];
  const skills = ["React", "Node.js", "Python", "Docker", "AWS", "TypeScript", "GraphQL", "MongoDB", "PostgreSQL", "Figma"];
  
  return Array.from({ length: 12 }, (_, index) => {
    const capacity = 40; // 40 hours per week standard
    const allocated = Math.floor(Math.random() * 50) + 10; // 10-60 hours
    const utilization = (allocated / capacity) * 100;
    
    return {
      id: `res${index + 1}`,
      name: `Nhân viên ${String.fromCharCode(65 + index)}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      capacity,
      allocated,
      utilization: Math.min(utilization, 150), // Cap at 150%
      skills: skills.slice(0, Math.floor(Math.random() * 4) + 2),
      activeProjects: Math.floor(Math.random() * 3) + 1,
      totalTasks: Math.floor(Math.random() * 15) + 5,
      completedTasks: Math.floor(Math.random() * 12) + 3,
      efficiency: Math.floor(Math.random() * 30) + 70,
      availability: utilization > 100 ? 'overloaded' : utilization > 80 ? 'busy' : 'available',
    };
  });
};

const generateProjectResourceData = (): ProjectResourceData[] => {
  return [
    {
      projectName: "SprintFlow Mobile",
      totalHours: 480,
      allocatedHours: 350,
      remainingHours: 130,
      teamSize: 6,
      progress: 73,
      budget: 50000,
      spentBudget: 36500,
    },
    {
      projectName: "Website Redesign",
      totalHours: 320,
      allocatedHours: 280,
      remainingHours: 40,
      teamSize: 4,
      progress: 88,
      budget: 30000,
      spentBudget: 26400,
    },
    {
      projectName: "API Integration",
      totalHours: 200,
      allocatedHours: 160,
      remainingHours: 40,
      teamSize: 3,
      progress: 80,
      budget: 25000,
      spentBudget: 20000,
    },
  ];
};

const generateSkillData = (): SkillData[] => {
  const skills = ["React", "Node.js", "Python", "Docker", "AWS", "TypeScript", "GraphQL", "MongoDB"];
  
  return skills.map(skill => {
    const demandCount = Math.floor(Math.random() * 15) + 5;
    const supplyCount = Math.floor(Math.random() * 12) + 3;
    const gap = demandCount - supplyCount;
    
    return {
      skill,
      demandCount,
      supplyCount,
      gap,
      avgExperience: Math.floor(Math.random() * 3) + 2, // 2-5 years
    };
  });
};

const availabilityColors = {
  available: "#10b981",
  busy: "#f59e0b", 
  overloaded: "#ef4444",
};

const availabilityLabels = {
  available: "Có thể làm thêm",
  busy: "Bận",
  overloaded: "Quá tải",
};

export default function ResourceAllocationReport() {
  const [viewMode, setViewMode] = useState<"overview" | "skills" | "projects">("overview");
  const [filter, setFilter] = useState("all");
  const [resources] = useState<ResourceData[]>(generateResourceData());
  const [projectResources] = useState<ProjectResourceData[]>(generateProjectResourceData());
  const [skillsData] = useState<SkillData[]>(generateSkillData());

  const summaryStats = {
    totalResources: resources.length,
    averageUtilization: resources.reduce((sum, res) => sum + res.utilization, 0) / resources.length,
    overloadedCount: resources.filter(res => res.availability === 'overloaded').length,
    availableCount: resources.filter(res => res.availability === 'available').length,
    totalCapacity: resources.reduce((sum, res) => sum + res.capacity, 0),
    totalAllocated: resources.reduce((sum, res) => sum + res.allocated, 0),
  };

  const utilizationDistribution = Object.entries(
    resources.reduce((acc, res) => {
      acc[res.availability] = (acc[res.availability] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([availability, count]) => ({
    name: availabilityLabels[availability as keyof typeof availabilityLabels],
    value: count,
    color: availabilityColors[availability as keyof typeof availabilityColors],
  }));

  const chartData = resources.map(res => ({
    name: res.name.split(" ")[1], // Just the letter
    capacity: res.capacity,
    allocated: res.allocated,
    utilization: res.utilization,
    efficiency: res.efficiency,
  }));

  const skillGapData = skillsData.map(skill => ({
    skill: skill.skill,
    demand: skill.demandCount,
    supply: skill.supplyCount,
    gap: Math.abs(skill.gap),
    shortage: skill.gap > 0,
  }));

  return (
    <ReportWrapper
      title="Phân bổ nguồn lực"
      description="Quản lý và tối ưu hóa việc phân bổ nhân lực trong các dự án"
      actions={
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Chế độ xem</InputLabel>
            <Select
              value={viewMode}
              label="Chế độ xem"
              onChange={(e) => setViewMode(e.target.value as "overview" | "skills" | "projects")}
            >
              <MenuItem value="overview">Tổng quan</MenuItem>
              <MenuItem value="skills">Kỹ năng</MenuItem>
              <MenuItem value="projects">Dự án</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Bộ lọc</InputLabel>
            <Select
              value={filter}
              label="Bộ lọc"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="available">Có sẵn</MenuItem>
              <MenuItem value="busy">Đang bận</MenuItem>
              <MenuItem value="overloaded">Quá tải</MenuItem>
            </Select>
          </FormControl>
        </Box>
      }
    >
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #3b82f620, #3b82f610)",
              border: "1px solid #3b82f630",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#3b82f6", mb: 1 }}
              >
                {summaryStats.totalResources}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Tổng nhân lực
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #10b98120, #10b98110)",
              border: "1px solid #10b98130",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#10b981", mb: 1 }}
              >
                {summaryStats.averageUtilization.toFixed(0)}%
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Mức sử dụng TB
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #f59e0b20, #f59e0b10)",
              border: "1px solid #f59e0b30",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#f59e0b", mb: 1 }}
              >
                {summaryStats.availableCount}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Có thể làm thêm
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #ef444420, #ef444410)",
              border: "1px solid #ef444430",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "#ef4444", mb: 1 }}
              >
                {summaryStats.overloadedCount}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Quá tải
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {viewMode === "overview" && (
        <Grid container spacing={3}>
          {/* Resource Utilization Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                height: 450,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 3, color: "#1e293b" }}
              >
                Mức độ sử dụng nhân lực
              </Typography>
              
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="capacity" 
                    fill="#e2e8f0" 
                    name="Năng lực (h/tuần)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="allocated" 
                    fill="#3b82f6" 
                    name="Đã phân bổ (h/tuần)"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Availability Distribution */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                height: 450,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 3, color: "#1e293b" }}
              >
                Phân bổ tình trạng
              </Typography>
              
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={utilizationDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {utilizationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <Box sx={{ mt: 2 }}>
                {utilizationDistribution.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: item.color,
                          borderRadius: "50%",
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Team Members List */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1e293b" }}
                >
                  Chi tiết phân bổ theo thành viên
                </Typography>
              </Box>
              
              <Box sx={{ maxHeight: 600, overflowY: "auto" }}>
                {resources.map((resource, index) => (
                  <Box
                    key={resource.id}
                    sx={{
                      p: 3,
                      borderBottom: index < resources.length - 1 ? "1px solid #f1f5f9" : "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "#f8fafc",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 2,
                          bgcolor: `hsl(${(resource.name.charCodeAt(0) * 137.5) % 360}, 70%, 50%)`,
                          fontSize: "1.2rem",
                          fontWeight: 600,
                        }}
                      >
                        {resource.name.split(" ")[1]}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: "#1e293b" }}
                          >
                            {resource.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={availabilityLabels[resource.availability]}
                            sx={{
                              backgroundColor: `${availabilityColors[resource.availability]}20`,
                              color: availabilityColors[resource.availability],
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#64748b" }}
                          >
                            {resource.role}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 1 }}>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Phân bổ: <strong>{resource.allocated}h</strong>/{resource.capacity}h
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Dự án: <strong>{resource.activeProjects}</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Hiệu suất: <strong>{resource.efficiency}%</strong>
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                          {resource.skills.slice(0, 3).map((skill, skillIndex) => (
                            <Chip
                              key={skillIndex}
                              label={skill}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem", height: 20 }}
                            />
                          ))}
                          {resource.skills.length > 3 && (
                            <Chip
                              label={`+${resource.skills.length - 3}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem", height: 20 }}
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ textAlign: "right", minWidth: 80 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: resource.utilization > 100 ? "#ef4444" : 
                                   resource.utilization > 80 ? "#f59e0b" : "#10b981",
                            mb: 0.5,
                          }}
                        >
                          {resource.utilization.toFixed(0)}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          Sử dụng
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Progress bar */}
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(resource.utilization, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: resource.utilization > 100 ? "#ef4444" : 
                                         resource.utilization > 80 ? "#f59e0b" : "#10b981",
                          borderRadius: 4,
                        },
                      }}
                    />
                    {resource.utilization > 100 && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#ef4444", mt: 0.5, display: "block" }}
                      >
                        Vượt năng lực {(resource.utilization - 100).toFixed(0)}%
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {viewMode === "skills" && (
        <Grid container spacing={3}>
          {/* Skills Gap Analysis */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                height: 450,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 3, color: "#1e293b" }}
              >
                Phân tích khoảng cách kỹ năng
              </Typography>
              
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={skillGapData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="skill" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="demand" fill="#ef4444" name="Nhu cầu" />
                  <Bar dataKey="supply" fill="#10b981" name="Nguồn cung" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {viewMode === "projects" && (
        <Grid container spacing={3}>
          {/* Project Resource Allocation */}
          {projectResources.map((project, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2, color: "#1e293b" }}
                  >
                    {project.projectName}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                        Tiến độ
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {project.progress}%
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                        Thành viên
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {project.teamSize}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5 }}>
                      Phân bổ giờ: {project.allocatedHours}h / {project.totalHours}h
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(project.allocatedHours / project.totalHours) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#3b82f6",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5 }}>
                      Ngân sách: ${project.spentBudget.toLocaleString()} / ${project.budget.toLocaleString()}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(project.spentBudget / project.budget) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#10b981",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </ReportWrapper>
  );
}
