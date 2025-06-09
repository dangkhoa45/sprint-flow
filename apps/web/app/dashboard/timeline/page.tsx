"use client";
import Box from "@mui/material/Box";
import { useState } from "react";
import {
  TimelineEvent,
  TimelineEventType,
  TimelineEventPriority,
  TimelineFilters,
  TimelineStats as TimelineStatsType,
  CreateTimelineEventData,
} from "../../../types/timeline";
import CreateTimelineEventDialog from "./components/CreateTimelineEventDialog";
import DeleteTimelineEventDialog from "./components/DeleteTimelineEventDialog";
import EditTimelineEventDialog from "./components/EditTimelineEventDialog";
import TimelineHeader from "./components/TimelineHeader";
import TimelineStats from "./components/TimelineStats";
import TimelineView from "./components/TimelineView";

// Mock data - would be replaced with API calls
const mockEvents: TimelineEvent[] = [
  {
    _id: "1",
    type: TimelineEventType.PROJECT_CREATED,
    title: "Dự án SprintFlow Mobile được tạo",
    description: "Khởi tạo dự án phát triển ứng dụng mobile cho hệ thống quản lý dự án SprintFlow với React Native",
    priority: TimelineEventPriority.HIGH,
    user: {
      _id: "user1",
      username: "john_doe",
      displayName: "John Doe",
      avatar: "",
      role: "owner",
    },
    project: {
      _id: "project1",
      name: "SprintFlow Mobile App",
      status: "in_progress",
    },
    createdAt: new Date("2024-06-10T09:00:00"),
    updatedAt: new Date("2024-06-10T09:00:00"),
  },
  {
    _id: "2",
    type: TimelineEventType.TASK_CREATED,
    title: "Task thiết kế UI/UX được tạo",
    description: "Tạo task thiết kế giao diện người dùng cho màn hình đăng nhập và dashboard chính",
    priority: TimelineEventPriority.HIGH,
    user: {
      _id: "user2",
      username: "jane_smith",
      displayName: "Jane Smith",
      avatar: "",
      role: "manager",
    },
    project: {
      _id: "project1",
      name: "SprintFlow Mobile App",
      status: "in_progress",
    },
    task: {
      _id: "task1",
      title: "Thiết kế UI/UX Dashboard",
      status: "in_progress",
      projectId: "project1",
    },
    createdAt: new Date("2024-06-10T10:30:00"),
    updatedAt: new Date("2024-06-10T10:30:00"),
  },
  {
    _id: "3",
    type: TimelineEventType.USER_JOINED,
    title: "Bob Wilson tham gia dự án",
    description: "Thành viên mới Bob Wilson đã được thêm vào dự án với vai trò developer",
    priority: TimelineEventPriority.MEDIUM,
    user: {
      _id: "user1",
      username: "john_doe",
      displayName: "John Doe",
      avatar: "",
      role: "owner",
    },
    project: {
      _id: "project1",
      name: "SprintFlow Mobile App",
      status: "in_progress",
    },
    metadata: {
      newMember: {
        id: "user3",
        name: "Bob Wilson",
        role: "developer",
      },
    },
    createdAt: new Date("2024-06-10T11:15:00"),
    updatedAt: new Date("2024-06-10T11:15:00"),
  },
  {
    _id: "4",
    type: TimelineEventType.TASK_COMPLETED,
    title: "Hoàn thành task API Authentication",
    description: "Task phát triển API xác thực người dùng đã được hoàn thành thành công",
    priority: TimelineEventPriority.HIGH,
    user: {
      _id: "user3",
      username: "bob_wilson",
      displayName: "Bob Wilson",
      avatar: "",
      role: "member",
    },
    project: {
      _id: "project1",
      name: "SprintFlow Mobile App",
      status: "in_progress",
    },
    task: {
      _id: "task2",
      title: "API Authentication",
      status: "completed",
      projectId: "project1",
    },
    createdAt: new Date("2024-06-10T14:20:00"),
    updatedAt: new Date("2024-06-10T14:20:00"),
  },
  {
    _id: "5",
    type: TimelineEventType.MILESTONE_REACHED,
    title: "Đạt mốc 50% hoàn thành dự án",
    description: "Dự án SprintFlow Mobile đã đạt được mốc 50% hoàn thành theo kế hoạch",
    priority: TimelineEventPriority.URGENT,
    user: {
      _id: "user1",
      username: "john_doe",
      displayName: "John Doe",
      avatar: "",
      role: "owner",
    },
    project: {
      _id: "project1",
      name: "SprintFlow Mobile App",
      status: "in_progress",
    },
    metadata: {
      milestone: {
        percentage: 50,
        targetDate: "2024-06-15",
      },
    },
    createdAt: new Date("2024-06-10T16:45:00"),
    updatedAt: new Date("2024-06-10T16:45:00"),
  },
  {
    _id: "6",
    type: TimelineEventType.COMMENT_ADDED,
    title: "Bình luận mới trên task Database Schema",
    description: "Jane Smith đã thêm bình luận về cấu trúc database và đề xuất một số cải tiến",
    priority: TimelineEventPriority.MEDIUM,
    user: {
      _id: "user2",
      username: "jane_smith",
      displayName: "Jane Smith",
      avatar: "",
      role: "manager",
    },
    project: {
      _id: "project2",
      name: "Website Redesign",
      status: "planning",
    },
    task: {
      _id: "task3",
      title: "Database Schema Design",
      status: "in_progress",
      projectId: "project2",
    },
    createdAt: new Date("2024-06-09T15:30:00"),
    updatedAt: new Date("2024-06-09T15:30:00"),
  },
  {
    _id: "7",
    type: TimelineEventType.FILE_UPLOADED,
    title: "Tải lên file thiết kế mockup",
    description: "Đã tải lên file mockup thiết kế cho màn hình chính của ứng dụng mobile",
    priority: TimelineEventPriority.MEDIUM,
    user: {
      _id: "user4",
      username: "alice_brown",
      displayName: "Alice Brown",
      avatar: "",
      role: "member",
    },
    project: {
      _id: "project1",
      name: "SprintFlow Mobile App",
      status: "in_progress",
    },
    metadata: {
      file: {
        name: "mobile_mockup_v2.figma",
        size: "2.5MB",
        type: "figma",
      },
    },
    createdAt: new Date("2024-06-09T11:20:00"),
    updatedAt: new Date("2024-06-09T11:20:00"),
  },
  {
    _id: "8",
    type: TimelineEventType.DEADLINE_APPROACHING,
    title: "Sắp đến hạn nộp báo cáo tiến độ",
    description: "Báo cáo tiến độ tháng 6 cần được nộp trong vòng 3 ngày tới",
    priority: TimelineEventPriority.URGENT,
    user: {
      _id: "system",
      username: "system",
      displayName: "Hệ thống",
      avatar: "",
      role: "owner",
    },
    project: {
      _id: "project1",
      name: "SprintFlow Mobile App",
      status: "in_progress",
    },
    metadata: {
      deadline: {
        date: "2024-06-13",
        daysLeft: 3,
        type: "report",
      },
    },
    createdAt: new Date("2024-06-09T08:00:00"),
    updatedAt: new Date("2024-06-09T08:00:00"),
  },
  {
    _id: "9",
    type: TimelineEventType.STATUS_CHANGED,
    title: "Thay đổi trạng thái task Testing",
    description: "Task Testing được chuyển từ trạng thái 'Đang thực hiện' sang 'Đang review'",
    priority: TimelineEventPriority.MEDIUM,
    user: {
      _id: "user3",
      username: "bob_wilson",
      displayName: "Bob Wilson",
      avatar: "",
      role: "member",
    },
    project: {
      _id: "project1",
      name: "SprintFlow Mobile App",
      status: "in_progress",
    },
    task: {
      _id: "task4",
      title: "Unit Testing & Integration Testing",
      status: "review",
      projectId: "project1",
    },
    metadata: {
      statusChange: {
        from: "in_progress",
        to: "review",
      },
    },
    createdAt: new Date("2024-06-08T16:30:00"),
    updatedAt: new Date("2024-06-08T16:30:00"),
  },
  {
    _id: "10",
    type: TimelineEventType.PROJECT_UPDATED,
    title: "Cập nhật thông tin dự án Website Redesign",
    description: "Cập nhật timeline và ngân sách cho dự án thiết kế lại website công ty",
    priority: TimelineEventPriority.MEDIUM,
    user: {
      _id: "user2",
      username: "jane_smith",
      displayName: "Jane Smith",
      avatar: "",
      role: "manager",
    },
    project: {
      _id: "project2",
      name: "Website Redesign",
      status: "planning",
    },
    metadata: {
      updates: {
        budget: "Tăng từ 30K lên 35K USD",
        timeline: "Gia hạn 2 tuần",
      },
    },
    createdAt: new Date("2024-06-08T10:15:00"),
    updatedAt: new Date("2024-06-08T10:15:00"),
  },
];

const mockStats: TimelineStatsType = {
  total: 47,
  today: 5,
  thisWeek: 18,
  thisMonth: 35,
  projectEvents: 28,
  taskEvents: 15,
  userEvents: 4,
};

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>(mockEvents);
  const [stats, setStats] = useState<TimelineStatsType>(mockStats);
  const [filters, setFilters] = useState<TimelineFilters>({});
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter events based on current filters
  const filteredEvents = events.filter((event) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = event.title.toLowerCase().includes(searchLower);
      const matchesDescription = event.description.toLowerCase().includes(searchLower);
      const matchesUser = event.user.displayName.toLowerCase().includes(searchLower);
      const matchesProject = event.project?.name.toLowerCase().includes(searchLower);
      const matchesTask = event.task?.title.toLowerCase().includes(searchLower);
      
      if (!matchesTitle && !matchesDescription && !matchesUser && !matchesProject && !matchesTask) {
        return false;
      }
    }

    // Event type filter
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(event.type)) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(event.priority)) {
        return false;
      }
    }

    // User filter
    if (filters.userId) {
      if (event.user._id !== filters.userId) {
        return false;
      }
    }

    // Project filter
    if (filters.projectId) {
      if (!event.project || event.project._id !== filters.projectId) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateFrom) {
      if (event.createdAt < filters.dateFrom) {
        return false;
      }
    }

    if (filters.dateTo) {
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      if (event.createdAt > endOfDay) {
        return false;
      }
    }

    return true;
  });

  // Update stats based on filtered events
  const calculateStats = (eventList: TimelineEvent[]): TimelineStatsType => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: eventList.length,
      today: eventList.filter(e => e.createdAt >= today).length,
      thisWeek: eventList.filter(e => e.createdAt >= thisWeekStart).length,
      thisMonth: eventList.filter(e => e.createdAt >= thisMonthStart).length,
      projectEvents: eventList.filter(e => 
        e.type === TimelineEventType.PROJECT_CREATED ||
        e.type === TimelineEventType.PROJECT_UPDATED ||
        e.type === TimelineEventType.PROJECT_COMPLETED ||
        e.type === TimelineEventType.PROJECT_DELETED
      ).length,
      taskEvents: eventList.filter(e => 
        e.type === TimelineEventType.TASK_CREATED ||
        e.type === TimelineEventType.TASK_UPDATED ||
        e.type === TimelineEventType.TASK_COMPLETED ||
        e.type === TimelineEventType.TASK_DELETED
      ).length,
      userEvents: eventList.filter(e => 
        e.type === TimelineEventType.USER_JOINED ||
        e.type === TimelineEventType.USER_LEFT
      ).length,
    };
  };

  const currentStats = calculateStats(filteredEvents);

  const handleFiltersChange = (newFilters: TimelineFilters) => {
    setFilters(newFilters);
  };

  const handleViewModeChange = (mode: "timeline" | "list") => {
    setViewMode(mode);
  };

  const handleRefresh = () => {
    setLoading(true);
    // TODO: Implement API call to refresh events
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleCreateEvent = async (eventData: CreateTimelineEventData) => {
    setLoading(true);
    try {
      // TODO: API call to create event
      console.log("Creating event:", eventData);
      
      // Mock creating new event
      const newEvent: TimelineEvent = {
        _id: `event_${Date.now()}`,
        type: eventData.type,
        title: eventData.title,
        description: eventData.description,
        priority: eventData.priority,
        user: {
          _id: "current_user",
          username: "current_user",
          displayName: "Người dùng hiện tại",
          role: "owner",
        },
        project: eventData.projectId ? {
          _id: eventData.projectId,
          name: "Dự án mẫu",
          status: "in_progress",
        } : undefined,
        task: eventData.taskId ? {
          _id: eventData.taskId,
          title: "Task mẫu",
          status: "in_progress",
          projectId: eventData.projectId || "",
        } : undefined,
        metadata: eventData.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setEvents((prev) => [newEvent, ...prev]);
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        today: prev.today + 1,
      }));

      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = async (eventId: string, eventData: Partial<TimelineEvent>) => {
    setLoading(true);
    try {
      // TODO: API call to update event
      console.log("Updating event:", eventId, eventData);

      // Update local state for demo
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, ...eventData } : e))
      );

      setIsEditDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setLoading(true);
    try {
      // TODO: API call to delete event
      console.log("Deleting event:", eventId);

      // Update local state for demo
      setEvents((prev) => prev.filter((e) => e._id !== eventId));

      // Update stats
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));

      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 3,
      }}
    >
      <TimelineHeader
        onCreateEventAction={() => setIsCreateDialogOpen(true)}
        onFiltersChangeAction={handleFiltersChange}
        onViewModeChange={handleViewModeChange}
        onRefresh={handleRefresh}
        filters={filters}
        viewMode={viewMode}
      />

      <TimelineStats stats={currentStats} />

      <TimelineView
        events={filteredEvents}
        viewMode={viewMode}
        loading={loading}
        onCreateEvent={() => setIsCreateDialogOpen(true)}
        onEditEvent={handleOpenEditDialog}
        onDeleteEvent={handleOpenDeleteDialog}
      />

      <CreateTimelineEventDialog
        open={isCreateDialogOpen}
        onCloseAction={() => setIsCreateDialogOpen(false)}
        onSubmitAction={handleCreateEvent}
        loading={loading}
      />

      <EditTimelineEventDialog
        open={isEditDialogOpen}
        event={selectedEvent}
        onCloseAction={() => setIsEditDialogOpen(false)}
        onSubmitAction={handleEditEvent}
        loading={loading}
      />

      <DeleteTimelineEventDialog
        open={isDeleteDialogOpen}
        event={selectedEvent}
        onCloseAction={() => setIsDeleteDialogOpen(false)}
        onConfirmAction={handleDeleteEvent}
        loading={loading}
      />
    </Box>
  );
}
