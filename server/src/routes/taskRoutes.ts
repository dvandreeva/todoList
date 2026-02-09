import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskStats,
} from '../controllers/taskController.js';

const router = express.Router();

// Statistics route must come before :id route
router.get('/stats', getTaskStats);

// CRUD routes
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Status update route
router.patch('/:id/status', updateTaskStatus);

export default router;
