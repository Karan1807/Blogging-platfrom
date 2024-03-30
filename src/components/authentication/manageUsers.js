import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog'; // Corrected import
import DialogActions from '@mui/material/DialogActions'; // Corrected import
import DialogTitle from '@mui/material/DialogTitle'; // Corrected import
import CssBaseline from '@mui/material/CssBaseline';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

import { createTheme, ThemeProvider } from '@mui/material/styles';


function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    { id: 1, username: 'Karan', role: 'Student', enabled: true },
    { id: 2, username: 'Faculty', role: 'Faculty', enabled: true },
    { id: 3, username: 'Staff', role: 'Staff', enabled: false },
    { id: 4, username: 'Moderator', role: 'Moderator', enabled: true },
    { id: 5, username: 'Student', role: 'Student', enabled: false },
    { id: 6, username: 'Admin', role: 'Admin', enabled: true }
  ]); // State to store the list of users

  useEffect(() => {
    // Load users from localStorage on component mount
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    if (storedUsers) {
      setUsers(storedUsers);
    }
  }, []);

  const handleToggleUser = (id) => {
    // Toggle user enabled state
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, enabled: !user.enabled } : user
    );
    setUsers(updatedUsers);
  };

  const navigateHome = () => {
    navigate('/');
  };

  const navigateToCreatePost = () => {
    navigate('/create-post');
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = () => {
    // Save updated users list to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    setDialogOpen(true);
  };

  const handleBack = () => {
    // Navigate back to the previous page
    navigate('/');
  };
  const defaultTheme = createTheme();

  const sections = [
    { title: 'Academic Resources', id: 'academic-resources' },
    { title: 'Career Services', id: 'career-services' },
    { title: 'Campus', id: 'campus' },
    { title: 'Culture', id: 'culture' },
    { title: 'Local Community Resources', id: 'local-community-resources' },
    { title: 'Social', id: 'social' },
    { title: 'Sports', id: 'sports' },
    { title: 'Health and Wellness', id: 'health-and-wellness' },
    { title: 'Technology', id: 'technology' },
    { title: 'Travel', id: 'travel' },
    { title: 'Alumni', id: 'alumni' },
  ];


  const handleSectionClick = (id) => {
    navigate(`/view-post-grid/${id}`);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
    localStorage.setItem('users', JSON.stringify(users));
    navigate('/'); // Navigate to the home page
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Header
            title="Blog"
            sections={sections.map((section) => ({
              ...section,
              onClick: () => handleSectionClick(section.id),
            }))}
            login={localStorage.getItem('login') === 'true'}
            user={localStorage.getItem('user')}
            extra={
              <>
                <Button color="inherit" onClick={navigateHome}>Home</Button>
                <Button color="inherit" onClick={navigateToCreatePost}>Create</Button>
              </>
            }
          />
          <Box textAlign="center" marginTop={8}>
            <Typography variant="h4" gutterBottom>
              Manage Users
            </Typography>
            <TableContainer component={Paper} sx={{ width: '60%', margin: 'auto', mt: 10, mb: 10 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">Username</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">Role</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">Enable/Disable</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Switch
                          color="primary"
                          checked={user.enabled}
                          onChange={() => handleToggleUser(user.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleSave}>
              Save
            </Button>
            <Dialog
              open={dialogOpen}
              onClose={handleCloseDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Action Performed Successfully!"}</DialogTitle>

              <DialogActions>
                <Button onClick={handleCloseDialog} autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>

            <Button variant="outlined" onClick={handleBack}>
              Cancel
            </Button>
          </Box>
          
        </Container>
      </ThemeProvider>
    </>
  );
}
export default ManageUsers;
