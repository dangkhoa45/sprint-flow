"use client";

import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReportWrapper from "./common/ReportWrapper";
interface RelatedPerson {
  id: string;
  name: string;
  avatar?: string;
  role: "reporter" | "stakeholder" | "reviewer" | "approver";
  tasksCount: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  completionRate: number;
}

interface TaskRelationData {
  relationshipType: string;
  count: number;
  color: string;
}

const TasksByRelatedPersonReport: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<string>("all");
  const [viewType, setViewType] = useState<"overview" | "detailed">("overview");

  // Mock data for related persons
  const relatedPersons: RelatedPerson[] = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "/avatars/alice.jpg",
      role: "reporter",
      tasksCount: 25,
      completedTasks: 18,
      inProgressTasks: 5,
      pendingTasks: 2,
      completionRate: 72,
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "/avatars/bob.jpg",
      role: "stakeholder",
      tasksCount: 12,
      completedTasks: 8,
      inProgressTasks: 3,
      pendingTasks: 1,
      completionRate: 67,
    },
    {
      id: "3",
      name: "Carol Davis",
      avatar: "/avatars/carol.jpg",
      role: "reviewer",
      tasksCount: 18,
      completedTasks: 15,
      inProgressTasks: 2,
      pendingTasks: 1,
      completionRate: 83,
    },
    {
      id: "4",
      name: "David Wilson",
      avatar: "/avatars/david.jpg",
      role: "approver",
      tasksCount: 8,
      completedTasks: 6,
      inProgressTasks: 1,
      pendingTasks: 1,
      completionRate: 75,
    },
  ];

  const relationshipData: TaskRelationData[] = [
    { relationshipType: "Reporter", count: 25, color: "#8884d8" },
    { relationshipType: "Stakeholder", count: 12, color: "#82ca9d" },
    { relationshipType: "Reviewer", count: 18, color: "#ffc658" },
    { relationshipType: "Approver", count: 8, color: "#ff7300" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "reporter":
        return "#1976d2";
      case "stakeholder":
        return "#388e3c";
      case "reviewer":
        return "#f57c00";
      case "approver":
        return "#d32f2f";
      default:
        return "#757575";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "reporter":
        return <AssignmentIcon />;
      case "stakeholder":
        return <BusinessIcon />;
      case "reviewer":
        return <PersonIcon />;
      case "approver":
        return <TrendingUpIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const totalTasks = relatedPersons.reduce(
    (sum, person) => sum + person.tasksCount,
    0
  );
  const avgCompletionRate =
    relatedPersons.reduce((sum, person) => sum + person.completionRate, 0) /
    relatedPersons.length;

  return (
    <ReportWrapper
      title="Tasks by Related Person"
      description="Analyze task distribution and relationships across different stakeholders"
    >
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {totalTasks}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Across all relations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Relations
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {relatedPersons.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                People involved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Avg Completion
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {avgCompletionRate.toFixed(0)}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Overall rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performer
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {Math.max(...relatedPersons.map((p) => p.completionRate))}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Best completion rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>View Type</InputLabel>
            <Select
              value={viewType}
              label="View Type"
              onChange={(e) =>
                setViewType(e.target.value as "overview" | "detailed")
              }
            >
              <MenuItem value="overview">Overview</MenuItem>
              <MenuItem value="detailed">Detailed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Filter by Person</InputLabel>
            <Select
              value={selectedPerson}
              label="Filter by Person"
              onChange={(e) => setSelectedPerson(e.target.value)}
            >
              <MenuItem value="all">All Persons</MenuItem>
              {relatedPersons.map((person) => (
                <MenuItem key={person.id} value={person.id}>
                  {person.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Relationship Distribution Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Distribution by Relationship
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={relationshipData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {relationshipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Comparison */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={relatedPersons}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="completedTasks"
                    stackId="a"
                    fill="#4caf50"
                    name="Completed"
                  />
                  <Bar
                    dataKey="inProgressTasks"
                    stackId="a"
                    fill="#ff9800"
                    name="In Progress"
                  />
                  <Bar
                    dataKey="pendingTasks"
                    stackId="a"
                    fill="#f44336"
                    name="Pending"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Related Persons List */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Related Persons Details
              </Typography>
              <List>
                {relatedPersons
                  .filter(
                    (person) =>
                      selectedPerson === "all" || person.id === selectedPerson
                  )
                  .map((person, index) => (
                    <React.Fragment key={person.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={person.avatar}
                            sx={{
                              bgcolor: getRoleColor(person.role),
                              width: 56,
                              height: 56,
                            }}
                          >
                            {getRoleIcon(person.role)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="h6">
                                {person.name}
                              </Typography>
                              <Chip
                                label={person.role}
                                size="small"
                                sx={{
                                  bgcolor: getRoleColor(person.role),
                                  color: "white",
                                  textTransform: "capitalize",
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {person.tasksCount} total tasks •{" "}
                                {person.completedTasks} completed
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 1,
                                }}
                              >
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                  Completion Rate: {person.completionRate}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={person.completionRate}
                                  sx={{
                                    flexGrow: 1,
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: "grey.200",
                                    "& .MuiLinearProgress-bar": {
                                      bgcolor:
                                        person.completionRate > 80
                                          ? "#4caf50"
                                          : person.completionRate > 60
                                          ? "#ff9800"
                                          : "#f44336",
                                    },
                                  }}
                                />
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography variant="body2" color="text.secondary">
                              In Progress: {person.inProgressTasks}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pending: {person.pendingTasks}
                            </Typography>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < relatedPersons.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ReportWrapper>
  );
};

export default TasksByRelatedPersonReport;
