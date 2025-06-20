"use client";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { ProjectPriority, ProjectStatus } from "../../../types/project";

const ProjectFilters = () => {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority[]>([]);
  const [ownerFilter, setOwnerFilter] = useState<string>("");

  const handleStatusChange = (
    event: SelectChangeEvent<typeof statusFilter>
  ) => {
    const value = event.target.value;
    setStatusFilter(
      typeof value === "string" ? (value.split(",") as ProjectStatus[]) : value
    );
  };

  const handlePriorityChange = (
    event: SelectChangeEvent<typeof priorityFilter>
  ) => {
    const value = event.target.value;
    setPriorityFilter(
      typeof value === "string"
        ? (value.split(",") as ProjectPriority[])
        : value
    );
  };

  const handleOwnerChange = (event: SelectChangeEvent) => {
    setOwnerFilter(event.target.value);
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return "Lập kế hoạch";
      case ProjectStatus.InProgress:
        return "Đang thực hiện";
      case ProjectStatus.OnHold:
        return "Tạm dừng";
      case ProjectStatus.Completed:
        return "Hoàn thành";
      case ProjectStatus.Cancelled:
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPriorityText = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Low:
        return "Thấp";
      case ProjectPriority.Medium:
        return "Trung bình";
      case ProjectPriority.High:
        return "Cao";
      case ProjectPriority.Critical:
        return "Khẩn cấp";
      default:
        return priority;
    }
  };

  const statusOptions = Object.values(ProjectStatus);
  const priorityOptions = Object.values(ProjectPriority);

  const owners = [
    { id: "user1", name: "Nguyễn Văn A" },
    { id: "user2", name: "Trần Thị B" },
    { id: "user3", name: "Lê Văn C" },
  ];

  return (
    <Box
      sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}
    >
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Trạng thái</InputLabel>
        <Select
          multiple
          value={statusFilter}
          onChange={handleStatusChange}
          input={<OutlinedInput label="Trạng thái" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={getStatusText(value)} size="small" />
              ))}
            </Box>
          )}
        >
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {getStatusText(status)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Độ ưu tiên</InputLabel>
        <Select
          multiple
          value={priorityFilter}
          onChange={handlePriorityChange}
          input={<OutlinedInput label="Độ ưu tiên" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={getPriorityText(value)} size="small" />
              ))}
            </Box>
          )}
        >
          {priorityOptions.map((priority) => (
            <MenuItem key={priority} value={priority}>
              {getPriorityText(priority)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Chủ sở hữu</InputLabel>
        <Select
          value={ownerFilter}
          onChange={handleOwnerChange}
          label="Chủ sở hữu"
        >
          <MenuItem value="">
            <em>Tất cả</em>
          </MenuItem>
          {owners.map((owner) => (
            <MenuItem key={owner.id} value={owner.id}>
              {owner.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ProjectFilters;
