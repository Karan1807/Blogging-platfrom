import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleContinueAsGuest = () => {
    navigate('/');
  };

  const handleLogin = () => {
    setUsernameError(false);
    setPasswordError(false);
    setError('');
    if (username.trim() === '') {
      setUsernameError(true);
      return;
    }
    if (password.trim() === '') {
      setPasswordError(true);
      return;
    }
    
    if (username === 'Admin' && password === 'admin') {
      // If correct, grant access and redirect to blog page
      localStorage.setItem('user', 'Admin');
      localStorage.setItem('login', true);
      navigate('/'); // Redirect to the blog page
    } else{

    // Retrieve users from local storage and parse JSON string
    const users = JSON.parse(localStorage.getItem('users'));
    if (!users || !Array.isArray(users)) {
      setError('Login failed, please contact Admin');
      return;
    }
    const foundUser = users.find(user => user.username === username);
    if(foundUser){
      if(foundUser.enabled){
    
          if (username === 'Moderator' && password === 'password') {
            // If correct, grant access and redirect to blog page
            localStorage.setItem('Moderator', 'moderator');
            localStorage.setItem('user', 'Moderator');
            localStorage.setItem('login', true);
            navigate('/'); // Redirect to the blog page
          } else if (username === 'Karan' && password === 'password') {
            // If correct, grant access and redirect to blog page
            localStorage.setItem('user', 'Karan');
            localStorage.setItem('login', true);
            navigate('/'); // Redirect to the blog page
          } else {
            // If incorrect, display error message
            setError('Incorrect username or password');
          }
        }
          else {
            // User is disabled, display error message
            setError('Your account has been disabled. Please contact the Administrator.');
          }
      } else {
        // User not found, display error message
        setError('User not found. Please check your username.');
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <Box width="100%" display="flex" justifyContent="center" alignItems="center">
      <Box border={1} borderColor="grey.500" borderRadius={5} p={4} maxWidth="400px" mx="auto" style={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom align="center">Login</Typography>
        {error && (
          <Card variant="outlined" style={{ marginBottom: '16px' }}>
            <CardContent>{error}</CardContent>
          </Card>
        )}
        <form>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            helperText={usernameError ? 'Username is required' : ''}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            helperText={passwordError ? 'Password is required' : ''}
            style={{ marginTop: '16px' }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
            style={{ marginTop: '16px' }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={handleContinueAsGuest}
            style={{ marginTop: '16px' }}
          >
            Continue as Guest
          </Button>
        </form>
      </Box>
    </Box>
  </Box>
  
  );
}

export default Login;
