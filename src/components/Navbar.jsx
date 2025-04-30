import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/register');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          Regent's Summer Camp Registration System
        </Typography>
        <Box>
          {!user ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{ mr: 2 }}
              >
                Register
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 