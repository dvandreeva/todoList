import { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { tasksAPI } from '../api/tasks';
import type { TaskStats } from '../api/tasks';

export default function TaskStatsBar() {
  const [stats, setStats] = useState<TaskStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await tasksAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (!stats) return null;

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: <AssignmentIcon />,
      color: '#1976d2',
    },
    {
      label: 'To Do',
      value: stats.byStatus.todo,
      icon: <HourglassIcon />,
      color: '#757575',
    },
    {
      label: 'In Progress',
      value: stats.byStatus.inProgress,
      icon: <PlayArrowIcon />,
      color: '#1976d2',
    },
    {
      label: 'Done',
      value: stats.byStatus.done,
      icon: <CheckCircleIcon />,
      color: '#2e7d32',
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {statItems.map((item) => (
          <Paper
            key={item.label}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ color: item.color }}>{item.icon}</Box>
            <Box>
              <Typography variant="h5" component="div">
                {item.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
