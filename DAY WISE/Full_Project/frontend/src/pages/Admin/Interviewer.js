import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  TextField,
  Button,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Grid,
} from '@mui/material';

function Interviewer() {
  const [interviewers, setInterviewers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    contact: '',
    roles: 'ROLE_INTERVIEWER'
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    contact: ''
  });

  const token = localStorage.getItem('token');
  const apiUrl = 'http://127.0.0.1:8080/api/admin/interviewers';

  useEffect(() => {
    axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response) => {
      setInterviewers(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [apiUrl, token]);

  const filteredInterviewers = interviewers.filter(interviewer =>
    (String(interviewer.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(interviewer.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(interviewer.email).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const showToast = (message, type) => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    }
  };

  const handleAddOrEdit = async () => {
    const { id, name, email, password, contact } = formData;
    if (id && name && email && password && contact) {
      if (editingIndex !== null) {
        await axios.put(`${apiUrl}/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
          const updatedInterviewers = [...interviewers];
          updatedInterviewers[editingIndex] = response.data;
          setInterviewers(updatedInterviewers);
          setEditingIndex(null);
          setFormData({
            id: '',
            name: '',
            email: '',
            password: '',
            contact: '',
            roles: 'ROLE_INTERVIEWER'
          });
          showToast('Interviewer updated successfully!', 'success');
        }).catch((error) => {
          console.log(error);
          showToast('Failed to update interviewer.', 'error');
        });
      } else {
        await axios.post(apiUrl, formData, {
          headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
          setInterviewers([...interviewers, response.data]);
          setFormData({
            id: '',
            name: '',
            email: '',
            password: '',
            contact: '',
            roles: 'ROLE_INTERVIEWER'
          });
          showToast('Interviewer added successfully!', 'success');
        }).catch((error) => {
          console.log(error);
          showToast('Failed to add interviewer.', 'error');
        });
      }
    } else {
      showToast('All fields must be filled out.', 'error');
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditFormData(interviewers[index]);
  };

  const handleSaveClick = async () => {
    await axios.put(`${apiUrl}/${editFormData.id}`, editFormData, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response) => {
      const updatedInterviewers = [...interviewers];
      updatedInterviewers[editingIndex] = response.data;
      setInterviewers(updatedInterviewers);
      setEditingIndex(null);
      setEditFormData({
        id: '',
        name: '',
        email: '',
        password: '',
        contact: ''
      });
      showToast('Interviewer updated successfully!', 'success');
    }).catch((error) => {
      console.log(error);
      showToast('Failed to update interviewer.', 'error');
    });
  };

  const handleCancelClick = () => {
    setEditingIndex(null);
    setEditFormData({
      id: '',
      name: '',
      email: '',
      password: '',
      contact: ''
    });
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this interviewer?")) {
      const interviewerToDelete = interviewers[index];
      await axios.delete(`${apiUrl}/${interviewerToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        const updatedInterviewers = interviewers.filter((_, i) => i !== index);
        setInterviewers(updatedInterviewers);
        showToast('Interviewer deleted successfully!', 'success');
      }).catch((error) => {
        console.log(error);
        showToast('Failed to delete interviewer.', 'error');
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Interviewer Management</Typography>

      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Search interviewers by ID, Name, or Email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={handleAddOrEdit}
            >
              {editingIndex !== null ? 'Update Interviewer' : 'Add Interviewer'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInterviewers.map((interviewer, index) => (
              <TableRow key={interviewer.id}>
                {editingIndex === index ? (
                  <>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        name="id"
                        value={editFormData.id}
                        onChange={handleEditInputChange}
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        name="password"
                        type="password"
                        value={editFormData.password}
                        onChange={handleEditInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        name="contact"
                        value={editFormData.contact}
                        onChange={handleEditInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={handleSaveClick} color="primary">
                        <FontAwesomeIcon icon={faCheck} />
                      </IconButton>
                      <IconButton onClick={handleCancelClick} color="secondary">
                        <FontAwesomeIcon icon={faTimes} />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{interviewer.id}</TableCell>
                    <TableCell>{interviewer.name}</TableCell>
                    <TableCell>{interviewer.email}</TableCell>
                    <TableCell>{interviewer.password}</TableCell>
                    <TableCell>{interviewer.contact}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(index)} color="primary">
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(index)} color="secondary">
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ToastContainer />
    </Container>
  );
}

export default Interviewer;
