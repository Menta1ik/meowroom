import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import LanguageSelector from '../ui/LanguageSelector';
import { LogOut, Cat, MessageSquare, Menu, X, PawPrint, ChevronLeft, ChevronRight, Settings, Calendar, Heart } from 'lucide-react';
import { useState } from 'react';

export const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/cats', icon: Cat, label: t('admin.nav.cats') },
    { to: '/admin/requests', icon: MessageSquare, label: t('admin.nav.requests') },
    { to: '/admin/services', icon: Settings, label: t('admin.nav.services') },
    { to: '/admin/schedule', icon: Calendar, label: t('admin.nav.schedule') },
    { to: '/admin/bookings', icon: PawPrint, label: t('admin.nav.bookings') },
    { to: '/admin/fundraising', icon: Heart, label: 'Fundraising' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar for Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-neutral-200 fixed h-full z-10 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`p-6 border-b border-neutral-100 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center shrink-0">
              <PawPrint size={18} />
            </div>
            {!isCollapsed && <span className="font-bold text-xl text-neutral-800 whitespace-nowrap">Admin Panel</span>}
          </div>
        </div>
        
        {/* Collapse Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-9 bg-white border border-neutral-200 rounded-full p-1 text-neutral-500 hover:text-primary-600 shadow-sm z-20 hidden md:block"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={20} className="shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          {!isCollapsed ? (
            <>
              <div className="mb-4">
                <LanguageSelector variant="toggle" />
              </div>
              <div className="mb-4 px-2">
                <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider">{t('admin.user')}</p>
                <p className="text-sm text-neutral-600 truncate">{user?.email}</p>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="w-full flex items-center justify-center gap-2">
                <LogOut size={18} />
                {t('admin.nav.logout')}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={handleSignOut}
                className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title={t('admin.nav.logout')}
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-20 px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-lg text-neutral-800">Admin Panel</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-neutral-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-10 pt-16 flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-neutral-100">
            <Button variant="outline" onClick={handleSignOut} className="w-full flex items-center justify-center gap-2">
              <LogOut size={18} />
              {t('admin.nav.logout')}
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main 
        className={`flex-1 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-[100vw] overflow-x-hidden transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
