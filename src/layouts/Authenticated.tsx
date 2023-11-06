import { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthMutation } from '@/api/authApi';
import { HeaderKey } from '@/constants/enum';
import useIsFirstRender from '@/hooks/useIsFirstRender';
import { setUser } from '@/reducers/auth';
import { RootState } from '@/reducers/store';
import Hamster from './Hamster';

export default function Authenticated() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.auth);

  const { isFirstRender } = useIsFirstRender();

  const clientId = localStorage.getItem(HeaderKey.clientId);

  const [onAuth, { isLoading }] = useAuthMutation();

  const handleAuth = async () => {
    try {
      if (!clientId) {
        navigate('/auth/login');
        throw new Error();
      }
      const user = await onAuth().unwrap();

      dispatch(setUser(user));
    } catch (error) {
      localStorage.removeItem(HeaderKey.clientId);
      navigate('/auth/login');
    }
  };

  useEffect(() => {
    if (isFirstRender) {
      handleAuth();
    }
  });

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return isLoading || isFirstRender ? (
    <Hamster />
  ) : user || location.pathname === '/auth/login' ? (
    <Outlet />
  ) : (
    <Navigate to='/auth/login' />
  );
}
