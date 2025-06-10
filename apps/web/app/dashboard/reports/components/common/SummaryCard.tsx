import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color: "primary" | "success" | "warning" | "danger" | "purple";
  gradient?: boolean;
}

const colorMap = {
  primary: {
    background: "linear-gradient(135deg, #3b82f620, #3b82f610)",
    border: "1px solid #3b82f630",
    textColor: "#3b82f6"
  },
  success: {
    background: "linear-gradient(135deg, #10b98120, #10b98110)",
    border: "1px solid #10b98130", 
    textColor: "#10b981"
  },
  warning: {
    background: "linear-gradient(135deg, #f59e0b20, #f59e0b10)",
    border: "1px solid #f59e0b30",
    textColor: "#f59e0b"
  },
  danger: {
    background: "linear-gradient(135deg, #ef444420, #ef444410)",
    border: "1px solid #ef444430",
    textColor: "#ef4444"
  },
  purple: {
    background: "linear-gradient(135deg, #8b5cf620, #8b5cf610)",
    border: "1px solid #8b5cf630",
    textColor: "#8b5cf6"
  }
};

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color,
  gradient = true
}: SummaryCardProps) {
  const colorStyle = colorMap[color];
  
  return (
    <Card
      elevation={0}
      sx={{
        background: gradient ? colorStyle.background : "white",
        border: gradient ? colorStyle.border : "1px solid #e2e8f0",
        borderRadius: 3,
        height: "100%"
      }}
    >
      <CardContent sx={{ textAlign: "center", py: 2 }}>
        {icon && (
          <Typography
            component="div"
            sx={{ color: colorStyle.textColor, fontSize: 32, mb: 1 }}
          >
            {icon}
          </Typography>
        )}
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: colorStyle.textColor, mb: 0.5 }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: "#94a3b8", mt: 0.5, display: "block" }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
