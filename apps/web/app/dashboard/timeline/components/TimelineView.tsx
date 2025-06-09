"use client";
import AddIcon from "@mui/icons-material/Add";
import TimelineIcon from "@mui/icons-material/Timeline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { TimelineEvent } from "../../../../types/timeline";
import TimelineEventCard from "./TimelineEvent";

interface TimelineViewProps {
  events: TimelineEvent[];
  viewMode?: "timeline" | "list";
  loading?: boolean;
  onCreateEvent?: () => void;
  onEditEvent?: (event: TimelineEvent) => void;
  onDeleteEvent?: (event: TimelineEvent) => void;
}

// Skeleton component for loading state
const TimelineEventSkeleton = ({ isCompact = false }: { isCompact?: boolean }) => (
  <Paper
    elevation={0}
    sx={{
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: 3,
      p: isCompact ? 2 : 3,
      position: "relative",
    }}
  >
    {/* Priority indicator bar skeleton */}
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 4,
        height: "100%",
        bgcolor: "rgba(255, 255, 255, 0.1)",
      }}
    />

    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Icon skeleton */}
      <Skeleton
        variant="rectangular"
        width={isCompact ? 40 : 48}
        height={isCompact ? 40 : 48}
        sx={{ borderRadius: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }}
      />

      {/* Content skeleton */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Skeleton
            variant="text"
            height={isCompact ? 24 : 32}
            width="60%"
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
          />
          <Skeleton
            variant="rounded"
            height={24}
            width={60}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
          />
        </Box>
        
        <Skeleton
          variant="text"
          height={20}
          width="85%"
          sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", mb: 1 }}
        />
        
        {!isCompact && (
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Skeleton
              variant="rounded"
              height={24}
              width={100}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
            />
            <Skeleton
              variant="rounded"
              height={24}
              width={80}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
            />
          </Box>
        )}
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Skeleton
              variant="circular"
              width={isCompact ? 24 : 32}
              height={isCompact ? 24 : 32}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
            />
            <Skeleton
              variant="text"
              height={16}
              width={80}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
            />
          </Box>
          <Skeleton
            variant="text"
            height={16}
            width={60}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
          />
        </Box>
      </Box>
    </Box>
  </Paper>
);

const EmptyState = ({ onCreateEvent }: { onCreateEvent?: () => void }) => (
  <Paper
    elevation={0}
    sx={{
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: 3,
      p: 6,
      textAlign: "center",
      minHeight: 400,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <TimelineIcon
      sx={{
        fontSize: 64,
        color: "rgba(255, 255, 255, 0.3)",
        mb: 2,
      }}
    />
    <Typography
      variant="h5"
      sx={{
        color: "rgba(255, 255, 255, 0.8)",
        mb: 1,
        fontWeight: 600,
      }}
    >
      Chưa có sự kiện nào
    </Typography>
    <Typography
      variant="body1"
      sx={{
        color: "rgba(255, 255, 255, 0.6)",
        mb: 3,
        maxWidth: 400,
      }}
    >
      Tạo sự kiện đầu tiên để bắt đầu theo dõi hoạt động trong dự án của bạn.
    </Typography>
    {onCreateEvent && (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateEvent}
        sx={{
          background: "linear-gradient(45deg, #ff6b6b, #ff8e53)",
          "&:hover": {
            background: "linear-gradient(45deg, #ff5252, #ff7043)",
          },
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          py: 1.5,
        }}
      >
        Tạo sự kiện đầu tiên
      </Button>
    )}
  </Paper>
);

export default function TimelineView({
  events,
  viewMode = "timeline",
  loading = false,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
}: TimelineViewProps) {
  // Group events by date for timeline view
  const groupEventsByDate = (events: TimelineEvent[]) => {
    const groups: { [key: string]: TimelineEvent[] } = {};
    
    events.forEach((event) => {
      const dateKey = event.createdAt.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });
    
    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <TimelineEventSkeleton key={index} isCompact={viewMode === "list"} />
        ))}
      </Box>
    );
  }

  if (events.length === 0) {
    return <EmptyState onCreateEvent={onCreateEvent} />;
  }

  if (viewMode === "list") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {events.map((event) => (
          <TimelineEventCard
            key={event._id}
            event={event}
            onEdit={onEditEvent}
            onDelete={onDeleteEvent}
            isCompact={true}
          />
        ))}
      </Box>
    );
  }

  // Timeline view
  const groupedEvents = groupEventsByDate(events);

  return (
    <Box sx={{ position: "relative" }}>
      {/* Timeline line */}
      <Box
        sx={{
          position: "absolute",
          left: 24,
          top: 0,
          bottom: 0,
          width: 2,
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))",
          borderRadius: 1,
          zIndex: 0,
        }}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {groupedEvents.map(([dateString, dayEvents], groupIndex) => (
          <Box key={dateString} sx={{ position: "relative" }}>
            {/* Date header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 3,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                  border: "3px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  {new Date(dateString).getDate()}
                </Typography>
              </Box>
              
              <Paper
                elevation={0}
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  {formatDateHeader(dateString)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {dayEvents.length} sự kiện
                </Typography>
              </Paper>
            </Box>

            {/* Events for this date */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                ml: 6, // Offset for timeline line
              }}
            >
              {dayEvents.map((event, eventIndex) => (
                <Box key={event._id} sx={{ position: "relative" }}>
                  {/* Timeline connector */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: -42,
                      top: 24,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
                      border: "3px solid rgba(255, 255, 255, 0.8)",
                      zIndex: 2,
                    }}
                  />
                  
                  <TimelineEventCard
                    event={event}
                    onEdit={onEditEvent}
                    onDelete={onDeleteEvent}
                    isCompact={false}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
