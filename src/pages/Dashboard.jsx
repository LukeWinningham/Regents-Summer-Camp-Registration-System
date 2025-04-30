import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useRegistrations } from '../context/RegistrationContext';
import RULogo from '../assets/RULogo.webp';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const { getRegistrations, removeRegistration } = useRegistrations();
  const registrations = getRegistrations();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleProgramChange = (event) => {
    setSelectedProgram(event.target.value);
  };

  const handleDeleteClick = (registration) => {
    setSelectedRegistration(registration);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (registration) => {
    setSelectedRegistration(registration);
    setViewDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRegistration) {
      await removeRegistration(selectedRegistration.email);
      setDeleteDialogOpen(false);
      setSelectedRegistration(null);
    }
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedRegistration(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enrolled':
        return 'success';
      case 'waitlisted':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredRegistrations = registrations.filter(registration => {
    const statusMatch = selectedTab === 'all' || registration.status === selectedTab.toLowerCase();
    const programMatch = selectedProgram === 'all' || registration.program === selectedProgram;
    return statusMatch && programMatch;
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Staff Dashboard
        </Typography>
        <Box
          component="img"
          src={RULogo}
          alt="Regent University Logo"
          sx={{
            height: 100,
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Registration Table */}
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                  <Tab label="All Enrollments" value="all" />
                  <Tab label="Enrolled" value="enrolled" />
                  <Tab label="Waitlisted" value="waitlisted" />
                </Tabs>
              </Box>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Program</InputLabel>
                <Select
                  value={selectedProgram}
                  onChange={handleProgramChange}
                  label="Program"
                >
                  <MenuItem value="all">All Programs</MenuItem>
                  <MenuItem value="Summer Camp 2025">Summer Camp 2025</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Program</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Parent Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>{registration.studentName}</TableCell>
                      <TableCell>{registration.grade}</TableCell>
                      <TableCell>{registration.program}</TableCell>
                      <TableCell>
                        <Chip
                          label={registration.status}
                          color={getStatusColor(registration.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{registration.date}</TableCell>
                      <TableCell>{registration.parentName}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => handleViewClick(registration)}
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(registration)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this enrollment?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* View Registration Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleViewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Registration Details - {selectedRegistration?.studentName}
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText
                primary="Student Information"
                secondary={
                  <>
                    <Typography variant="body2">
                      Name: {selectedRegistration?.studentName}
                    </Typography>
                    <Typography variant="body2">
                      Grade: {selectedRegistration?.grade}
                    </Typography>
                    <Typography variant="body2">
                      Date of Birth: {selectedRegistration?.dateOfBirth}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Parent/Guardian Information"
                secondary={
                  <>
                    <Typography variant="body2">
                      Name: {selectedRegistration?.parentName}
                    </Typography>
                    <Typography variant="body2">
                      Email: {selectedRegistration?.email}
                    </Typography>
                    <Typography variant="body2">
                      Phone: {selectedRegistration?.phone}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Program Information"
                secondary={
                  <>
                    <Typography variant="body2">
                      Program: {selectedRegistration?.program}
                    </Typography>
                    <Typography variant="body2">
                      Status: {selectedRegistration?.status}
                    </Typography>
                    <Typography variant="body2">
                      Registration Date: {selectedRegistration?.date}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Emergency Contact"
                secondary={
                  <>
                    <Typography variant="body2">
                      Name: {selectedRegistration?.emergencyContact}
                    </Typography>
                    <Typography variant="body2">
                      Phone: {selectedRegistration?.emergencyPhone}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {selectedRegistration?.additionalNotes && (
              <>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Additional Notes"
                    secondary={selectedRegistration.additionalNotes}
                  />
                </ListItem>
              </>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 