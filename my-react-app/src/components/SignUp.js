import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import '../assets/css/SignUp.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      setMessage('Signup successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect to login page after 2 seconds
    } else {
      setMessage('Please fill out all fields');
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Signup</button>
      </form>
      {message && <p className={message.includes('successful') ? 'success' : 'error'}>{message}</p>}
    </div>
  );
};

export default Signup;