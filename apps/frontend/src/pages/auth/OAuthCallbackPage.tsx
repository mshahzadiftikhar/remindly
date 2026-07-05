import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { setToken } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import { User } from '../../lib/types';

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/auth/login');
      return;
    }
    setToken(token);
    api
      .get<User>('/auth/me')
      .then((res) => {
        setUser(res.data);
        navigate('/dashboard');
      })
      .catch(() => navigate('/auth/login'));
  }, [searchParams, setUser, navigate]);

  return null;
}
