import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Badge, Menu, MenuItem, Typography, Box, Grid, Paper } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const HeaderWithNotificationsAndCharts = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  // Temporary notification data
  const notifications = [
    { id: 1, message: 'New interview scheduled' },
    { id: 2, message: 'Mentor approved your request' },
    { id: 3, message: 'System maintenance at midnight' },
  ];

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Data for the Bar Chart
  const barChartData = {
    labels: ['10', '15', '23', '20', '25'],
    datasets: [
      {
        label: 'Students Attended',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for the Line Chart
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Mentor Requests',
        data: [5, 15, 10, 6, 8],
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header with Notifications */}
      <AppBar position="static" sx={{ backgroundColor: '#333', color: '#fff' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Head Dashboard
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {notifications.length === 0 ? (
              <MenuItem onClick={handleClose}>No new notifications</MenuItem>
            ) : (
              notifications.map((notification) => (
                <MenuItem key={notification.id} onClick={handleClose}>
                  {notification.message}
                </MenuItem>
              ))
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Charts and Graphs */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Interviews Conducted
              </Typography>
              <Bar data={barChartData} />
            </Paper>
          </Grid>

          {/* Line Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Mentor Requests
              </Typography>
              <Line data={lineChartData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HeaderWithNotificationsAndCharts;
