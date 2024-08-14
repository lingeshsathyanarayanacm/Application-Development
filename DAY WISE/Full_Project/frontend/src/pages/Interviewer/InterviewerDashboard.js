import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import InterviewerProfileImg from '../../assets/images/attend-interview-image.png';
import InterviewerProfile from './InterviewerProfile';
import InterviewerStudent from './InterviewerStudent';
import ViewInterviewees from './ViewInterviewees';
import InterviewsManager from './InterviewsManager';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Container,
  Typography,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function InterviewerDashboard() {
  const handleLogout = (e) => {
    e.preventDefault();
    // Perform logout action here (e.g., clearing tokens, redirecting to login)
  };

  const menuItems = [
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/interviewer-dashboard/' },
    { text: 'Interview', icon: <EventIcon />, path: '/interviewer-dashboard/schedules' },
    { text: 'Students', icon: <PeopleIcon />, path: '/interviewer-dashboard/students' },
    { text: 'Logout', icon: <ExitToAppIcon />, path: '/', action: handleLogout },
  ];

  return (
    <Container maxWidth="xl" sx={{ display: 'flex', height: '100vh', padding: 0 }}>
      <Box sx={{ width: 250, backgroundColor: 'primary.main', color: '#fff', padding: 2 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
          <Avatar src={InterviewerProfileImg} alt="Profile" sx={{ width: 100, height: 100, margin: 'auto' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Interviewer Panel
          </Typography>
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
          <Route path="profile" element={<InterviewerProfile />} />
          <Route path="view-interviews" element={<ViewInterviewees />} />
          <Route path="students" element={<InterviewerStudent />} />
          <Route path="schedules" element={<InterviewsManager />} />
          <Route path="/" element={<DefaultContent />} />
        </Routes>
      </Box>
    </Container>
  );
}

const DefaultContent = () => (
  <div className="card-container">
    <div className="card notification-card">
      <h3>Notifications</h3>
      <p><strong>System Update:</strong> The system will undergo maintenance on Friday at 3 PM.</p>
      <p><strong>New Interview:</strong> A new interview has been scheduled. Check the interview management section for details.</p>
    </div>
    <div className="card update-card">
      <h3>Daily Updates</h3>
      <p><strong>Today’s Tasks:</strong> Review new assignments, check interview schedules, and update interview notes.</p>
      <p><strong>Pending Actions:</strong> Approve new interview requests and verify interview details.</p>
    </div>
    <div className="card stats-card">
      <h3>Statistics</h3>
      <p><strong>Total Interviews:</strong> 50</p>
      <p><strong>Upcoming Interviews:</strong> 5</p>
      <p><strong>Recent Feedback:</strong> 10 new feedbacks</p>
    </div>
  </div>
);

export default InterviewerDashboard;
