import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const apiUrl = 'http://localhost:8080/api/heads';

function HeadMentor() {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDetails, setViewDetails] = useState(null);
  const [dept, setDept] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`${apiUrl}/id/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setDept(response.data.dept);
        return axios.get(`http://localhost:8080/api/mentors/dept/${response.data.dept}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then((response) => {
        setMentors(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, userId]);

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (mentor) => {
    setViewDetails(mentor);
  };

  const handleClosePopup = () => {
    setViewDetails(null);
  };

  const renderPieChart = (ratings) => {
    const data = {
      labels: ['Ratings', 'Remaining'],
      datasets: [
        {
          label: 'Mentor Ratings',
          data: [ratings, 10 - ratings],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384']
        }
      ]
    };

    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Pie data={data} />
      </Box>
    );
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Mentor Management
      </Typography>
      <TextField
        label="Search by Name or Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Dept</TableCell>
              <TableCell>Class Mentoring</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMentors.map((mentor) => (
              <TableRow key={mentor.email}>
                <TableCell>{mentor.name}</TableCell>
                <TableCell>{mentor.email}</TableCell>
                <TableCell>{mentor.dept}</TableCell>
                <TableCell>{mentor.classBeingMentored}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(mentor)}>
                    <FontAwesomeIcon icon={faEye} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(viewDetails)} onClose={handleClosePopup}>
        <DialogTitle>Mentor Details</DialogTitle>
        {viewDetails && (
          <DialogContent>
            <Typography><strong>Name:</strong> {viewDetails.name}</Typography>
            <Typography><strong>Email:</strong> {viewDetails.email}</Typography>
            <Typography><strong>Department:</strong> {viewDetails.dept}</Typography>
            <Typography><strong>Class Mentoring:</strong> {viewDetails.classBeingMentored}</Typography>
            {renderPieChart(viewDetails.overallRatings)}
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default HeadMentor;
