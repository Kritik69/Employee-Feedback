'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Grid,
  IconButton,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  useTheme,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import axios from 'axios';
import { io } from 'socket.io-client';
import useSWR, { mutate } from 'swr';

const categories = ['All', 'Work Environment', 'Leadership', 'Growth', 'Others'];

const fetcher = async (url) => {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('No token found');
  
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default function AdminDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [socket, setSocket] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  const { data: feedbackList, error } = useSWR(
    `https://employee-feedback-server-315893334095.europe-west1.run.app/api/feedback${selectedCategory !== 'All' ? `?category=${selectedCategory}` : ''}`,
    fetcher
  );

  useEffect(() => {
    const socketInstance = io('https://employee-feedback-server-315893334095.europe-west1.run.app');
    setSocket(socketInstance);

    socketInstance.on('newFeedback', () => {
      mutate(`https://employee-feedback-server-315893334095.europe-west1.run.app/api/feedback${selectedCategory !== 'All' ? `?category=${selectedCategory}` : ''}`);
    });

    return () => socketInstance.disconnect();
  }, [selectedCategory]);

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
      localStorage.setItem('viewMode', newMode); // Save preference
    }
  };

  const handleReviewedToggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `https://employee-feedback-server-315893334095.europe-west1.run.app/api/feedback/${id}/reviewed`,
        { reviewed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mutate(`https://employee-feedback-server-315893334095.europe-west1.run.app/api/feedback${selectedCategory !== 'All' ? `?category=${selectedCategory}` : ''}`);
    } catch (error) {
      if (error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `https://employee-feedback-server-315893334095.europe-west1.run.app/api/feedback/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mutate(`https://employee-feedback-server-315893334095.europe-west1.run.app/api/feedback${selectedCategory !== 'All' ? `?category=${selectedCategory}` : ''}`);
    } catch (error) {
      if (error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const toggleTheme = () => {
    const currentMode = localStorage.getItem('themeMode') || 'light';
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', newMode);
    window.location.reload();
  };

  useEffect(() => {
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  if (error?.message === 'No token found') {
    router.push('/login');
    return null;
  }

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography color="error">Failed to load feedback</Typography>
    </Box>
  );

  if (!feedbackList) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress color="primary" />
    </Box>
  );

  const renderGridView = () => (
    <Grid container spacing={3}>
      {feedbackList.map((feedback) => (
        <Grid item xs={12} sm={6} md={4} key={feedback._id}>
          <Card 
            elevation={3}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip
                  label={feedback.category}
                  color="primary"
                  variant={theme.palette.mode === 'dark' ? 'outlined' : 'filled'}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {feedback.text}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
              <Switch
                checked={feedback.reviewed}
                onChange={() => handleReviewedToggle(feedback._id, feedback.reviewed)}
                color="primary"
              />
              <IconButton
                onClick={() => handleDelete(feedback._id)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Feedback</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedbackList.map((feedback) => (
            <TableRow 
              key={feedback._id}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell>{feedback.text}</TableCell>
              <TableCell>
                <Chip
                  label={feedback.category}
                  color="primary"
                  variant={theme.palette.mode === 'dark' ? 'outlined' : 'filled'}
                  size="small"
                />
              </TableCell>
              <TableCell>{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
              <TableCell align="center">
                <Switch
                  checked={feedback.reviewed}
                  onChange={() => handleReviewedToggle(feedback._id, feedback.reviewed)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => handleDelete(feedback._id)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper elevation={3} sx={{ p: 0.5 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="grid">
                <Tooltip title="Grid View">
                  <GridViewIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="list">
                <Tooltip title="List View">
                  <ViewListIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
          <Fab
            color="primary"
            onClick={toggleTheme}
            size="medium"
          >
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </Fab>
        </Box>
      </Box>
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ p: 1 }}>
          <ToggleButtonGroup
            value={selectedCategory}
            exclusive
            onChange={handleCategoryChange}
            aria-label="category filter"
          >
            {categories.map((category) => (
              <ToggleButton key={category} value={category}>
                {category}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Paper>
      </Box>

      {viewMode === 'grid' ? renderGridView() : renderListView()}
    </Container>
  );
} 