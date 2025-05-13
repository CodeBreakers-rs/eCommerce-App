import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/main-page';
import LoginPage from '../pages/login-page';
import RegistrationPage from '../pages/registration-page';
import NotFoundPage from '../pages/not-found-page';
import TestReg from "../components/tests/regForm-test";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/test" element={<TestReg />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
