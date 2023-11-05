import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './layouts/dashboard/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position='top-right' autoClose={3000} newestOnTop theme='colored' />
      <Routes>
        <Route path='/auth/login' element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path='/' element={<Dashboard />} />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
