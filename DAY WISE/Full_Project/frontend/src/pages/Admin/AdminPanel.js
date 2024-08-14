import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import AdminProfileImg from '../../assets/images/attend-interview-image.png';
import { Avatar, Box, Button, Container, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import Head from './Head';
import Mentor from './Mentor';
import Student from './Student';
import ScheduleAdminDashboard from './ScheduleAdmin';
import AdminReports from './AdminReports';
import Interviewer from './Interviewer';
import ProfileAdmin from './AdminProfile';

function AdminDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate('/');
  };

  return (
    <Container maxWidth="xl" sx={{ display: 'flex', height: '100vh', padding: 0 }}>
      <Box sx={{ width: 250, backgroundColor: 'primary.main', color: '#fff', padding: 2 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
          <Avatar src={AdminProfileImg} alt="Profile" sx={{ width: 100, height: 100, margin: 'auto' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Admin Panel
          </Typography>
        </Box>
        <List>
          <ListItem button component={Link} to="/admindashboard">
            <ListItemIcon sx={{ color: '#fff' }}>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>
          <ListItem button component={Link} to="/admindashboard/head">
            <ListItemIcon sx={{ color: '#fff' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Head" />
          </ListItem>
          <ListItem button component={Link} to="/admindashboard/mentor">
            <ListItemIcon sx={{ color: '#fff' }}>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Mentor" />
          </ListItem>
          <ListItem button component={Link} to="/admindashboard/interviewer">
            <ListItemIcon sx={{ color: '#fff' }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Interviewers" />
          </ListItem>
          <ListItem button component={Link} to="/admindashboard/student">
            <ListItemIcon sx={{ color: '#fff' }}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Students" />
          </ListItem>
          <ListItem button component={Link} to="/admindashboard/reports">
            <ListItemIcon sx={{ color: '#fff' }}>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
          <Divider sx={{ backgroundColor: '#fff' }} />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ flex: 1, padding: 4 }}>
        <Routes>
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="notifications" element={<DefaultContent />} />
          <Route path="head" element={<Head />} />
          <Route path="mentor" element={<Mentor />} />
          <Route path="interviewer" element={<Interviewer />} />
          <Route path="student" element={<Student />} />
          <Route path="schedules" element={<ScheduleAdminDashboard />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="/" element={<DefaultContent />} />
        </Routes>
      </Box>
    </Container>
  );
}

const DefaultContent = () => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={4}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6">Notifications</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>System Update:</strong> The system will undergo maintenance on Friday at 3 PM.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>New User:</strong> A new user has signed up. Check the user management section for details.
        </Typography>
      </Paper>
    </Grid>
    <Grid item xs={12} md={4}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6">Daily Updates</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Today's Tasks:</strong> Review new feedback, check interview schedules, and update user profiles.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Pending Actions:</strong> Approve new interview requests and verify user credentials.
        </Typography>
      </Paper>
    </Grid>
    <Grid item xs={12} md={4}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6">Statistics</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Total Users:</strong> 350
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Upcoming Interviews:</strong> 12
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Recent Feedback:</strong> 25 new feedbacks
        </Typography>
      </Paper>
    </Grid>
  </Grid>
);

export default AdminDashboard;
