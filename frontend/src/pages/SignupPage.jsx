import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { signup } from '../features/auth/authSlice';
import { Button, TextField, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  f_name: Yup.string().required('First name is required'),
  l_name: Yup.string().required('Last name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={2} borderRadius={2}>
      <Typography variant="h5" mb={2}>Sign Up</Typography>
      <Formik
        initialValues={{ f_name: '', l_name: '', username: '', email: '', password: '' }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          const res = await dispatch(signup(values));
          if (!res.error) navigate('/signin');
        }}
      >
        {({ handleChange }) => (
          <Form>
            <TextField label="First Name" name="f_name" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Last Name" name="l_name" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Username" name="username" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }} startIcon={loading && <CircularProgress size={20} />}>
              Sign Up
            </Button>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Link to="/signin">Already have an account?</Link>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
