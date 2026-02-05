
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Cat, MessageSquare, Calendar, Heart, ArrowUpRight, ArrowRight, PawPrint, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getDateLocale } from '../../lib/utils';

interface DashboardStats {
  totalCats: number;
  sponsoredCats: number;
  pendingRequests: number;
  upcomingBookingsCount: number;
  activeFundraisers: number;
  recentRequests: any[];
  upcomingBookingsList: any[];
}

export const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalCats: 0,
    sponsoredCats: 0,
    pendingRequests: 0,
    upcomingBookingsCount: 0,
    activeFundraisers: 0,
    recentRequests: [],
    upcomingBookingsList: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const results = await Promise.allSettled([
        // 0: Total Cats
        supabase.from('cats').select('*', { count: 'exact', head: true }),
        // 1: Sponsored Cats
        supabase.from('cats').select('*', { count: 'exact', head: true }).not('guardian_name', 'is', null),
        // 2: Pending Requests Count
        supabase.from('adoption_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        // 3: Upcoming Bookings Count
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('booking_date', today),
        // 4: Active Fundraisers
        supabase.from('fundraisings').select('*', { count: 'exact', head: true }).eq('is_active', true),
        // 5: Recent Requests List
        supabase.from('adoption_requests')
          .select('id, name, created_at, status, cat:cats(name)')
          .order('created_at', { ascending: false })
          .limit(5),
        // 6: Upcoming Bookings List
        supabase.from('bookings')
          .select('id, customer_name, booking_date, booking_time, status, guests_count')
          .gte('booking_date', today)
          .order('booking_date', { ascending: true })
          .limit(5)
      ]);

      const getCount = (result: PromiseSettledResult<any>) => 
        result.status === 'fulfilled' && result.value.count ? result.value.count : 0;
      
      const getData = (result: PromiseSettledResult<any>) => 
        result.status === 'fulfilled' && result.value.data ? result.value.data : [];

      setStats({
        totalCats: getCount(results[0]),
        sponsoredCats: getCount(results[1]),
        pendingRequests: getCount(results[2]),
        upcomingBookingsCount: getCount(results[3]),
        activeFundraisers: getCount(results[4]),
        recentRequests: getData(results[5]),
        upcomingBookingsList: getData(results[6])
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
      value: stats.upcomingBookingsCount,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'closed': return 'bg-green-100 text-green-700';
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-neutral-800">{t('admin.dashboard.recent_requests', 'Recent Requests')}</h2>
            <Link to="/admin/requests" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              {t('common.view_all', 'View All')}
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {stats.recentRequests.length > 0 ? (
              stats.recentRequests.map((request) => (
                <div key={request.id} className="p-4 hover:bg-neutral-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">{request.name}</p>
                      <p className="text-sm text-neutral-500">
                        {t('common.interested_in', 'Interested in')}: <span className="font-medium">{request.cat?.name || 'Unknown'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {t(`admin.requests.status.${request.status}`, request.status)}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {format(new Date(request.created_at), 'd MMM', { locale: getDateLocale(i18n.language) })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-400">
                {t('admin.dashboard.no_requests', 'No recent requests')}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-neutral-800">{t('admin.dashboard.upcoming_bookings', 'Upcoming Bookings')}</h2>
            <Link to="/admin/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              {t('common.view_all', 'View All')}
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {stats.upcomingBookingsList.length > 0 ? (
              stats.upcomingBookingsList.map((booking) => (
                <div key={booking.id} className="p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-800">
                        {format(new Date(booking.booking_date), 'd MMM yyyy', { locale: getDateLocale(i18n.language) })}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                    <Clock size={14} className="text-neutral-400" />
                    <span>{booking.booking_time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-medium text-neutral-800 truncate max-w-[120px]">{booking.customer_name}</p>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <User size={12} /> {booking.guests_count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-400">
                {t('admin.dashboard.no_bookings', 'No upcoming bookings')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-800 mb-6">{t('admin.dashboard.quick_actions', 'Quick Actions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/cats/new" className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-orange-50 hover:border-orange-100 hover:text-orange-600 transition-all gap-3 group">
            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-orange-500">
              <Cat size={20} />
            </div>
            <span className="font-medium text-center">{t('admin.cats.add', 'Add Cat')}</span>
          </Link>
          <Link to="/admin/bookings" className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-purple-50 hover:border-purple-100 hover:text-purple-600 transition-all gap-3 group">
            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-purple-500">
              <Calendar size={20} />
            </div>
            <span className="font-medium text-center">{t('admin.nav.bookings', 'Bookings')}</span>
          </Link>
          <Link to="/admin/expenses" className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-green-50 hover:border-green-100 hover:text-green-600 transition-all gap-3 group">
            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-green-500">
              <PawPrint size={20} />
            </div>
            <span className="font-medium text-center">{t('admin.nav.expenses', 'Expenses')}</span>
          </Link>
          <Link to="/admin/fundraising" className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all gap-3 group">
            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-red-500">
              <Heart size={20} />
            </div>
            <span className="font-medium text-center">{t('admin.nav.fundraising', 'Fundraising')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
