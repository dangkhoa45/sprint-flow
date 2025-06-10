import { TimeSeriesData } from "../types/report.types";

export interface MockDataConfig {
  timeRange: "daily" | "weekly" | "monthly";
  startDate?: Date;
  count?: number;
}

export function generateTimeSeriesData(config: MockDataConfig): TimeSeriesData[] {
  const { timeRange, count = 12 } = config;
  
  let periods: string[] = [];
  
  switch (timeRange) {
    case "monthly":
      periods = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ].slice(0, count);
      break;
      
    case "weekly":
      periods = Array.from({ length: count }, (_, i) => `Tuần ${i + 1}`);
      break;
      
    case "daily":
      periods = Array.from({ length: count }, (_, i) => `${i + 1}/6`);
      break;
  }
  
  return periods.map((period) => ({
    period,
    created: generateRandomValue(timeRange, "created"),
    completed: generateRandomValue(timeRange, "completed"),
    inProgress: generateRandomValue(timeRange, "inProgress"),
    todo: generateRandomValue(timeRange, "todo")
  }));
}

function generateRandomValue(timeRange: string, type: string): number {
  const baseValues = {
    monthly: { created: 50, completed: 40, inProgress: 20, todo: 15 },
    weekly: { created: 15, completed: 12, inProgress: 8, todo: 5 },
    daily: { created: 5, completed: 4, inProgress: 3, todo: 2 }
  };
  
  const base = baseValues[timeRange as keyof typeof baseValues][type as keyof typeof baseValues.monthly];
  const variance = base * 0.6; // 60% variance
  
  return Math.floor(Math.random() * variance) + Math.floor(base * 0.4);
}

export function calculateSummaryStats(data: TimeSeriesData[]) {
  const totalCreated = data.reduce((sum, item) => sum + item.created, 0);
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0);
  const totalInProgress = data.reduce((sum, item) => sum + item.inProgress, 0);
  const totalTodo = data.reduce((sum, item) => sum + item.todo, 0);
  
  return {
    totalCreated,
    totalCompleted,
    totalInProgress,
    totalTodo,
    completionRate: totalCreated > 0 ? (totalCompleted / totalCreated) * 100 : 0
  };
}

export function generateTrendData(data: TimeSeriesData[]) {
  return data.map((item, index) => ({
    ...item,
    cumulative: data
      .slice(0, index + 1)
      .reduce((sum, d) => sum + d.completed, 0)
  }));
}
