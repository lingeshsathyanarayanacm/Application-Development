import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
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
  Container,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Alert } from '@mui/material';

function Head() {
  const [heads, setHeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    contact: '',
    dept: '',
    roles: 'ROLE_HEAD',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const token = localStorage.getItem('token');
  const apiUrl = 'http://127.0.0.1:8080/api/admin/heads';

  useEffect(() => {
    axios
      .get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setHeads(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [apiUrl, token]);

  const filteredHeads = heads.filter(
    (head) =>
      (head.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        head.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(head.id).includes(searchTerm)) &&
      (deptFilter === '' || head.dept === deptFilter)
  );

  const handleInputChange = (e, index = null) => {
    if (index !== null) {
      const updatedHeads = [...heads];
      updatedHeads[index] = { ...updatedHeads[index], [e.target.name]: e.target.value };
      setHeads(updatedHeads);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateFields = (data) => {
    let isValid = true;
    let errors = {};
    if (!data.name) errors.name = 'Name is required';
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';
    if (!data.contact) errors.contact = 'Contact is required';
    if (!data.dept) errors.dept = 'Department is required';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      isValid = false;
    } else {
      setErrors({});
    }
    return isValid;
  };

  const handleAddOrEdit = async () => {
    if (validateFields(formData)) {
      try {
        if (editingIndex !== null) {
          const updatedHead = heads[editingIndex];
          const response = await axios.put(`${apiUrl}/${updatedHead.id}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const updatedHeads = [...heads];
          updatedHeads[editingIndex] = response.data;
          setHeads(updatedHeads);
          setEditingIndex(null);
          setFormData({
            id: '',
            name: '',
            email: '',
            password: '',
            contact: '',
            dept: '',
            roles: 'ROLE_HEAD',
          });
          setSnackbarMessage('Head updated successfully!');
        } else {
          const response = await axios.post(apiUrl, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setHeads([...heads, response.data]);
          setFormData({
            id: '',
            name: '',
            email: '',
            password: '',
            contact: '',
            dept: '',
            roles: 'ROLE_HEAD',
          });
          setSnackbarMessage('Head added successfully!');
        }
        setSnackbarSeverity('success');
      } catch (error) {
        console.log(error);
        setSnackbarMessage(editingIndex !== null ? 'Failed to update head.' : 'Failed to add head.');
        setSnackbarSeverity('error');
      }
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = (index) => {
    setTempData({ ...heads[index] });
    setEditingIndex(index);
    setFormData(heads[index]);
  };

  const handleSaveClick = () => {
    setEditingIndex(null);
    setTempData(null);
  };

  const handleCancelClick = () => {
    const updatedHeads = [...heads];
    updatedHeads[editingIndex] = tempData;
    setHeads(updatedHeads);
    setEditingIndex(null);
    setTempData(null);
  };

  const handleDelete = async (index) => {
    if (window.confirm('Are you sure you want to delete this head?')) {
      const headToDelete = heads[index];
      try {
        await axios.delete(`${apiUrl}/${headToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedHeads = heads.filter((_, i) => i !== index);
        setHeads(updatedHeads);
        setSnackbarMessage('Head deleted successfully!');
        setSnackbarSeverity('success');
      } catch (error) {
        console.log(error);
        setSnackbarMessage('Failed to delete head.');
        setSnackbarSeverity('error');
      }
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Head Management
      </Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="dept-filter-label">Department</InputLabel>
            <Select
              labelId="dept-filter-label"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              label="Department"
            >
              <MenuItem value="">All Departments</MenuItem>
              <MenuItem value="CSE">CSE</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="ECE">ECE</MenuItem>
              <MenuItem value="MECH">MECH</MenuItem>
              <MenuItem value="CIVIL">CIVIL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              error={!!errors.contact}
              helperText={errors.contact}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              name="dept"
              value={formData.dept}
              onChange={handleInputChange}
              error={!!errors.dept}
              helperText={errors.dept}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FontAwesomeIcon icon={editingIndex !== null ? faEdit : faPlus} />}
              onClick={handleAddOrEdit}
              fullWidth
            >
              {editingIndex !== null ? 'Update Head' : 'Add Head'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHeads.map((head, index) => (
              <TableRow key={head.id}>
                <TableCell>{head.id}</TableCell>
                <TableCell>{head.name}</TableCell>
                <TableCell>{head.email}</TableCell>
                <TableCell>{head.contact}</TableCell>
                <TableCell>{head.dept}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEditClick(index)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Head;
