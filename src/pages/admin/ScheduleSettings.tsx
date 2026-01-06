import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Save, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WorkingHours {
  id: string;
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  break_start: string | null;
  break_end: string | null;
}

export const ScheduleSettings: React.FC = () => {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Use type assertion to tell TS that we expect a string array
  const days = t('admin.schedule.days', { returnObjects: true }) as string[];

  const fetchSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      
      // Ensure we have 7 days, if not, fill missing (should be handled by migration but safety check)
      // For now, assume migration populated it correctly.
      // Re-order to start with Monday (1) -> Sunday (0) for display if preferred, but usually 0-6 is standard.
      // Let's display Mon-Sun.
      const sorted = [...(data || [])].sort((a, b) => {
        // Adjust sort to make Monday (1) first, Sunday (0) last
        const dayA = a.day_of_week === 0 ? 7 : a.day_of_week;
        const dayB = b.day_of_week === 0 ? 7 : b.day_of_week;
        return dayA - dayB;
      });
      
      setSchedule(sorted);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleUpdate = (index: number, field: keyof WorkingHours, value: any) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const saveSchedule = async () => {
    setSaving(true);
    try {
      const updates = schedule.map(({ id, is_open, open_time, close_time, break_start, break_end }) => ({
        id,
        is_open,
        open_time,
        close_time,
        break_start: break_start || null, // Handle empty strings as null
        break_end: break_end || null
      }));

      const { error } = await supabase
        .from('working_hours')
        .upsert(updates);

      if (error) throw error;
      alert(t('admin.schedule.save_success'));
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert(t('admin.schedule.save_error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-neutral-800">{t('admin.schedule.title')}</h2>
        <Button onClick={saveSchedule} disabled={saving} className="flex items-center gap-2">
          <Save size={18} />
          {saving ? t('admin.schedule.saving') : t('admin.schedule.save')}
        </Button>
      </div>

      <div className="p-6 space-y-4">
        {schedule.map((day, index) => (
          <div key={day.id} className={`flex flex-col md:flex-row items-center gap-6 xl:gap-10 p-4 rounded-xl border transition-colors ${
            day.is_open ? 'bg-white border-neutral-200' : 'bg-neutral-50 border-neutral-100 opacity-75'
          }`}>
            {/* Day Toggle */}
            <div className="w-full md:w-40 flex items-center gap-3 shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={day.is_open}
                  onChange={(e) => handleUpdate(index, 'is_open', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
              <span className={`font-bold ${day.is_open ? 'text-neutral-800' : 'text-neutral-400'}`}>
                {days[day.day_of_week] || day.day_of_week}
              </span>
            </div>

            {/* Hours */}
            {day.is_open && (
              <div className="flex-grow flex flex-col gap-3 w-full max-w-2xl ml-auto">
                {/* Row 1: Open / Close */}
                <div className="flex flex-wrap items-center justify-end gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500 w-32 text-right">{t('admin.schedule.table.open')}:</span>
                    <input
                      type="time"
                      value={day.open_time.slice(0, 5)}
                      onChange={(e) => handleUpdate(index, 'open_time', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-primary-500 outline-none transition-all w-32"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500 w-32 text-right">{t('admin.schedule.table.close')}:</span>
                    <input
                      type="time"
                      value={day.close_time.slice(0, 5)}
                      onChange={(e) => handleUpdate(index, 'close_time', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-primary-500 outline-none transition-all w-32"
                    />
                  </div>
                </div>

                {/* Row 2: Break Start / End */}
                <div className="flex flex-wrap items-center justify-end gap-6 border-t border-neutral-100 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500 w-32 text-right">{t('admin.schedule.table.break_start', 'Break Start')}:</span>
                    <input
                      type="time"
                      value={day.break_start ? day.break_start.slice(0, 5) : ''}
                      onChange={(e) => handleUpdate(index, 'break_start', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-primary-500 outline-none transition-all w-32"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500 w-32 text-right">{t('admin.schedule.table.break_end', 'Break End')}:</span>
                    <input
                      type="time"
                      value={day.break_end ? day.break_end.slice(0, 5) : ''}
                      onChange={(e) => handleUpdate(index, 'break_end', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-primary-500 outline-none transition-all w-32"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {!day.is_open && (
              <div className="flex-grow text-neutral-400 text-sm italic">
                {t('admin.schedule.closed')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};