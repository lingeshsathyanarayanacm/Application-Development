import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Alert } from '@mui/material';

function Mentor() {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [searchBatch, setSearchBatch] = useState('');
  const [editFormData, setEditFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const token = localStorage.getItem('token');
  const apiUrl = 'http://127.0.0.1:8080/api/admin/mentors';

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole === 'ROLE_ADMIN' || userRole === 'ROLE_HEAD') {
      fetchMentors();
    } else {
      setSnackbarMessage('You do not have permission to view this page.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setSnackbarMessage('Error fetching mentors.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (e, field, mentorId) => {
    setEditFormData((prevData) => ({
      ...prevData,
      [mentorId]: {
        ...prevData[mentorId],
        [field]: e.target.value,
      },
    }));
  };

  const handleSaveClick = async (mentorId) => {
    const updatedData = editFormData[mentorId];
    try {
      await axios.put(`${apiUrl}/${mentorId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentors((prevMentors) =>
        prevMentors.map((mentor) =>
          mentor.id === mentorId ? { ...mentor, ...updatedData } : mentor
        )
      );
      setEditFormData((prevData) => {
        const newData = { ...prevData };
        delete newData[mentorId];
        return newData;
      });
      setSnackbarMessage('Mentor updated successfully.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error updating mentor:', error);
      setSnackbarMessage('Error updating mentor.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleCancelClick = (mentorId) => {
    setEditFormData((prevData) => {
      const newData = { ...prevData };
      delete newData[mentorId];
      return newData;
    });
  };

  const handleDelete = async (mentor) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      try {
        await axios.delete(`${apiUrl}/${mentor.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors((prevMentors) => prevMentors.filter((m) => m.id !== mentor.id));
        setSnackbarMessage('Mentor deleted successfully.');
        setSnackbarSeverity('success');
      } catch (error) {
        console.error('Error deleting mentor:', error);
        setSnackbarMessage('Error deleting mentor.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    }
  };

  const startEditing = (mentor) => {
    setEditFormData({ [mentor.id]: mentor });
    setOriginalData(mentor);
  };

  const filteredMentors = mentors.filter(
    (mentor) =>
      (String(mentor.id).includes(searchTerm) ||
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (searchDept ? mentor.dept === searchDept : true) &&
      (searchBatch ? mentor.classBeingMentored === searchBatch : true)
  );

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Mentor Management
      </Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search by ID, Name, or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faSearch} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="dept-filter-label">Department</InputLabel>
            <Select
              labelId="dept-filter-label"
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              label="Department"
            >
              <MenuItem value="">All Departments</MenuItem>
              <MenuItem value="CSE">CSE</MenuItem>
              <MenuItem value="ECE">ECE</MenuItem>
              <MenuItem value="EEE">EEE</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="batch-filter-label">Class Being Mentored</InputLabel>
            <Select
              labelId="batch-filter-label"
              value={searchBatch}
              onChange={(e) => setSearchBatch(e.target.value)}
              label="Class Being Mentored"
            >
              <MenuItem value="">All Classes</MenuItem>
              <MenuItem value="1">Class 1</MenuItem>
              <MenuItem value="2">Class 2</MenuItem>
              <MenuItem value="3">Class 3</MenuItem>
              <MenuItem value="4">Class 4</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Class Being Mentored</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMentors.map((mentor) => (
              <TableRow key={mentor.id}>
                <TableCell>{mentor.id}</TableCell>
                <TableCell>
                  {editFormData[mentor.id] ? (
                    <TextField
                      fullWidth
                      value={editFormData[mentor.id].name}
                      onChange={(e) => handleInputChange(e, 'name', mentor.id)}
                    />
                  ) : (
                    mentor.name
                  )}
                </TableCell>
                <TableCell>
                  {editFormData[mentor.id] ? (
                    <TextField
                      fullWidth
                      type="email"
                      value={editFormData[mentor.id].email}
                      onChange={(e) => handleInputChange(e, 'email', mentor.id)}
                    />
                  ) : (
                    mentor.email
                  )}
                </TableCell>
                <TableCell>
                  {editFormData[mentor.id] ? (
                    <TextField
                      fullWidth
                      type="password"
                      value={editFormData[mentor.id].password}
                      onChange={(e) => handleInputChange(e, 'password', mentor.id)}
                    />
                  ) : (
                    mentor.password
                  )}
                </TableCell>
                <TableCell>
                  {editFormData[mentor.id] ? (
                    <TextField
                      fullWidth
                      value={editFormData[mentor.id].contact}
                      onChange={(e) => handleInputChange(e, 'contact', mentor.id)}
                    />
                  ) : (
                    mentor.contact
                  )}
                </TableCell>
                <TableCell>
                  {editFormData[mentor.id] ? (
                    <TextField
                      fullWidth
                      value={editFormData[mentor.id].dept}
                      onChange={(e) => handleInputChange(e, 'dept', mentor.id)}
                    />
                  ) : (
                    mentor.dept
                  )}
                </TableCell>
                <TableCell>
                  {editFormData[mentor.id] ? (
                    <TextField
                      fullWidth
                      value={editFormData[mentor.id].classBeingMentored}
                      onChange={(e) => handleInputChange(e, 'classBeingMentored', mentor.id)}
                    />
                  ) : (
                    mentor.classBeingMentored
                  )}
                </TableCell>
                <TableCell align="center">
                  {editFormData[mentor.id] ? (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleSaveClick(mentor.id)}
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleCancelClick(mentor.id)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => startEditing(mentor)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(mentor)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Mentor;
