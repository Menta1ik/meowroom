import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format, parseISO, isToday, isFuture } from 'date-fns';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
  services: {
    name: string;
  };
}

export const BookingsList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');

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
      alert('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const date = parseISO(booking.booking_date);
    if (filter === 'today') return isToday(date);
    if (filter === 'upcoming') return isFuture(date) || isToday(date);
    return true;
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

  if (loading) return <div className="p-8 text-center">Loading bookings...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-neutral-800">Bookings</h2>
        
        <div className="flex bg-neutral-100 p-1 rounded-lg">
          {(['all', 'upcoming', 'today'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === f 
                  ? 'bg-white text-primary-700 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 text-left text-sm font-semibold text-neutral-600">
            <tr>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Service</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-neutral-50 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-medium text-neutral-800">
                      <Calendar size={14} className="text-primary-500" />
                      {format(parseISO(booking.booking_date), 'MMM d, yyyy')}
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
                    {booking.guests_count} guest(s)
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-neutral-700">
                    {booking.services?.name || 'Unknown Service'}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {booking.total_price} ₴
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-sm ${getPaymentColor(booking.payment_status)} uppercase text-xs tracking-wider`}>
                    {booking.payment_status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Confirm"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Cancel"
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
                <td colSpan={6} className="p-8 text-center text-neutral-500">
                  No bookings found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
