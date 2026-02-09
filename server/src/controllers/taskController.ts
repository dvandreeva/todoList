import { Request, Response } from 'express';
import Task from '../models/Task.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Build sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort: any = { [sortBy as string]: sortOrder };

    const tasks = await Task.find(filter).sort(sort);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: (error as Error).message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: (error as Error).message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Task title is required' });
      return;
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: (error as Error).message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : undefined;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: (error as Error).message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: (error as Error).message });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Public
export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status || !['todo', 'in-progress', 'done'].includes(status)) {
      res.status(400).json({ message: 'Valid status is required (todo, in-progress, done)' });
      return;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task status', error: (error as Error).message });
  }
};

// @desc    Get tasks statistics
// @route   GET /api/tasks/stats
// @access  Public
export const getTaskStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const total = await Task.countDocuments();
    const todoCount = await Task.countDocuments({ status: 'todo' });
    const inProgressCount = await Task.countDocuments({ status: 'in-progress' });
    const doneCount = await Task.countDocuments({ status: 'done' });

    const highPriority = await Task.countDocuments({ priority: 'high' });
    const mediumPriority = await Task.countDocuments({ priority: 'medium' });
    const lowPriority = await Task.countDocuments({ priority: 'low' });

    res.json({
      total,
      byStatus: {
        todo: todoCount,
        inProgress: inProgressCount,
        done: doneCount,
      },
      byPriority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: (error as Error).message });
  }
};
