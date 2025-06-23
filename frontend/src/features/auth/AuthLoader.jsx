import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './authSlice';
import { useNavigate } from 'react-router-dom';

export default function AuthLoader({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      dispatch(loadUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (!token || error === 'Failed to load user') {
      console.log('User not authenticated or error loading user:', error);
      navigate('/signin');
    }
  }, [token, error, navigate]);

  return children;
}
