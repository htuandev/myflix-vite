import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Input, InputRef } from 'antd';
import { useLoginMutation } from '@/api/authApi';
import { HeaderKey } from '@/constants/enum';
import homeCinema from '@/images/home_cinema.svg';
import { setUser } from '@/reducers/auth';
import { RootState } from '@/reducers/store';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef<InputRef>(null);

  const { user } = useSelector((state: RootState) => state.auth);

  const [onLogin, { isLoading }] = useLoginMutation();

  const login = handleFetch(async () => {
    const email = ref.current?.input?.value.trim() as string;

    if (!email) {
      notify.error('Email is required');
      return;
    }

    const user = await onLogin({ email }).unwrap();

    dispatch(setUser(user));
    localStorage.setItem(HeaderKey.clientId, user._id);

    navigate('/');
  });

  return user ? (
    <Navigate to='/' />
  ) : (
    <section className=' container flex-center min-h-screen'>
      <div className=' flex w-full max-w-[800px]'>
        <img src={homeCinema} className='hidden w-1/2 md:block' />
        <div className=' grow md:pt-12'>
          <div className=' flex-center flex-col gap-6 p-4'>
            <h1 className=' text-center text-5xl font-medium text-primary'>Myflix</h1>
            <Input ref={ref} placeholder='Email' allowClear />
            <Button loading={isLoading} onClick={login}>
              Access
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
