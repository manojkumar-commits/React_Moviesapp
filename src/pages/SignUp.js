import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Grid, Alert, Typography } from '@mui/material';
import useNavigation from './Hooks/useNavigation';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const { goToPage } = useNavigation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        email,
        password,
      });
      setMessage({ type: 'success', text: response.data.message });
      goToPage('/');  // Navigate to home or other page after sign-up
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'An error occurred' });
    }
  };

  const isButtonDisabled = !email || !password;

  return (
    <Container>
      <Grid container spacing={2} alignItems="center" style={{ minHeight: '100vh' }}>
        {/* Left Side: Form */}
        <Grid item xs={12} md={6}>
          <h2>Sign Up</h2>
          {message && <Alert severity={message.type}>{message.text}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              variant="contained" 
              color="primary" 
              type="submit" 
              fullWidth 
              disabled={isButtonDisabled}
            >
              Sign Up
            </Button>
          </form>
          
          {/* Back to Login Button */}
          <Button 
            variant="text" 
            color="secondary" 
            onClick={() => goToPage('/')} // Assuming '/login' is the login page route
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Back to Login
          </Button>
        </Grid>

        {/* Right Side: Additional Content */}
        <Grid item xs={12} md={6} style={{ textAlign: 'center' }}>
          <div>
            <Typography variant="h4" gutterBottom>
              Welcome to Our Platform
            </Typography>
            <Typography variant="body1" gutterBottom>
              Join us to access exclusive features and content. Sign up now and be a part of our community.
            </Typography>
            <img
              src="/signup.png"
              alt="Sign Up Illustration"
              style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }}
            />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUp;
