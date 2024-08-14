import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CircularProgress,
  Avatar,
  Box,
  Paper,
  Divider,
  Container,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);

function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [feedbackData, setFeedbackData] = useState([]);
  const [displayedFeedback, setDisplayedFeedback] = useState([]);
  const [feedbackLimit, setFeedbackLimit] = useState(2);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudentData(response.data);
        console.log('Student Data:', response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/feedbacks/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setFeedbackData(response.data);
        setDisplayedFeedback(response.data.slice(0, feedbackLimit)); // Initially show only 2 feedback entries
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchStudentData();
    fetchFeedbackData();
    setLoading(false);
  }, [studentId, token, feedbackLimit]);

  const handleSeeMore = () => {
    setFeedbackLimit(prevLimit => prevLimit + 2); // Increase limit by 2 on each click
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!studentData || !feedbackData.length) {
    return <Typography variant="h6">No data available</Typography>;
  }

  // Prepare Line chart data for the specific student
  const lineData = {
    labels: feedbackData.map((_, index) => ""),
    datasets: [
      {
        label: 'Relevance',
        data: feedbackData.map(feedback => feedback.relevance),
        borderColor: '#4caf50',
        fill: false,
      },
      {
        label: 'Accuracy',
        data: feedbackData.map(feedback => feedback.accuracy),
        borderColor: '#ffeb3b',
        fill: false,
      },
      {
        label: 'Efficiency',
        data: feedbackData.map(feedback => feedback.efficiency),
        borderColor: '#f44336',
        fill: false,
      },
    ],
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Student Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <Box my={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <Box p={3} display="flex" alignItems="center">
                <Avatar src={studentData.profilePicture} alt={studentData.name} />
                <Box ml={2}>
                  <Typography variant="h5">{studentData.name}</Typography>
                  <Typography variant="subtitle1">{studentData.email}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <Box p={3}>
                <Typography variant="h6">Performance</Typography>
                <Divider sx={{ my: 2 }} />
                <Line data={lineData} options={{ responsive: true }} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <Box p={3}>
                <Typography variant="h6">Recent Feedback</Typography>
                <Divider sx={{ my: 2 }} />
                {displayedFeedback.map((feedback, index) => (
                  <Box key={feedback.id} mb={2}>
                    <Typography variant="body1">Relevance: {feedback.relevance}</Typography>
                    <Typography variant="body1">Accuracy: {feedback.accuracy}</Typography>
                    <Typography variant="body1">Efficiency: {feedback.efficiency}</Typography>
                    {index < displayedFeedback.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
                {feedbackLimit < feedbackData.length && (
                  <Button onClick={handleSeeMore} variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Load More
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth>
              <Link to='/mock-interview' style={{ color: '#fff', textDecoration: 'none' }}>
                Attend Mock Interview
              </Link>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default StudentDashboard;
