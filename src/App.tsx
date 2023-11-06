import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Authenticated from './layouts/Authenticated';
import DashboardLayout from './layouts/dashboard/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Preview from './pages/Preview';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position='top-right' autoClose={3000} newestOnTop theme='colored' />
      <Routes>
        <Route path='/' element={<Preview />} />
        <Route element={<Authenticated />}>
          <Route path='/auth/login' element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path='/admin' element={<Dashboard />} />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
        <Route path='/admin/*' element={<Navigate to='/admin' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
