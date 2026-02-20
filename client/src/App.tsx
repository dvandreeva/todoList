import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TaskFormDialog from './components/TaskFormDialog';
import TaskItem from './components/TaskItem';
import TaskFilters from './components/TaskFilters';
import TaskStatsBar from './components/TaskStatsBar';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  setFilter,
  setSortBy,
  setSortOrder,
  clearError,
} from './store/tasksSlice';
import type { Task, TaskInput } from './api/tasks';

function App() {
  // Temporary debug - remove this once working
  console.log('App component rendering');
  
  try {
  const dispatch = useAppDispatch();
  const { tasks, loading, error, filter, sortBy, sortOrder } = useAppSelector(
    (state) => state.tasks
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch, filter, sortBy, sortOrder]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }
  }, [error]);

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTask(undefined);
  };

  const handleSubmit = async (taskData: TaskInput) => {
    try {
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask._id, task: taskData })).unwrap();
        setSnackbarMessage('Task updated successfully!');
      } else {
        await dispatch(createTask(taskData)).unwrap();
        setSnackbarMessage('Task created successfully!');
      }
      setSnackbarOpen(true);
      handleDialogClose();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id)).unwrap();
        setSnackbarMessage('Task deleted successfully!');
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      await dispatch(updateTaskStatus({ id, status })).unwrap();
      setSnackbarMessage('Task status updated!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    dispatch(setFilter({ ...filter, status: status || undefined }));
  };

  const handlePriorityFilterChange = (priority: string) => {
    dispatch(setFilter({ ...filter, priority: priority || undefined }));
  };

  const handleClearFilters = () => {
    dispatch(setFilter({}));
    dispatch(setSortBy('createdAt'));
    dispatch(setSortOrder('desc'));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    dispatch(clearError());
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" component="h1">
          Wellcome to my to do list
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateTask}>
          New Task
        </Button>
      </Box>

      <TaskStatsBar />

      <TaskFilters
        statusFilter={filter.status || ''}
        priorityFilter={filter.priority || ''}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onStatusFilterChange={handleStatusFilterChange}
        onPriorityFilterChange={handlePriorityFilterChange}
        onSortByChange={(value) => dispatch(setSortBy(value))}
        onSortOrderChange={(value) => dispatch(setSortOrder(value))}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Alert severity="info">
          No tasks found. Create your first task to get started!
        </Alert>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </Box>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSubmit}
        task={editingTask}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'}>
          {error || snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
  } catch (err) {
    console.error('App render error:', err);
    return (
      <Container>
        <Typography color="error">
          Error loading app: {err instanceof Error ? err.message : String(err)}
        </Typography>
      </Container>
    );
  }
}

export default App;
