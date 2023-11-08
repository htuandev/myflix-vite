import { NavLink } from 'react-router-dom';
import { Layout, SiderProps, Tooltip } from 'antd';
import { twMerge } from 'tailwind-merge';
import links from './Links';

const { Sider } = Layout;

interface Props extends SiderProps {
  width: number;
  onClose: () => void;
}

export default function Sidebar(props: Props) {
  const { collapsed, width, collapsedWidth, onClose } = props;

  return (
    <Sider {...props}>
      <div className=' w-full text-lg font-medium lg:fixed lg:flex lg:min-h-screen lg:w-auto lg:flex-col lg:justify-between'>
        <ul style={{ width: collapsed ? collapsedWidth : width - 16 }} className='p-2 '>
          {links.map(({ href, icon: Icon, label }, index) => (
            <Tooltip key={href} title={collapsed && label} zIndex={3333} placement='right'>
              <NavLink
                to={href}
                end={href !== '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  twMerge(
                    'my-2 flex h-10 min-h-[52px] w-full cursor-pointer items-center gap-2 rounded-md text-dark-100 transition-colors duration-300 hover:bg-primary/25 hover:text-white',
                    index === 0 ? 'm-0' : '',
                    collapsed && 'justify-center',
                    isActive && 'bg-primary hover:bg-primary'
                  )
                }
              >
                {index === 0 && collapsed ? (
                  <img src='/myflix.svg' alt='logo' className='h-8 w-8' />
                ) : (
                  <Icon className={twMerge('ml-3 text-2xl', collapsed && 'm-0 h-8 w-8')} />
                )}
                <span className={collapsed ? 'hidden' : 'block'}>{label}</span>
              </NavLink>
            </Tooltip>
          ))}
        </ul>
      </div>
    </Sider>
  );
}
