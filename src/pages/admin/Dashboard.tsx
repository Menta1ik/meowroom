import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Cat, MessageSquare, Calendar, Heart, ArrowUpRight, ArrowRight, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalCats: number;
  sponsoredCats: number;
  pendingRequests: number;
  upcomingBookings: number;
  activeFundraisers: number;
}

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalCats: 0,
    sponsoredCats: 0,
    pendingRequests: 0,
    upcomingBookings: 0,
    activeFundraisers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch Cats
      const { count: totalCats } = await supabase
        .from('cats')
        .select('*', { count: 'exact', head: true });
        
      // Fetch Sponsored Cats (where guardian_name is not null/empty)
      const { count: sponsoredCats } = await supabase
        .from('cats')
        .select('*', { count: 'exact', head: true })
        .not('guardian_name', 'is', null);

      // Fetch Pending Requests
      const { count: pendingRequests } = await supabase
        .from('adoption_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      // Fetch Upcoming Bookings (future dates)
      const today = new Date().toISOString().split('T')[0];
      const { count: upcomingBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('booking_date', today);

      // Fetch Active Fundraisers
      const { count: activeFundraisers } = await supabase
        .from('fundraisings')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        totalCats: totalCats || 0,
        sponsoredCats: sponsoredCats || 0,
        pendingRequests: pendingRequests || 0,
        upcomingBookings: upcomingBookings || 0,
        activeFundraisers: activeFundraisers || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: t('admin.dashboard.cats_stat', 'Total Cats'),
      value: stats.totalCats,
      subValue: `${stats.sponsoredCats} ${t('admin.dashboard.sponsored', 'sponsored')}`,
      icon: Cat,
      color: 'bg-orange-100 text-orange-600',
      link: '/admin/cats'
    },
    {
      title: t('admin.dashboard.requests_stat', 'Pending Requests'),
      value: stats.pendingRequests,
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-600',
      link: '/admin/requests'
    },
    {
      title: t('admin.dashboard.bookings_stat', 'Upcoming Bookings'),
      value: stats.upcomingBookings,
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
      link: '/admin/bookings'
    },
    {
      title: t('admin.dashboard.fundraising_stat', 'Active Fundraisers'),
      value: stats.activeFundraisers,
      icon: Heart,
      color: 'bg-red-100 text-red-600',
      link: '/admin/fundraising'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">{t('admin.dashboard.title', 'Dashboard')}</h1>
        <p className="text-neutral-500">{t('admin.dashboard.welcome', 'Welcome back to Meowroom Admin Panel')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link 
            key={index} 
            to={card.link}
            className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <card.icon size={24} />
              </div>
              <div className="p-2 bg-neutral-50 rounded-full text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-1">{card.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-neutral-800">{card.value}</h3>
                {card.subValue && (
                  <span className="text-xs font-medium text-neutral-400 bg-neutral-50 px-2 py-1 rounded-full">
                    {card.subValue}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-800 mb-6">{t('admin.dashboard.quick_actions', 'Quick Actions')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/cats/new" className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-orange-50 hover:border-orange-100 hover:text-orange-600 transition-all gap-3 group">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-orange-500">
                <Cat size={20} />
              </div>
              <span className="font-medium">{t('admin.cats.add', 'Add Cat')}</span>
            </Link>
            <Link to="/admin/bookings" className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-purple-50 hover:border-purple-100 hover:text-purple-600 transition-all gap-3 group">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-purple-500">
                <Calendar size={20} />
              </div>
              <span className="font-medium">{t('admin.nav.bookings', 'Bookings')}</span>
            </Link>
            <Link to="/admin/expenses" className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-green-50 hover:border-green-100 hover:text-green-600 transition-all gap-3 group">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-green-500">
                <PawPrint size={20} />
              </div>
              <span className="font-medium">{t('admin.nav.expenses', 'Expenses')}</span>
            </Link>
             <Link to="/admin/fundraising" className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all gap-3 group">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-red-500">
                <Heart size={20} />
              </div>
              <span className="font-medium">{t('admin.nav.fundraising', 'Fundraising')}</span>
            </Link>
          </div>
        </div>

        {/* Helpful Links or Info */}
        <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-primary-900 mb-2">{t('admin.dashboard.help_title', 'Need help?')}</h2>
            <p className="text-primary-700 mb-6 max-w-sm leading-relaxed">
              {t('admin.dashboard.help_text', 'Check out the reports section to see how your shelter is performing financially.')}
            </p>
            <Link to="/admin/expenses" className="inline-flex items-center gap-2 bg-white text-primary-600 px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all">
              {t('admin.nav.reports', 'Go to Reports')}
              <ArrowRight size={16} />
            </Link>
          </div>
          
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
