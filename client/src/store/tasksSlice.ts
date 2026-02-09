import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksAPI } from '../api/tasks';
import type { Task, TaskInput } from '../api/tasks';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: {
    status?: string;
    priority?: string;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  filter: {},
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { getState }) => {
  const state = getState() as { tasks: TasksState };
  const { filter, sortBy, sortOrder } = state.tasks;
  return await tasksAPI.getTasks({
    ...filter,
    sortBy,
    order: sortOrder,
  });
});

export const createTask = createAsyncThunk('tasks/createTask', async (task: TaskInput) => {
  return await tasksAPI.createTask(task);
});

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }: { id: string; task: Partial<TaskInput> }) => {
    return await tasksAPI.updateTask(id, task);
  }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
  await tasksAPI.deleteTask(id);
  return id;
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status }: { id: string; status: Task['status'] }) => {
    return await tasksAPI.updateTaskStatus(id, status);
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create task';
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task';
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete task';
      })
      // Update task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task status';
      });
  },
});

export const { setFilter, setSortBy, setSortOrder, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
