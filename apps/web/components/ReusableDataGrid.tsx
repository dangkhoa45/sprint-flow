"use client";
import Box from "@mui/material/Box";
import { useTheme, Theme } from "@mui/material/styles";
import { 
  DataGrid, 
  GridColDef, 
  GridRowsProp, 
  GridPaginationModel,
  GridSortModel,
  GridFilterModel 
} from "@mui/x-data-grid";
import { ReactNode } from "react";

interface ReusableDataGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  height?: number | string;
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  disableColumnMenu?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  loading?: boolean;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  onSortModelChange?: (model: GridSortModel) => void;
  onFilterModelChange?: (model: GridFilterModel) => void;
  onRowSelectionModelChange?: (selectionModel: any) => void;
  customSx?: object;
  toolbar?: ReactNode;
  noRowsOverlay?: ReactNode;
  loadingOverlay?: ReactNode;
  getRowHeight?: () => number | "auto";
  density?: "compact" | "standard" | "comfortable";
}

const ReusableDataGrid = ({
  rows,
  columns,
  height = 600,
  checkboxSelection = false,
  disableRowSelectionOnClick = true,
  disableColumnMenu = true,
  pageSizeOptions = [5, 10, 25, 50],
  initialPageSize = 10,
  loading = false,
  onPaginationModelChange,
  onSortModelChange,
  onFilterModelChange,
  onRowSelectionModelChange,
  customSx,
  toolbar,
  noRowsOverlay,
  loadingOverlay,
  getRowHeight = () => "auto",
  density = "standard",
}: ReusableDataGridProps) => {
  const theme = useTheme();

  const defaultSx = {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    "& .MuiDataGrid-cell": {
      py: 1.5,
      display: "flex",
      alignItems: "center",
    },
    "& .MuiDataGrid-row": {
      minHeight: "70px !important",
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: theme.palette.grey[50],
      borderRadius: `8px 8px 0 0`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      "& .MuiDataGrid-columnHeader": {
        fontWeight: 600,
      },
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: `1px solid ${theme.palette.divider}`,
      borderRadius: `0 0 8px 8px`,
    },
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-cell:focus": {
      outline: "none",
    },
    "& .MuiDataGrid-row:focus": {
      outline: "none",
    },
    "& .MuiDataGrid-virtualScroller": {
      minHeight: "200px",
    },
    ...customSx,
  };

  return (
    <Box sx={{ height, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={pageSizeOptions}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: initialPageSize },
          },
        }}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        disableColumnMenu={disableColumnMenu}
        getRowHeight={getRowHeight}
        density={density}
        onPaginationModelChange={onPaginationModelChange}
        onSortModelChange={onSortModelChange}
        onFilterModelChange={onFilterModelChange}
        onRowSelectionModelChange={onRowSelectionModelChange}
        slots={{
          toolbar: toolbar ? () => toolbar : undefined,
          noRowsOverlay: noRowsOverlay ? () => noRowsOverlay : undefined,
          loadingOverlay: loadingOverlay ? () => loadingOverlay : undefined,
        }}
        sx={defaultSx}
      />
    </Box>
  );
};

export default ReusableDataGrid;
