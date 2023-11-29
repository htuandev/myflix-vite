import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { routePaths } from './constants';
import Authenticated from './layouts/Authenticated';
import Hamster from './layouts/Hamster';
import DashboardLayout from './layouts/Layout';
import Login from './pages/Login';
import routes from './constants/routes';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position='top-right' autoClose={3000} newestOnTop theme='colored' />
      <Routes>
        <Route path={routePaths.auth} element={<Login />} />
        <Route element={<Authenticated />}>
          <Route element={<DashboardLayout />}>
            {routes.map(({ path, element: Component, type }) => (
              <Route
                path={path}
                element={<Suspense fallback={<Hamster />}>{type ? <Component type={type} /> : <Component />}</Suspense>}
                key={path}
              />
            ))}
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
