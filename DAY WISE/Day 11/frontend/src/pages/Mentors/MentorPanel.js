import React, { useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import MentorProfileImg from '../../assets/images/attend-interview-image.png'; 
import MentorProfile from './MentorProfile';
import MentorStudent from './MentorStudent';
import MentorReports from './MentorReports';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Box, Container, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PeopleIcon from '@mui/icons-material/People';

function MentorDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      navigate('/login', { replace: true });
      window.history.replaceState(null, "", window.location.origin);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/login', { replace: true });
    window.history.replaceState(null, "", window.location.origin);
  };

  const storedEmail = localStorage.getItem('email');
  const storedRole = localStorage.getItem('role');

  const menuItems = [
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/mentor-dashboard' },
    { text: 'Student Details', icon: <PeopleIcon />, path: '/mentor-dashboard/students' },
    { text: 'Reports', icon: <EditIcon />, path: '/mentor-dashboard/reports' },
    { text: 'Logout', icon: <ExitToAppIcon />, path: '/login', action: handleLogout },
  ];

  return (
    <Container maxWidth="xl" sx={{ display: 'flex', height: '100vh', padding: 0 }}>
      <Box sx={{ width: 250, backgroundColor: 'primary.main', color: '#fff', padding: 2 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
          <Avatar src={MentorProfileImg} alt="Profile" sx={{ width: 100, height: 100, margin: 'auto' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {storedEmail || 'Mentor'}
          </Typography>
          <Typography variant="body2">{storedRole || 'Role'}</Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              component={Link} 
              to={item.path} 
              onClick={item.action ? item.action : null}
            >
              <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ flex: 1, padding: 4 }}>
        <Routes>
          <Route path="profile" element={<MentorProfile />} />
          <Route path="students" element={<MentorStudent />} />
          <Route path="reports" element={<MentorReports />} />
          <Route path="/" element={<MentorStudent />} />
        </Routes>
      </Box>
    </Container>
  );
}

export default MentorDashboard;
