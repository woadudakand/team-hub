import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { login } from '../features/auth/authSlice';
import { Button, TextField, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const SigninSchema = Yup.object().shape({
  username: Yup.string(),
  email: Yup.string().email('Invalid email'),
  password: Yup.string().required('Password is required'),
});

export default function SigninPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={2} borderRadius={2}>
      <Typography variant="h5" mb={2}>Sign In</Typography>
      {loading && <Loader size={32} message="Signing in..." />}
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={SigninSchema}
        onSubmit={(values) => {
          dispatch(login(values));
        }}
      >
        {({ errors, touched, handleChange }) => (
          <Form>
            <TextField
              label="Username or Email"
              name="username"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Sign In
            </Button>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Link to="/signup">Sign Up</Link>
              <Link to="/forgot-password">Forgot Password?</Link>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
