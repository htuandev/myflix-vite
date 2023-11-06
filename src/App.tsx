import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Authenticated from './layouts/Authenticated';
import Hamster from './layouts/Hamster';
import DashboardLayout from './layouts/dashboard/Layout';
import Login from './pages/Login';
import Preview from './pages/Preview';
import adminRoute from './routes/adminRoute';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position='top-right' autoClose={3000} newestOnTop theme='colored' />
      <Routes>
        <Route path='/' element={<Preview />} />
        <Route element={<Authenticated />}>
          <Route path='/auth/login' element={<Login />} />
          <Route element={<DashboardLayout />}>
            {adminRoute.map(({ path, element: Component, type }) => (
              <Route
                path={`/admin${path}`}
                element={<Suspense fallback={<Hamster />}>{type ? <Component type={type} /> : <Component />}</Suspense>}
                key={path}
              />
            ))}
            <Route path='/admin/*' element={<Navigate to='/admin' />} />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
