import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  Button, TextField, Select, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Alert, Grid, Typography
} from '@mui/material';

function Student() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    registerNo: '',
    name: '',
    email: '',
    password: '',
    dept: '',
    batch: '',
    section: '',
    ratings: '',
    contact: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, message: '', severity: '' });

  const token = localStorage.getItem('token');
  const apiUrl = 'http://127.0.0.1:8080/api/admin/students'; // Adjust endpoint if needed

  useEffect(() => {
    axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response) => {
      setStudents(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [apiUrl, token]);

  const filteredStudents = students.filter(student =>
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     String(student.userId).includes(searchTerm)) &&
    (deptFilter === '' || student.dept === deptFilter)
  );

  const handleInputChange = (e, index = null) => {
    if (index !== null) {
      const updatedStudents = [...students];
      updatedStudents[index] = { ...updatedStudents[index], [e.target.name]: e.target.value };
      setStudents(updatedStudents);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateFields = (data) => {
    let isValid = true;
    let errors = {};
    if (!data.registerNo) errors.registerNo = 'Register No is required';
    if (!data.name) errors.name = 'Name is required';
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';
    if (!data.dept) errors.dept = 'Department is required';
    if (!data.batch) errors.batch = 'Batch is required';
    if (!data.section) errors.section = 'Section is required';
    if (!data.ratings) errors.ratings = 'Ratings are required';
    if (!data.contact) errors.contact = 'Contact is required';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      isValid = false;
    } else {
      setErrors({});
    }
    return isValid;
  };

  const showPopup = (message, severity) => {
    setPopup({ show: true, message, severity });
    setTimeout(() => {
      setPopup({ show: false, message: '', severity: '' });
    }, 5000);
  };

  const handleAddOrEdit = async () => {
    if (validateFields(formData)) {
      if (editingIndex !== null) {
        const updatedStudent = students[editingIndex];
        await axios.put(`${apiUrl}/${updatedStudent.userId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
          const updatedStudents = [...students];
          updatedStudents[editingIndex] = response.data;
          setStudents(updatedStudents);
          setEditingIndex(null);
          setFormData({
            userId: '',
            registerNo: '',
            name: '',
            email: '',
            password: '',
            dept: '',
            batch: '',
            section: '',
            ratings: '',
            contact: ''
          });
          showPopup('Student updated successfully!', 'success');
        }).catch((error) => {
          console.log(error);
        });
      } else {
        await axios.post(apiUrl, formData, {
          headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
          setStudents([...students, response.data]);
          setFormData({
            userId: '',
            registerNo: '',
            name: '',
            email: '',
            password: '',
            dept: '',
            batch: '',
            section: '',
            ratings: '',
            contact: ''
          });
          showPopup('Student added successfully!', 'success');
        }).catch((error) => {
          console.log(error);
        });
      }
    }
  };

  const handleEditClick = (index) => {
    setTempData({ ...students[index] });
    setEditingIndex(index);
    setFormData(students[index]);
  };

  const handleSaveClick = () => {
    setEditingIndex(null);
    setTempData(null);
  };

  const handleCancelClick = () => {
    const updatedStudents = [...students];
    updatedStudents[editingIndex] = tempData;
    setStudents(updatedStudents);
    setEditingIndex(null);
    setTempData(null);
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const studentToDelete = students[index];
      await axios.delete(`${apiUrl}/${studentToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        const updatedStudents = students.filter((_, i) => i !== index);
        setStudents(updatedStudents);
        showPopup('Student deleted successfully!', 'success');
      }).catch((error) => {
        console.log(error);
      });
    }
  };

  return (
    <div sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student Management
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Search by ID, Name, or Email..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            displayEmpty
            fullWidth
            variant="outlined"
          >
            <MenuItem value="">All Departments</MenuItem>
            <MenuItem value="CSE">CSE</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="ECE">ECE</MenuItem>
            <MenuItem value="MECH">MECH</MenuItem>
            <MenuItem value="CIVIL">CIVIL</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Register No"
            name="registerNo"
            variant="outlined"
            fullWidth
            value={formData.registerNo}
            onChange={handleInputChange}
            error={!!errors.registerNo}
            helperText={errors.registerNo}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Department"
            name="dept"
            variant="outlined"
            fullWidth
            value={formData.dept}
            onChange={handleInputChange}
            error={!!errors.dept}
            helperText={errors.dept}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Batch"
            name="batch"
            variant="outlined"
            fullWidth
            value={formData.batch}
            onChange={handleInputChange}
            error={!!errors.batch}
            helperText={errors.batch}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Section"
            name="section"
            variant="outlined"
            fullWidth
            value={formData.section}
            onChange={handleInputChange}
            error={!!errors.section}
            helperText={errors.section}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Ratings"
            name="ratings"
            variant="outlined"
            fullWidth
            value={formData.ratings}
            onChange={handleInputChange}
            error={!!errors.ratings}
            helperText={errors.ratings}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Contact"
            name="contact"
            variant="outlined"
            fullWidth
            value={formData.contact}
            onChange={handleInputChange}
            error={!!errors.contact}
            helperText={errors.contact}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            fullWidth
            onClick={handleAddOrEdit}
          >
            {editingIndex !== null ? 'Save' : 'Add Student'}
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Register No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Ratings</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student, index) => (
              <TableRow key={student.userId}>
                <TableCell>{student.userId}</TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <TextField
                      name="registerNo"
                      value={student.registerNo}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    student.registerNo
                  )}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <TextField
                      name="name"
                      value={student.name}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    student.name
                  )}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <TextField
                      name="email"
                      value={student.email}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    student.email
                  )}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <TextField
                      name="dept"
                      value={student.dept}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    student.dept
                  )}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                                        <TextField
                                        name="batch"
                                        value={student.batch}
                                        onChange={(e) => handleInputChange(e, index)}
                                      />
                                    ) : (
                                      student.batch
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingIndex === index ? (
                                      <TextField
                                        name="section"
                                        value={student.section}
                                        onChange={(e) => handleInputChange(e, index)}
                                      />
                                    ) : (
                                      student.section
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingIndex === index ? (
                                      <TextField
                                        name="ratings"
                                        value={student.ratings}
                                        onChange={(e) => handleInputChange(e, index)}
                                      />
                                    ) : (
                                      student.ratings
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingIndex === index ? (
                                      <TextField
                                        name="contact"
                                        value={student.contact}
                                        onChange={(e) => handleInputChange(e, index)}
                                      />
                                    ) : (
                                      student.contact
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingIndex === index ? (
                                      <>
                                        <IconButton onClick={handleSaveClick} color="primary">
                                          <FontAwesomeIcon icon={faCheck} />
                                        </IconButton>
                                        <IconButton onClick={handleCancelClick} color="secondary">
                                          <FontAwesomeIcon icon={faTimes} />
                                        </IconButton>
                                      </>
                                    ) : (
                                      <>
                                        <IconButton onClick={() => handleEditClick(index)} color="primary">
                                          <FontAwesomeIcon icon={faEdit} />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(index)} color="secondary">
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
                          open={popup.show}
                          autoHideDuration={5000}
                          onClose={() => setPopup({ ...popup, show: false })}
                        >
                          <Alert severity={popup.severity} onClose={() => setPopup({ ...popup, show: false })}>
                            {popup.message}
                          </Alert>
                        </Snackbar>
                      </div>
                    );
                  }
                  
                  export default Student;
                  
