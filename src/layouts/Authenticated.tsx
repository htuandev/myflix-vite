import { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthMutation } from '@/api/authApi';
import { HeaderKey } from '@/constants';
import { useIsFirstRender } from '@/hooks';
import { setUser } from '@/reducers/auth';
import { RootState } from '@/reducers/store';
import Hamster from './Hamster';

export default function Authenticated() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const { isFirstRender } = useIsFirstRender();

  const { user } = useSelector((state: RootState) => state.auth);

  const clientId = localStorage.getItem(HeaderKey.clientId);

  const [onAuth] = useAuthMutation();

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
  }, [location.pathname, location.search]);

  return user ? <Outlet /> : <Hamster />;
}
