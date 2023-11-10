import { useEffect } from 'react';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button } from 'antd';
import { HeaderKey } from '@/constants/enum';
import { setUser } from '@/reducers/auth';
import { RootState } from '@/reducers/store';
import { Prettify } from '@/types';
import { User } from '@/types/user';

type Props = { width: number; collapsed: boolean; onToggle: () => void };

export default function Header({ width, collapsed, onToggle }: Props) {
  const { user } = useSelector((state: RootState) => state.auth) as { user: Prettify<User> };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultProfileImage = 'https://image.tmdb.org/t/p/w470_and_h470_face/Ar9aVa8LImtGfDLb0NO0glPDGTY.jpg';
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  });

  return (
    <header className=' sticky top-0 z-10 h-16 bg-dark-950 pt-2'>
      <div className=' flex h-full items-center justify-between px-8'>
        <div className=' cursor-pointer text-3xl' onClick={onToggle}>
          {width < 1024 ? (
            collapsed ? (
              <FaBars />
            ) : (
              <FaXmark />
            )
          ) : collapsed ? (
            <AiOutlineMenuUnfold />
          ) : (
            <AiOutlineMenuFold />
          )}
        </div>
        <div className=' group flex h-12 cursor-pointer items-center gap-4'>
          {user && (
            <>
              {user.name && <span>{user.name}</span>}
              <Avatar src={user.profileImage || defaultProfileImage} className=' h-10 w-10' alt={user.name} />
              <Button
                children={<FaSignOutAlt />}
                className='w-0 overflow-hidden border-none !bg-transparent px-0 text-xl transition-all duration-300 hover:!bg-transparent group-hover:w-8'
                onClick={() => {
                  localStorage.removeItem(HeaderKey.clientId);
                  dispatch(setUser(null));
                }}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
