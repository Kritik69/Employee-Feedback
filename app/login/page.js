'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  Fab,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://employee-feedback-server-315893334095.europe-west1.run.app/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('adminToken', response.data.token);
      router.push('/admin');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                animation: 'slideIn 0.3s ease-out',
                '@keyframes slideIn': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(-10px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                minWidth: 200,
                height: 48,
                position: 'relative',
              }}
            >
              {loading ? (
                <CircularProgress 
                  size={24} 
                  sx={{
                    color: theme.palette.primary.main,
                  }}
                />
              ) : (
                'Login'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
} 