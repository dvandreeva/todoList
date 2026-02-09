import axios from 'axios';

const API_BASE_URL = '/api';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface TaskStats {
  total: number;
  byStatus: {
    todo: number;
    inProgress: number;
    done: number;
  };
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

export const tasksAPI = {
  getTasks: async (params?: {
    status?: string;
    priority?: string;
    sortBy?: string;
    order?: string;
  }): Promise<Task[]> => {
    const response = await axios.get(`${API_BASE_URL}/tasks`, { params });
    return response.data;
  },

  getTaskById: async (id: string): Promise<Task> => {
    const response = await axios.get(`${API_BASE_URL}/tasks/${id}`);
    return response.data;
  },

  createTask: async (task: TaskInput): Promise<Task> => {
    const response = await axios.post(`${API_BASE_URL}/tasks`, task);
    return response.data;
  },

  updateTask: async (id: string, task: Partial<TaskInput>): Promise<Task> => {
    const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/tasks/${id}`);
  },

  updateTaskStatus: async (id: string, status: Task['status']): Promise<Task> => {
    const response = await axios.patch(`${API_BASE_URL}/tasks/${id}/status`, { status });
    return response.data;
  },

  getStats: async (): Promise<TaskStats> => {
    const response = await axios.get(`${API_BASE_URL}/tasks/stats`);
    return response.data;
  },
};
