import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeadProfileImg from '../../assets/images/attend-interview-image.png';

const HeadProfile = () => {
  const [headData, setHeadData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    dept: '',
    roles: '',
    experience: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const email = localStorage.getItem('email');

  useEffect(() => {
    if (email) {
      fetchHeadData();
    } else {
      console.error("No email found in localStorage");
    }
  }, [email]);

  const fetchHeadData = async () => {
    if (!email) {
      console.error("No email provided for fetching data.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`http://localhost:8080/api/heads/${email}`, config);

      setHeadData({
        name: response.data.name || '',
        email: response.data.email || '',
        password: response.data.password || '',
        contact: response.data.contact || '',
        dept: response.data.dept || '',
        roles: response.data.roles || '',
        experience: response.data.experience || '',
        departmentratings: response.data.departmentratings || '',
      });
    } catch (error) {
      console.error('Error fetching head data:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const emptyFields = Object.values(headData).some(field => field === '');
    if (emptyFields) {
      alert('Fields cannot be empty');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`http://localhost:8080/api/head/${email}`, headData, config);
      setShowConfirmation(false);
      setIsEditing(false);
      alert('Data saved successfully');
    } catch (error) {
      console.error('Error saving head data:', error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setHeadData({ ...headData, [e.target.name]: e.target.value });
  };

  return (
    <div className='profile-head-whole-container'>
      <div className="profile-head-container">
        <div className="profile-image-container">
          <img src={HeadProfileImg} alt="Head" className="profile-image" />
        </div>
        <h2>Head Profile</h2>
        <form className="profile-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={headData.name}
              onChange={handleChange}
              disabled={!isEditing} 
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={headData.email} 
              onChange={handleChange} 
              disabled
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              name="password" 
              value={headData.password} 
              onChange={handleChange} 
              disabled={!isEditing} 
            />
          </div>
          <div className="form-group">
            <label>Contact:</label>
            <input 
              type="text" 
              name="contact" 
              value={headData.contact} 
              onChange={handleChange} 
              disabled={!isEditing} 
            />
          </div>
          <div className="form-group">
            <label>Department:</label>
            <input 
              type="text" 
              name="dept" 
              value={headData.dept} 
              onChange={handleChange} 
              disabled={!isEditing} 
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <input 
              type="text" 
              name="roles"
              value={headData.roles} 
              onChange={handleChange} 
              disabled 
            />
          </div>
          <div className="form-group">
            <label>Years of Experience:</label>
            <input 
              type="text" 
              name="experience" 
              value={headData.experience} 
              onChange={handleChange} 
              disabled={!isEditing} 
            />
          </div>
          {isEditing ? (
            <div className="form-actions">
              <button type="button" className="profile-save-button" onClick={handleSaveClick}>Save</button>
              <button type="button" className="profile-cancel-button" onClick={handleCancelClick}>Cancel</button>
            </div>
          ) : (
            <button type="button" className="profile-edit-button" onClick={handleEditClick}>Edit</button>
          )}
        </form>
      </div>
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to save the changes?</p>
          <div className="confirmation-actions">
            <button className="confirm-button" onClick={confirmSave}>Yes</button>
            <button className="cancel-button" onClick={() => setShowConfirmation(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadProfile;
