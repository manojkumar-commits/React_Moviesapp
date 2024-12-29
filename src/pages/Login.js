import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Alert, Grid, Box, Typography, Link, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useNavigation from '../pages/Hooks/useNavigation';
import { ToastContainer, toast } from 'react-toastify'; // Import the necessary components
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling the toasts

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { goToPage } = useNavigation();

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      // Save token and expiry in localStorage
      const token = response.data.token;
      const expiryTime = Date.now() + 60 * 1000; // 10 seconds expiry for demo purpose
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiryTime);

      setMessage({ type: 'success', text: response.data.message });
      toast.success("Login Successful!");
      goToPage('/dashboard');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'An error occurred' });
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side - Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          backgroundColor: '#f7f9fc',
        }}
      >
        <Container maxWidth="xs">
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
            Welcome to MovieVerse 🎬
          </Typography>
          <Typography sx={{ marginBottom: 3, textAlign: 'center', color: '#555' }}>
            Explore the world of movies, discover new favorites, and stream unlimited content.
            <br />
            Sign in to start your cinematic journey!
          </Typography>
          {message && <Alert severity={message.type} sx={{ marginBottom: 2 }}>{message.text}</Alert>}
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
              type={showPassword ? 'text' : 'password'} // Toggle between text and password types
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="At least 8 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* <Link
              href="#"
              sx={{ display: 'block', textAlign: 'right', marginBottom: 2, fontSize: '0.9rem', color: '#1976d2' }}
            >
              Forgot Password?
            </Link> */}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={!isFormValid}
              sx={{ marginBottom: 2 }}
            >
              Sign in
            </Button>
            <Typography sx={{ textAlign: 'center', marginBottom: 1, color: '#777' }}>Or</Typography>
            <Typography sx={{ textAlign: 'center', color: '#777' }}>
              Don’t you have an account?{' '}
              <Link href="/signup" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                Sign up
              </Link>
            </Typography>
          </form>
        </Container>
        <Typography sx={{ textAlign: 'center', marginTop: 'auto', color: '#aaa', fontSize: '0.9rem' }}>
          © 2023 ALL RIGHTS RESERVED
        </Typography>
      </Grid>

      {/* Right Side - Image */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            backgroundImage: 'url(/Login.png)', // Use the image from the `public` folder
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Login;
