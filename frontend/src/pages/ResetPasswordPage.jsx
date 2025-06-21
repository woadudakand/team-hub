import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '../features/auth/authSlice';
import { Button, TextField, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

const ResetSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
});

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [success, setSuccess] = React.useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={2} borderRadius={2}>
      <Typography variant="h5" mb={2}>Reset Password</Typography>
      <Formik
        initialValues={{ password: '' }}
        validationSchema={ResetSchema}
        onSubmit={async (values) => {
          const res = await dispatch(resetPassword({ ...values, token }));
          if (!res.error) {
            setSuccess(true);
            setTimeout(() => navigate('/signin'), 2000);
          }
        }}
      >
        {({ handleChange }) => (
          <Form>
            <TextField label="New Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Password updated! Redirecting to sign in...</Alert>}
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }} startIcon={loading && <CircularProgress size={20} />}>
              Reset Password
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
