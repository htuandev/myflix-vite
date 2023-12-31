import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { Form, Input, InputRef } from 'antd';
import { Button } from '@/antd';
import { useLoginMutation } from '@/api/authApi';
import { HeaderKey } from '@/constants';
import { useDocumentTitle } from '@/hooks';
import homeCinema from '@/images/home_cinema.svg';
import { setUser } from '@/reducers/auth';
import { RootState } from '@/reducers/store';
import { handleFetch, notify } from '@/utils';

export default function Login() {
  useDocumentTitle('Login');

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

    navigate('/admin');
  });

  return user ? (
    <Navigate to='/admin' />
  ) : (
    <section className=' container flex-center min-h-screen'>
      <div className=' flex w-full max-w-[800px]'>
        <img src={homeCinema} className='hidden w-1/2 md:block' />
        <div className=' grow md:pt-12'>
          <Form onFinish={login} className=' flex-center flex-col gap-6 p-4'>
            <h1 className=' text-center text-5xl font-medium text-primary'>Myflix</h1>
            <Input ref={ref} placeholder='Email' allowClear />
            <Button isLoading={isLoading} onClick={login} type='primary'>
              Access
            </Button>
          </Form>
        </div>
      </div>
    </section>
  );
}
