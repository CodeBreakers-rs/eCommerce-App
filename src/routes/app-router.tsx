import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from '../components/layout/main-layout'

import MainPage from '../pages/main-page'
import LoginPage from '../pages/login-page'
import RegistrationPage from '../pages/registration-page'
import CatalogPage from '../pages/catalog-page'
import ProductPage from '../pages/product-page'
import ProfilePage from '../pages/profile-page'
import BasketPage from '../pages/basket-page'
import AboutPage from '../pages/about-us-page'
import NotFoundPage from '../pages/not-found-page'

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/id" element={<ProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default AppRouter
