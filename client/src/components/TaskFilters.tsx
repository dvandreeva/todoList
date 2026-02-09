import { Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';

interface TaskFiltersProps {
  statusFilter: string;
  priorityFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onStatusFilterChange: (status: string) => void;
  onPriorityFilterChange: (priority: string) => void;
  onSortByChange: (sortBy: string) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

export default function TaskFilters({
  statusFilter,
  priorityFilter,
  sortBy,
  sortOrder,
  onStatusFilterChange,
  onPriorityFilterChange,
  onSortByChange,
  onSortOrderChange,
  onClearFilters,
}: TaskFiltersProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <FilterIcon color="action" />

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select value={statusFilter} label="Status" onChange={(e) => onStatusFilterChange(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={priorityFilter}
          label="Priority"
          onChange={(e) => onPriorityFilterChange(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select value={sortBy} label="Sort By" onChange={(e) => onSortByChange(e.target.value)}>
          <MenuItem value="createdAt">Created Date</MenuItem>
          <MenuItem value="dueDate">Due Date</MenuItem>
          <MenuItem value="priority">Priority</MenuItem>
          <MenuItem value="title">Title</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Order</InputLabel>
        <Select
          value={sortOrder}
          label="Order"
          onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>

      <Button size="small" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </Box>
  );
}
