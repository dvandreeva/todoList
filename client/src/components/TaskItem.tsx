import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import type { Task } from '../api/tasks';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }: TaskItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: Task['status']) => {
    onStatusChange(task._id, status);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'default';
      case 'in-progress':
        return 'primary';
      case 'done':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {task.title}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleStatusChange('todo')}>Mark as To Do</MenuItem>
          <MenuItem onClick={() => handleStatusChange('in-progress')}>
            Mark as In Progress
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange('done')}>Mark as Done</MenuItem>
        </Menu>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={task.status} size="small" color={getStatusColor(task.status)} />
          <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} />
        </Box>

        {task.dueDate && (
          <Typography variant="caption" color="text.secondary">
            Due: {formatDate(task.dueDate)}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <IconButton size="small" onClick={() => onEdit(task)} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(task._id)} color="error">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
