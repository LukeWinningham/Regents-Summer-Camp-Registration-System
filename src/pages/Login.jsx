import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RUBackground from '../assets/RUBackground.jpg';
import RULogo from '../assets/RULogo.webp';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const initialValues = {
  email: '',
  password: '',
};

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', overflow: 'hidden', position: 'fixed', width: '100%' }}>
      {/* Background */}
      <Box
        sx={{
          width: '50%',
          backgroundImage: `url(${RUBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', md: 'block' },
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      />

      {/* Right side - Login Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          height: '100vh',
          position: 'fixed',
          right: 0,
          overflowY: 'auto',
        }}
      >
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 2,
              mb: 4,
            }}
          >
          <Box
              component="img"
              src={RULogo}
              alt="Regent University Logo"
              sx={{
                height: 100
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                color: '#002147', 
                fontWeight: 'bold',
                mb: 3,
              }}
            >
              Welcome Back
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                {error}
              </Alert>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form style={{ width: '100%' }}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: '#002147',
                      '&:hover': {
                        backgroundColor: '#001a36', 
                      },
                    }}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login; 