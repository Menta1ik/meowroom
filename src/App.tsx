import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import Home from './pages/Home';
import Cats from './pages/Cats';
import Visit from './pages/Visit';
import Donate from './pages/Donate';
import Contacts from './pages/Contacts';
import BecomeSponsor from './pages/BecomeSponsor';
import About from './pages/About';
import { Navigate } from 'react-router-dom';
import { LoginPage } from './pages/admin/Login';
import { CreateCat } from './pages/admin/CreateCat';
import { EditCat } from './pages/admin/EditCat';
import { CatsList } from './pages/admin/CatsList';
import { AdoptionRequests } from './pages/admin/AdoptionRequests';
import { AdminLayout } from './components/admin/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="cats" replace />} />
              <Route path="cats" element={<CatsList />} />
              <Route path="cats/new" element={<CreateCat />} />
              <Route path="cats/:id" element={<EditCat />} />
              <Route path="requests" element={<AdoptionRequests />} />
            </Route>
          </Route>

          {/* Public Routes */}
          <Route
            path="*"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/cats" element={<Cats />} />
                    <Route path="/visit" element={<Visit />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/become-sponsor" element={<BecomeSponsor />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
