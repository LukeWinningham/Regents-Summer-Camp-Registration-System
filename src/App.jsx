import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { RegistrationProvider } from './context/RegistrationContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#002147', 
    },
    secondary: {
      main: '#FFD700',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RegistrationProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/register" replace />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Router>
        </RegistrationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
