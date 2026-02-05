import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HelmetProvider } from 'react-helmet-async';
import { BookingProvider } from './context/BookingContext';
import { Analytics } from "@vercel/analytics/react";
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for performance
const Home = React.lazy(() => import('./pages/Home'));
const Cats = React.lazy(() => import('./pages/Cats'));
const Donate = React.lazy(() => import('./pages/Donate'));
const Contacts = React.lazy(() => import('./pages/Contacts'));
const BecomeSponsor = React.lazy(() => import('./pages/BecomeSponsor'));
const Visit = React.lazy(() => import('./pages/Visit'));
const About = React.lazy(() => import('./pages/About'));
const CatDetails = React.lazy(() => import('./pages/CatDetails'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = React.lazy(() => import('./pages/TermsOfUse'));
const LoginPage = React.lazy(() => import('./pages/admin/Login').then(module => ({ default: module.LoginPage })));
const CreateCat = React.lazy(() => import('./pages/admin/CreateCat').then(module => ({ default: module.CreateCat })));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.Dashboard })));
const EditCat = React.lazy(() => import('./pages/admin/EditCat').then(module => ({ default: module.EditCat })));
const CatsList = React.lazy(() => import('./pages/admin/CatsList').then(module => ({ default: module.CatsList })));
const AdoptionRequests = React.lazy(() => import('./pages/admin/AdoptionRequests').then(module => ({ default: module.AdoptionRequests })));
const ServicesList = React.lazy(() => import('./pages/admin/ServicesList').then(module => ({ default: module.ServicesList })));
const ScheduleSettings = React.lazy(() => import('./pages/admin/ScheduleSettings').then(module => ({ default: module.ScheduleSettings })));
const BookingsList = React.lazy(() => import('./pages/admin/BookingsList').then(module => ({ default: module.BookingsList })));
const FundraisingList = React.lazy(() => import('./pages/admin/FundraisingList'));
const AdminExpenses = React.lazy(() => import('./pages/admin/AdminExpenses'));
const FundraisingDetails = React.lazy(() => import('./pages/FundraisingDetails'));
const Reports = React.lazy(() => import('./pages/Reports'));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <BookingProvider>
            <ScrollToTop />
            <Suspense fallback={<LoadingSpinner />}>
              <Analytics />
              <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="cats" element={<CatsList />} />
                  <Route path="cats/new" element={<CreateCat />} />
                  <Route path="cats/:id" element={<EditCat />} />
                  <Route path="requests" element={<AdoptionRequests />} />
                  <Route path="services" element={<ServicesList />} />
                  <Route path="schedule" element={<ScheduleSettings />} />
                  <Route path="bookings" element={<BookingsList />} />
                  <Route path="fundraising" element={<FundraisingList />} />
                  <Route path="expenses" element={<AdminExpenses />} />
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
                        <Route path="/cats/:id" element={<CatDetails />} />
                        <Route path="/visit" element={<Visit />} />
                        <Route path="/donate" element={<Donate />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/fundraising/:id" element={<FundraisingDetails />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/become-sponsor" element={<BecomeSponsor />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-use" element={<TermsOfUse />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />
              </Routes>
            </Suspense>
          </BookingProvider>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
