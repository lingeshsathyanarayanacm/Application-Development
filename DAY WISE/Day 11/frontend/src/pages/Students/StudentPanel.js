import React, { useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import StudentProfileImg from '../../assets/images/attend-interview-image.png'; 
import StudentProfile from './StudentProfile';
import Schedules from '../Students/Shedules';
import StudentInterviews from '../Students/StudentInterviews';
import VideoRecord from './VideoRecord';
import Performance from './Performance';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Box, Container, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BarChartIcon from '@mui/icons-material/BarChart';

function StudentDashboard() {
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
    { text: 'Interviews', icon: <AssignmentTurnedInIcon />, path: '/student-dashboard/interviews' },
    { text: 'Performance', icon: <BarChartIcon />, path: '/student-dashboard/performance' },
    { text: 'Logout', icon: <ExitToAppIcon />, path: '/login', action: handleLogout },
  ];

  return (
    <Container maxWidth="xl" sx={{ display: 'flex', height: '100vh', padding: 0 }}>
      <Box sx={{ width: 250, backgroundColor: 'primary.main', color: '#fff', padding: 2 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
          <Avatar src={StudentProfileImg} alt="Profile" sx={{ width: 100, height: 100, margin: 'auto' }} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {storedEmail || 'Student'}
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
          <Route path="profile" element={<StudentProfile />} />
          <Route path="interviews" element={<StudentInterviews />} />
          <Route path="videointerview" element={<VideoRecord />} />
          <Route path="performance" element={<Performance />} />
          <Route path="/" element={<Performance />} />
        </Routes>
      </Box>
    </Container>
  );
}

export default StudentDashboard;
