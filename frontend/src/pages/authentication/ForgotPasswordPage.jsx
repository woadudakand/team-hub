import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { forgotPassword } from '../../features/auth/authSlice';
import { Button, TextField, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

const ForgotSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [sent, setSent] = React.useState(false);

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={2} borderRadius={2}>
      <Typography variant="h5" mb={2}>Forgot Password</Typography>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotSchema}
        onSubmit={async (values) => {
          const res = await dispatch(forgotPassword(values));
          if (!res.error) setSent(true);
        }}
      >
        {({ handleChange }) => (
          <Form>
            <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
            {error && <Alert severity="error">{error}</Alert>}
            {sent && <Alert severity="success">If the email exists, a reset link will be sent.</Alert>}
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }} startIcon={loading && <CircularProgress size={20} />}>
              Send Reset Link
            </Button>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Link to="/signin">Back to Sign In</Link>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
