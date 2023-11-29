import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { useWindowSize } from '@/hooks';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const { width } = useWindowSize();

  const [collapsed, setCollapsed] = useState(true);

  const handleBreakpoint = (broken: boolean) => {
    if (broken) {
      setCollapsed(true);
      return;
    }
  };

  const onClose = () => {
    if (width < 1024) {
      setCollapsed(true);
    }
  };

  const onToggle = () => setCollapsed((prev) => !prev);
  return (
    <Layout>
      <Sidebar
        onClose={onClose}
        collapsed={collapsed}
        trigger={null}
        breakpoint='lg'
        collapsible
        width={300}
        onBreakpoint={handleBreakpoint}
        collapsedWidth={width < 1024 ? 0 : 80}
        className={`!fixed top-16 z-[3333] min-h-screen bg-opacity-90 shadow-lg shadow-dark-925 lg:!relative lg:top-0 lg:bg-opacity-100 ${
          collapsed ? 'p-0' : 'px-2'
        }`}
      />
      <Layout>
        <Header width={width} collapsed={collapsed} onToggle={onToggle} />
        <main className=' flex-1'>
          <Outlet />
        </main>
      </Layout>
    </Layout>
  );
}
