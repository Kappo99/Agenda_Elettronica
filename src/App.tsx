import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useAppDispatch, useAppSelector } from './redux/hooks';

import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Storico from './pages/Storico';
import Giornata from './pages/Giornata';
import Anagrafica from './pages/Anagrafica';
import Profilo from './pages/Profilo';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';
import Archivio from './pages/Archivio';
import Notifications from './components/utils/Notifications';
import { removeNotification } from './redux/slices/notificationSlice';
import { PopupProvider } from './context/PopupContext';
import Popup from './components/popup/Popup';
import Famiglia from './pages/Famiglia';

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PopupProvider>
        {children}
      </PopupProvider>
    </Provider>
  );
}

function AppComponents() {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notification);

  return (
    <>
      <Notifications
        notifications={notifications}
        removeNotification={(id) => dispatch(removeNotification(id))}
      />

      <Popup />
    </>
  );
}

function AppRoutes() {
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);

  return (
    <Router>

      <Header />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/archivio" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Archivio />
          </ProtectedRoute>
        } />
        <Route path="/giornata/:id/:date" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Giornata />
          </ProtectedRoute>
        } />
        <Route path="/storico/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Storico />
          </ProtectedRoute>
        } />
        <Route path="/anagrafica/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Anagrafica />
          </ProtectedRoute>
        } />
        <Route path="/anagrafica" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Anagrafica isCreating />
          </ProtectedRoute>
        } />
        <Route path="/famiglia/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Famiglia />
          </ProtectedRoute>
        } />
        <Route path="/famiglia" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Famiglia isCreating />
          </ProtectedRoute>
        } />
        <Route path="/profilo" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profilo />
          </ProtectedRoute>
        } />
      </Routes>

      <Footer />

    </Router>
  );
}

function App() {
  return (
    <AppProviders>
      <AppComponents />
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
