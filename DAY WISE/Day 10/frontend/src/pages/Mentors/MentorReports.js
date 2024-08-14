import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Card, CardContent } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const apiUrl = 'http://localhost:8080/api/mentors';

function MentorReport() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://127.0.0.1:8080/students/mentor/mentorId/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response) => {
      setStudents(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [token, userId]);

  const handleViewReport = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
  };

  const renderPieChart = (ratings) => {
    const data = {
      labels: ['Ratings'],
      datasets: [
        {
          label: 'Student Ratings',
          data: [ratings, 10 - ratings],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384']
        }
      ]
    };

    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Ratings Distribution</Typography>
          <Pie data={data} />
        </CardContent>
      </Card>
    );
  };

  const renderBarChart = (students) => {
    const data = {
      labels: students.map(student => student.name),
      datasets: [
        {
          label: 'Ratings',
          data: students.map(student => student.ratings),
          backgroundColor: '#36A2EB'
        }
      ]
    };

    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Ratings Comparison</Typography>
          <Bar data={data} />
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Student Ratings Report
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Register No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Ratings</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.registerNo}>
                <TableCell>{student.registerNo}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.ratings}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewReport(student)}>
                    <FontAwesomeIcon icon={faDownload} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Student Report</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Details</Typography>
                <Typography><strong>Register No:</strong> {selectedStudent.registerNo}</Typography>
                <Typography><strong>Name:</strong> {selectedStudent.name}</Typography>
                <Typography><strong>Ratings:</strong> {selectedStudent.ratings}</Typography>
                <Typography><strong>Analysis:</strong> {selectedStudent.ratings > 7 ? "Excellent" : selectedStudent.ratings > 5 ? "Good" : "Needs Improvement"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                {renderPieChart(selectedStudent.ratings)}
              </Grid>
              <Grid item xs={12}>
                {renderBarChart(students)}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MentorReport;
