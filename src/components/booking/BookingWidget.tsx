import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { format, addDays, isSameDay, parse, isAfter } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ChevronLeft, ChevronRight, Check, User, Calendar, Clock, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Interfaces
interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  description: string;
}

interface WorkingHours {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

export const BookingWidget: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Steps: 0: Service, 1: Date/Time, 2: Details, 3: Success
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Data
  const [services, setServices] = useState<Service[]>([]);
  const [schedule, setSchedule] = useState<WorkingHours[]>([]);
  
  // Selection
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    comment: ''
  });

  // Available slots for selected date
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Services
        const { data: servicesData } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('price');
        setServices(servicesData || []);

        // Fetch Schedule
        const { data: scheduleData } = await supabase
          .from('working_hours')
          .select('*');
        setSchedule(scheduleData || []);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate || !selectedService) return;

    const fetchSlots = async () => {
      const dayOfWeek = selectedDate.getDay();
      const daySchedule = schedule.find(s => s.day_of_week === dayOfWeek);

      if (!daySchedule || !daySchedule.is_open) {
        setAvailableSlots([]);
        return;
      }

      // Generate slots based on open/close time and service duration
      const slots: string[] = [];
      const open = parse(daySchedule.open_time, 'HH:mm:ss', new Date());
      const close = parse(daySchedule.close_time, 'HH:mm:ss', new Date());
      
      let current = open;
      const durationMs = selectedService.duration_minutes * 60 * 1000;
      
      while (isAfter(close, new Date(current.getTime() + durationMs)) || current.getTime() + durationMs === close.getTime()) {
        const timeString = format(current, 'HH:mm');
        slots.push(timeString);
        current = new Date(current.getTime() + 60 * 60 * 1000); 
      }
      
      setAvailableSlots(slots);
    };

    fetchSlots();
  }, [selectedDate, selectedService, schedule]);

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    setLoading(true);
    try {
      const totalPrice = selectedService.price * guests;
      
      // 1. Create Booking in Supabase
      const { data: bookingData, error: bookingError } = await supabase.from('bookings').insert([{
        service_id: selectedService.id,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedTime,
        guests_count: guests,
        total_price: totalPrice,
        customer_name: customerDetails.name,
        customer_phone: customerDetails.phone,
        customer_email: customerDetails.email,
        comment: customerDetails.comment,
        status: 'pending',
        payment_status: 'unpaid' 
      }]).select().single();

      if (bookingError) throw bookingError;
      
      // 2. Create Payment Invoice (Monobank)
      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          bookingId: bookingData.id,
          description: `Visit Meowroom: ${selectedService.name} (${format(selectedDate, 'dd.MM')})`
        }),
      });

      const paymentData = await response.json();

      if (paymentData.pageUrl) {
        // Redirect to Monobank Payment Page
        window.location.href = paymentData.pageUrl;
      } else {
        console.error('Payment creation failed:', paymentData);
        alert('Failed to initialize payment. Please try again.');
        setStep(3); // Fallback to success page without payment redirect (manual handling)
      }

    } catch (error: any) {
      console.error('Booking failed:', error);
      alert(`Failed to create booking: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Render Steps
  const renderStep = () => {
    switch (step) {
      case 0: // Service Selection
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-neutral-800 mb-4">{t('booking.step_service')}</h3>
            <div className="grid gap-4">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => { setSelectedService(service); setStep(1); }}
                  className="flex justify-between items-center p-4 rounded-xl border-2 border-neutral-100 hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
                >
                  <div>
                    <h4 className="font-bold text-neutral-800 group-hover:text-primary-700">{service.name}</h4>
                    <p className="text-sm text-neutral-500">{service.duration_minutes} {t('booking.duration')}</p>
                  </div>
                  <div className="text-primary-600 font-bold">
                    {service.price} ₴ {t('booking.per_person')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 1: // Date & Time
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(0)} className="!p-0">
                <ChevronLeft size={20} />
              </Button>
              <h3 className="text-xl font-bold text-neutral-800">{t('booking.step_date')}</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={{ before: new Date() }}
                  locale={i18n.language === 'uk' ? uk : enUS}
                  styles={{
                    head_cell: { width: '40px' },
                    cell: { width: '40px' },
                    day: { width: '40px', height: '40px' }
                  }}
                  modifiersClassNames={{
                    selected: 'bg-primary-500 text-white rounded-full hover:bg-primary-600'
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-neutral-700 mb-3">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy', { locale: i18n.language === 'uk' ? uk : enUS }) : t('booking.select_date')}
                </h4>
                
                {!selectedDate ? (
                  <p className="text-neutral-400 text-sm">{t('booking.select_date')}</p>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedTime === time
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-400 text-sm">{t('booking.no_slots')}</p>
                )}

                <div className="mt-8 flex justify-end">
                  <Button 
                    disabled={!selectedDate || !selectedTime} 
                    onClick={() => setStep(2)}
                  >
                    {t('booking.next')}
                    <ChevronRight size={18} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Details
        const totalPrice = (selectedService?.price || 0) * guests;
        
        return (
          <div className="space-y-6">
             <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="!p-0">
                <ChevronLeft size={20} />
              </Button>
              <h3 className="text-xl font-bold text-neutral-800">{t('booking.step_details')}</h3>
            </div>

            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-primary-800 font-medium">{selectedService?.name}</span>
                <span className="font-bold text-primary-700">{selectedService?.price} ₴ {t('booking.per_person')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-600">
                <Calendar size={14} />
                <span>{selectedDate && format(selectedDate, 'MMMM d, yyyy', { locale: i18n.language === 'uk' ? uk : enUS })}</span>
                <span className="mx-1">•</span>
                <Clock size={14} />
                <span>{selectedTime}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">{t('booking.guests_label')}</label>
                <div className="flex gap-4">
                  {[1, 2, 3].map(num => (
                    <button
                      key={num}
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${
                        guests === num
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 text-neutral-500 hover:border-primary-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{t('booking.name_label')}</label>
                  <input
                    type="text"
                    required
                    value={customerDetails.name}
                    onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-200 outline-none"
                    placeholder={t('booking.name_label')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{t('booking.phone_label')}</label>
                  <input
                    type="tel"
                    required
                    value={customerDetails.phone}
                    onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-200 outline-none"
                    placeholder="+380..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">{t('booking.email_label')}</label>
                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="example@mail.com"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                <div>
                  <p className="text-sm text-neutral-500">{t('booking.total')}</p>
                  <p className="text-3xl font-bold text-primary-600">{totalPrice} ₴</p>
                </div>
                <Button 
                  size="lg"
                  onClick={handleBooking}
                  disabled={!customerDetails.name || !customerDetails.phone || loading}
                >
                  {loading ? t('booking.processing') : t('booking.pay_btn')}
                </Button>
              </div>
              <p className="text-xs text-center text-neutral-400">
                {t('booking.terms')}
              </p>
            </div>
          </div>
        );

      case 3: // Success
        return (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">{t('booking.success_title')}</h3>
            <p className="text-neutral-600 max-w-md mx-auto">
              {t('booking.success_msg', { name: customerDetails.name })}
            </p>
            <div className="pt-6">
              <Button onClick={() => { setStep(0); setCustomerDetails({name:'', phone:'', email:'', comment:''}); }}>
                {t('booking.book_more')}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden max-w-2xl mx-auto">
      <div className="bg-primary-600 p-6 text-white text-center">
        <h2 className="text-2xl font-bold">{t('booking.title')}</h2>
        <p className="text-primary-100 opacity-90">{t('booking.subtitle')}</p>
      </div>
      <div className="p-6 md:p-8">
        {renderStep()}
      </div>
    </div>
  );
};
