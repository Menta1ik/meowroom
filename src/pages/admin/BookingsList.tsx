import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format, parseISO, isToday, isFuture } from 'date-fns';
import { getDateLocale } from '../../lib/utils';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle, CreditCard, RefreshCw, ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Booking {
  id: string;
  created_at: string;
  booking_date: string;
  booking_time: string;
  guests_count: number;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  comment: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'failed';
  payment_id?: string;
  services: {
    name: string;
  };
}

export const BookingsList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  const [sortBy, setSortBy] = useState<'created_desc' | 'created_asc' | 'visit_desc' | 'visit_asc'>('created_desc');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (
            name
          )
        `)
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(t('admin.schedule.save_error', 'Failed to update status'));
    }
  };

  const handlePayment = async (booking: Booking) => {
    if (!confirm(t('admin.bookings.confirm_invoice'))) return;

    try {
      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: booking.total_price,
          bookingId: booking.id,
          description: `Visit Meowroom: ${booking.services?.name} (${booking.booking_date})`
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API not available (local env)");
      }

      const data = await response.json();

      if (data.invoiceId) {
         // Save invoiceId to Supabase
         await supabase
          .from('bookings')
          .update({ payment_id: data.invoiceId })
          .eq('id', booking.id);
      }

      if (data.pageUrl) {
        window.open(data.pageUrl, '_blank');
        fetchBookings(); // Refresh to see payment_id if we showed it
      } else {
        alert('Error creating invoice: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message.includes("API not available") ? "API functions work only in production (Vercel)" : 'Failed to create invoice');
    }
  };

  const checkPaymentStatus = async (booking: Booking) => {
    if (!booking.payment_id) {
      alert('No invoice ID found for this booking.');
      return;
    }

    try {
      const response = await fetch('/api/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: booking.payment_id }),
      });
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API not available (local env)");
      }

      const data = await response.json();
      
      if (data.status === 'paid') {
        alert('Payment confirmed! Status updated.');
        fetchBookings();
      } else {
        alert(`Payment status: ${data.status}`);
      }
    } catch (error: any) {
      console.error('Check status error:', error);
      alert(error.message.includes("API not available") ? "API functions work only in production (Vercel)" : 'Failed to check status');
    }
  };

  const filteredBookings = bookings
    .filter(booking => {
      const date = parseISO(booking.booking_date);
      if (filter === 'today') return isToday(date);
      if (filter === 'upcoming') return isFuture(date) || isToday(date);
      return true;
    })
    .sort((a, b) => {
      // Safety check for missing created_at
      const createdA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const createdB = b.created_at ? new Date(b.created_at).getTime() : 0;
      
      const visitA = new Date(a.booking_date + 'T' + a.booking_time).getTime();
      const visitB = new Date(b.booking_date + 'T' + b.booking_time).getTime();

      switch (sortBy) {
        case 'created_desc':
          return createdB - createdA;
        case 'created_asc':
          return createdA - createdB;
        case 'visit_desc':
          return visitB - visitA;
        case 'visit_asc':
          return visitA - visitB;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-neutral-100 text-neutral-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 font-bold';
      case 'refunded': return 'text-neutral-500 line-through';
      case 'failed': return 'text-red-600 font-bold';
      default: return 'text-yellow-600 font-medium';
    }
  };

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <h2 className="text-xl font-bold text-neutral-800">{t('admin.bookings.title')}</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          {/* Sort Control */}
          <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
            <ArrowUpDown size={16} className="text-neutral-500" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-sm text-neutral-700 outline-none cursor-pointer min-w-[180px]"
            >
              <option value="created_desc">{t('admin.bookings.sort.created_desc')}</option>
              <option value="created_asc">{t('admin.bookings.sort.created_asc')}</option>
              <option value="visit_desc">{t('admin.bookings.sort.visit_desc')}</option>
              <option value="visit_asc">{t('admin.bookings.sort.visit_asc')}</option>
            </select>
          </div>

          <div className="flex bg-neutral-100 p-1 rounded-lg">
            {(['all', 'upcoming', 'today'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filter === f 
                    ? 'bg-white text-primary-700 shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {t(`admin.bookings.filter.${f}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-left text-sm font-semibold text-neutral-600">
            <tr>
              <th className="p-4">{t('admin.bookings.table.created_at')}</th>
              <th className="p-4">{t('admin.bookings.table.date')}</th>
              <th className="p-4">{t('admin.bookings.table.customer')}</th>
              <th className="p-4">{t('admin.bookings.table.service')}</th>
              <th className="p-4">{t('admin.bookings.table.payment')}</th>
              <th className="p-4">{t('admin.bookings.table.status')}</th>
              <th className="p-4 text-right">{t('admin.bookings.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-yellow-50 transition-colors">
                <td className="p-4">
                  <div className="text-sm text-neutral-600">
                    {booking.created_at ? format(parseISO(booking.created_at), 'dd.MM.yyyy', { locale: getDateLocale(i18n.language) }) : '-'}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {booking.created_at ? format(parseISO(booking.created_at), 'HH:mm') : ''}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-medium text-neutral-800">
                      <Calendar size={14} className="text-primary-500" />
                      {format(parseISO(booking.booking_date), 'd MMMM yyyy', { locale: getDateLocale(i18n.language) })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                      <Clock size={14} />
                      {booking.booking_time.slice(0, 5)}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-neutral-800">{booking.customer_name}</div>
                  <div className="flex items-center gap-1 text-sm text-neutral-500 mt-0.5">
                    <Phone size={12} />
                    <a href={`tel:${booking.customer_phone}`} className="hover:text-primary-600">
                      {booking.customer_phone}
                    </a>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {booking.guests_count} {t('admin.bookings.guests')}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-neutral-700">
                    {booking.services?.name || t('admin.bookings.unknown_service')}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {booking.total_price} ₴
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-sm ${getPaymentColor(booking.payment_status)} uppercase text-xs tracking-wider`}>
                    {t(`admin.bookings.payment_status.${booking.payment_status}`)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                    {t(`admin.bookings.status.${booking.status}`)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Check Status Button */}
                    {booking.payment_status === 'unpaid' && booking.payment_id && (
                      <button
                        onClick={() => checkPaymentStatus(booking)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title={t('admin.bookings.actions.check_status')}
                      >
                        <RefreshCw size={18} />
                      </button>
                    )}

                    {/* Create Invoice Button */}
                    {booking.payment_status === 'unpaid' && booking.status !== 'cancelled' && !booking.payment_id && (
                      <button
                        onClick={() => handlePayment(booking)}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title={t('admin.bookings.actions.pay')}
                      >
                        <CreditCard size={18} />
                      </button>
                    )}

                    {booking.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title={t('admin.bookings.actions.confirm')}
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={t('admin.bookings.actions.cancel')}
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-500">
                  {t('admin.bookings.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};