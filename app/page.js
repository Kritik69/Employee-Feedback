'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Snackbar,
  Alert,
  Fab,
  useTheme,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import axios from 'axios';
import { API_URL } from './config';

const categories = ['Work Environment', 'Leadership', 'Growth', 'Others'];

export default function Home() {
  const theme = useTheme();
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (!feedback.trim()) {
        setError('Feedback text is required');
        return;
      }
      
      if (!category) {
        setError('Please select a category');
        return;
      }

      await axios.post(`${API_URL}/api/feedback`, {
        text: feedback.trim(),
        category
      });

      setFeedback('');
      setCategory('');
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTheme = () => {
    const currentMode = localStorage.getItem('themeMode') || 'light';
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', newMode);
    window.location.reload();
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        py: 4,
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
        <Fab
          color="primary"
          onClick={toggleTheme}
          size="medium"
        >
          {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </Fab>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: theme.palette.primary.main,
            backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            fontWeight: 700,
            background: theme.palette.mode === 'dark'
              ? `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              : 'inherit',
            WebkitBackgroundClip: theme.palette.mode === 'dark' ? 'text' : 'unset',
            WebkitTextFillColor: theme.palette.mode === 'dark' ? 'transparent' : 'inherit',
          }}
        >
          Employee Feedback
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                minWidth: 200,
                height: 48,
              }}
            >
              Submit Feedback
            </Button>
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success">Thank you for your feedback!</Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
}
