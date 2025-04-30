import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useRegistrations } from '../context/RegistrationContext';
import emailjs from '@emailjs/browser';
import RUBackground from '../assets/RUBackground.jpg';
import RULogo from '../assets/RULogo.webp';

emailjs.init("dLh6Ak54OrRjs1krk");

const validationSchema = Yup.object().shape({
  studentName: Yup.string().required('Student name is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
  grade: Yup.string().required('Grade is required'),
  parentName: Yup.string().required('Parent name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  program: Yup.string().required('Program selection is required'),
  emergencyContact: Yup.string().required('Emergency contact is required'),
  emergencyPhone: Yup.string().required('Emergency phone is required'),
});

const initialValues = {
  studentName: '',
  dateOfBirth: '',
  grade: '',
  parentName: '',
  email: '',
  phone: '',
  program: '',
  emergencyContact: '',
  emergencyPhone: '',
  additionalNotes: '',
};

const programs = ['Summer Camp 2025'];

const grades = [
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
];

const Registration = () => {
  const [emailCheckInProgress, setEmailCheckInProgress] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const navigate = useNavigate();
  const { 
    addRegistration, 
    checkEmailExists, 
    checkProgramAvailability,
    getWaitlistPosition 
  } = useRegistrations();

  const handleEmailBlur = async (e, setFieldValue) => {
    const email = e.target.value;
    if (!email) return;

    setEmailCheckInProgress(true);
    const exists = checkEmailExists(email);
    setEmailExists(exists);
    setEmailCheckInProgress(false);
  };

  const sendConfirmationEmail = async (registrationData, isWaitlist = false) => {
    try {
      console.log('Sending email with data:', registrationData);

      // Validate email before sending
      if (!registrationData.email || !registrationData.email.includes('@')) {
        throw new Error('Invalid email address');
      }

      const templateParams = {
        to_name: registrationData.parentName,
        to_email: registrationData.email,
        student_name: registrationData.studentName,
        program: registrationData.program,
        grade: registrationData.grade,
        date: new Date().toLocaleDateString(),
        position: isWaitlist ? getWaitlistPosition() : null,
      };

      console.log('Template params:', templateParams);

      // Validate all required fields
      if (!templateParams.to_email || !templateParams.to_name || !templateParams.student_name) {
        throw new Error('Missing required email parameters');
      }

      // Initialize EmailJS with public key
      emailjs.init("dLh6Ak54OrRjs1krk");
      const response = await emailjs.send(
        'service_lgg3a0i',
        isWaitlist ? 'template_tqul11c' : 'template_pu1j2sm',
        templateParams
      );

      if (response.status !== 200) {
        throw new Error(`Email sending failed with status: ${response.status}`);
      }

      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      console.error('Error details:', {
        status: error.status,
        text: error.text,
        data: error.data
      });
      setEmailError(true);
      return false;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('Form values:', values);

      if (emailExists) {
        setSubmitting(false);
        return;
      }

      // Check if program is full
      const isProgramFull = checkProgramAvailability(values.program);
      
      let emailSent = false;
      if (isProgramFull) {
        // Add to waitlist
        setIsWaitlisted(true);
        const waitlistData = { ...values, status: 'waitlisted' };
        addRegistration(waitlistData);
        emailSent = await sendConfirmationEmail(waitlistData, true);
      } else {
        // Regular registration
        const enrollmentData = { ...values, status: 'enrolled' };
        addRegistration(enrollmentData);
        emailSent = await sendConfirmationEmail(enrollmentData);
      }
      
      setRegistrationSuccess(true);
      
      if (!emailSent) {
        console.warn('Registration successful but email failed to send');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <Box sx={{ height: '100vh', display: 'flex' }}>
        {/* Background */}
        <Box
          sx={{
            width: '50%',
            backgroundImage: `url(${RUBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', md: 'block' },
          }}
        />

        {/* Right side - Success Message */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={3}
              sx={{
                p: 4,
                width: '100%',
                maxWidth: '600px',
                textAlign: 'center',
                borderTop: '4px solid',
                borderColor: emailError ? 'error.main' : 'success.main',
                backgroundColor: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom color={emailError ? 'error.main' : 'success.main'}>
                {isWaitlisted ? 'Waitlist Confirmation' : 'Registration Successful!'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {isWaitlisted 
                  ? 'Your student has been added to the waitlist. You will be notified if a spot becomes available.'
                  : emailError 
                    ? 'Your registration was successful, but we were unable to send the confirmation email. Try again later.'
                    : 'Thank you for registering. A confirmation email has been sent to your email address.'}
              </Typography>
            </Paper>
          </Container>
        </Box>
      </Box>
    );
  }

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

      {/* Right side - Registration Form */}
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
              width: '100%',
              maxWidth: '600px',
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
              Student Registration
            </Typography>

            {emailExists && (
              <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                This email is already registered.
              </Alert>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <Typography variant="h6" sx={{ color: 'primary.main' }}>
                    Student Information
                  </Typography>
                  <Divider />

                  <Field
                    as={TextField}
                    name="studentName"
                    label="Student Name"
                    fullWidth
                    error={touched.studentName && Boolean(errors.studentName)}
                    helperText={touched.studentName && errors.studentName}
                  />

                  <Field
                    as={TextField}
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                    helperText={touched.dateOfBirth && errors.dateOfBirth}
                  />

                  <Field
                    as={TextField}
                    name="grade"
                    label="Grade"
                    select
                    fullWidth
                    error={touched.grade && Boolean(errors.grade)}
                    helperText={touched.grade && errors.grade}
                  >
                    {grades.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Field>

                  <Typography variant="h6" sx={{ color: 'primary.main', mt: 2 }}>
                    Parent/Guardian Information
                  </Typography>
                  <Divider />

                  <Field
                    as={TextField}
                    name="parentName"
                    label="Parent/Guardian Name"
                    fullWidth
                    error={touched.parentName && Boolean(errors.parentName)}
                    helperText={touched.parentName && errors.parentName}
                  />

                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    onBlur={(e) => handleEmailBlur(e, setFieldValue)}
                  />
                  {emailCheckInProgress && (
                    <Typography variant="caption" color="text.secondary">
                      Checking email availability...
                    </Typography>
                  )}

                  <Field
                    as={TextField}
                    name="phone"
                    label="Phone Number"
                    fullWidth
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />

                  <Typography variant="h6" sx={{ color: 'primary.main', mt: 2 }}>
                    Program Information
                  </Typography>
                  <Divider />

                  <Field
                    as={TextField}
                    name="program"
                    label="Program"
                    select
                    fullWidth
                    error={touched.program && Boolean(errors.program)}
                    helperText={touched.program && errors.program}
                  >
                    {programs.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Field>

                  <Typography variant="h6" sx={{ color: 'primary.main', mt: 2 }}>
                    Emergency Contact
                  </Typography>
                  <Divider />

                  <Field
                    as={TextField}
                    name="emergencyContact"
                    label="Emergency Contact Name"
                    fullWidth
                    error={touched.emergencyContact && Boolean(errors.emergencyContact)}
                    helperText={touched.emergencyContact && errors.emergencyContact}
                  />

                  <Field
                    as={TextField}
                    name="emergencyPhone"
                    label="Emergency Contact Phone"
                    fullWidth
                    error={touched.emergencyPhone && Boolean(errors.emergencyPhone)}
                    helperText={touched.emergencyPhone && errors.emergencyPhone}
                  />

                  <Field
                    as={TextField}
                    name="additionalNotes"
                    label="Additional Notes"
                    multiline
                    rows={4}
                    fullWidth
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={isSubmitting || emailExists}
                    sx={{
                      mt: 2,
                      backgroundColor: '#002147',
                      '&:hover': {
                        backgroundColor: '#001a36',
                      },
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
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

export default Registration; 