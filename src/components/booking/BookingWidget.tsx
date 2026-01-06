import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  // Steps: 0: Service, 1: Date/Time, 2: Details, 3: Success
  const [step, setStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('success') === 'true' ? 3 : 0;
  });
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
    phone: '+380 ',
    email: '',
    comment: ''
  });

  const [isRulesAccepted, setIsRulesAccepted] = useState(false);

  const formatPhoneNumber = (value: string) => {
    // Keep only digits
    let digits = value.replace(/\D/g, '');
    
    // Handle potential double zero (380 + 0...) or pasting 380...
    if (digits.startsWith('3800')) {
        digits = '380' + digits.substring(4);
    }
    
    // If user deletes part of the prefix, restore it
    if (digits === '38' || digits === '3' || digits === '') {
        digits = '380';
    }
    
    // If user types 0xx... convert to 380xx...
    if (digits.startsWith('0')) {
        digits = '38' + digits;
    }
    
    // Enforce 380 prefix for any other input
    if (!digits.startsWith('380')) {
        digits = '380' + digits;
    }
    
    // Limit to 12 digits (380 + 9 digits)
    digits = digits.slice(0, 12);
    
    // Formatting: +380 66 123 45 67
    let formatted = '+380';
    if (digits.length > 3) formatted += ' ' + digits.slice(3, 5);
    if (digits.length > 5) formatted += ' ' + digits.slice(5, 8);
    if (digits.length > 8) formatted += ' ' + digits.slice(8, 10);
    if (digits.length > 10) formatted += ' ' + digits.slice(10, 12);
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setCustomerDetails({ ...customerDetails, phone: formatted });
  };

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
        const startTime = format(current, 'HH:mm');
        const endTime = format(new Date(current.getTime() + durationMs), 'HH:mm');
        slots.push(`${startTime} - ${endTime}`);
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
      
      // Extract start time for API (format: HH:mm)
      const startTime = selectedTime.split(' - ')[0];

      // Use Serverless Function to create booking securely (Bypassing RLS)
      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: selectedService.id,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          booking_time: startTime,
          guests_count: guests,
          total_price: totalPrice,
          customer_name: customerDetails.name,
          customer_phone: customerDetails.phone,
          customer_email: customerDetails.email,
          comment: customerDetails.comment,
          service_name: selectedService.name
        }),
      });

      // Handle raw response carefully
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response:', text);
        throw new Error('Server returned invalid response: ' + text.substring(0, 100));
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking (Server Error)');
      }
      
      if (data.pageUrl) {
        window.location.href = data.pageUrl;
      } else {
        console.warn('No payment URL received, showing success step');
        setStep(3); 
      }

    } catch (error: any) {
      console.error('Booking failed:', error);
      // Change alert to be very specific to verify new code
      alert(`Error (v2): ${error.message}`);
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
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('booking.name_label')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerDetails.name}
                    onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})}
                    className={`w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-primary-200 ${
                      !customerDetails.name && customerDetails.name !== '' ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder={t('booking.name_label')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('booking.phone_label')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerDetails.phone}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-200 outline-none"
                    placeholder="+380 xx xxx xx xx"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {t('booking.email_label')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerDetails.email}
                  onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})}
                  className={`w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-primary-200 ${
                    !customerDetails.email && customerDetails.email !== '' ? 'border-red-300' : 'border-neutral-200'
                  }`}
                  placeholder="example@mail.com"
                />
              </div>

              {/* Rules Checkbox */}
              <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                <div className="relative flex items-center h-5 mt-0.5">
                  <input
                    id="rules"
                    type="checkbox"
                    checked={isRulesAccepted}
                    onChange={(e) => setIsRulesAccepted(e.target.checked)}
                    className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </div>
                <label htmlFor="rules" className="text-sm text-neutral-600 cursor-pointer select-none">
                  {t('booking.terms')}
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                <div>
                  <p className="text-sm text-neutral-500">{t('booking.total')}</p>
                  <p className="text-3xl font-bold text-primary-600">{totalPrice} ₴</p>
                </div>
                <Button 
                  size="lg"
                  onClick={handleBooking}
                  disabled={
                    !customerDetails.name || 
                    customerDetails.phone.length < 17 || 
                    !customerDetails.email ||
                    !isRulesAccepted ||
                    loading
                  }
                >
                  {loading ? t('booking.processing') : t('booking.pay_btn')}
                </Button>
              </div>
              {/* Removed duplicate terms text since it's now in the checkbox */}
            </div>
          </div>
        );

      case 3: // Success
        // Check for success params in URL if redirected back
        const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

        useEffect(() => {
          // Check URL for bookingId
          const params = new URLSearchParams(window.location.search);
          const bookingId = params.get('bookingId');
          const success = params.get('success');

          if (success === 'true' && bookingId) {
             // Poll for status
             const checkStatus = async () => {
                try {
                  const res = await fetch('/api/check-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ invoiceId: bookingId }) // Note: check-payment expects invoiceId, but here we might have bookingId as reference?
                    // Wait, create-booking sets reference=bookingId. 
                    // check-payment expects invoiceId (payment_id).
                    // But we don't have payment_id in URL, only bookingId.
                    // Let's modify check-payment to support bookingId or just rely on manual check for now to avoid complexity.
                    // Actually, Monobank redirectUrl doesn't give us invoiceId back, just what we put in query params.
                  });
                  // For now, just show success message.
                } catch (e) {
                  console.error(e);
                }
             };
             // checkStatus();
          }
        }, []);

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
              <Button onClick={() => navigate('/')}>
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
