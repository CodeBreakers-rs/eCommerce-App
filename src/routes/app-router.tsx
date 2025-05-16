import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './protected-route'
import RedirectIfAuth from './redirect-if-auth'

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
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <LoginPage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuth>
              <RegistrationPage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <CatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/basket"
          element={
            <ProtectedRoute>
              <BasketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default AppRouter
