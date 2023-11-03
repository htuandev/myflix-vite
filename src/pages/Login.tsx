import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Input, InputRef } from 'antd';
import { useLoginMutation } from '@/api/authApi';
import { HeaderKey } from '@/constants/enum';
import homeCinema from '@/images/home_cinema.svg';
import { setUser } from '@/reducers/auth';
import { ErrorResponse } from '@/types';

export default function Login() {
  const dispatch = useDispatch();
  const ref = useRef<InputRef>(null);

  const [onLogin, { isLoading }] = useLoginMutation();

  const login = async () => {
    try {
      const email = ref.current?.input?.value.trim() as string;

      if (!email) {
        return toast.error('Email is required');
      }

      const user = await onLogin({ email }).unwrap();
      dispatch(setUser(user));
      localStorage.setItem(HeaderKey.clientId, user._id);

      toast.success('Success');
    } catch (error) {
      const { data, status } = error as ErrorResponse;
      if (!data) return;

      const { message } = data;
      if (status === 304) {
        toast.info(message);
        return;
      }

      return toast.error(message);
    }
  };

  return (
    <section className=' container flex-center min-h-screen'>
      <div className=' flex w-full max-w-[800px]'>
        <img src={homeCinema} className='hidden w-1/2 md:block' />
        <div className=' grow md:pt-12'>
          <div className=' flex-center flex-col gap-6 p-4'>
            <h1 className=' text-primary text-center text-5xl font-medium'>Myflix</h1>
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
