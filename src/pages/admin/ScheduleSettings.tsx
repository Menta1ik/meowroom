import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Save, Clock } from 'lucide-react';

interface WorkingHours {
  id: string;
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  break_start: string | null;
  break_end: string | null;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ScheduleSettings: React.FC = () => {
  const [schedule, setSchedule] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      alert('Schedule updated successfully!');
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading schedule...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-neutral-800">Weekly Schedule</h2>
        <Button onClick={saveSchedule} disabled={saving} className="flex items-center gap-2">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="p-6 space-y-4">
        {schedule.map((day, index) => (
          <div key={day.id} className={`flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border transition-colors ${
            day.is_open ? 'bg-white border-neutral-200' : 'bg-neutral-50 border-neutral-100 opacity-75'
          }`}>
            {/* Day Toggle */}
            <div className="w-full md:w-32 flex items-center gap-3">
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
                {DAYS[day.day_of_week]}
              </span>
            </div>

            {/* Hours */}
            {day.is_open && (
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-neutral-400" />
                  <span className="text-sm text-neutral-500 w-12">Open:</span>
                  <input
                    type="time"
                    value={day.open_time.slice(0, 5)}
                    onChange={(e) => handleUpdate(index, 'open_time', e.target.value)}
                    className="px-2 py-1 rounded border border-neutral-200 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500 w-12">Close:</span>
                  <input
                    type="time"
                    value={day.close_time.slice(0, 5)}
                    onChange={(e) => handleUpdate(index, 'close_time', e.target.value)}
                    className="px-2 py-1 rounded border border-neutral-200 text-sm"
                  />
                </div>
                
                {/* Break (Optional) */}
                <div className="flex items-center gap-2 lg:border-l lg:pl-4 border-neutral-200">
                  <span className="text-sm text-neutral-500 whitespace-nowrap">Break Start:</span>
                  <input
                    type="time"
                    value={day.break_start ? day.break_start.slice(0, 5) : ''}
                    onChange={(e) => handleUpdate(index, 'break_start', e.target.value)}
                    className="px-2 py-1 rounded border border-neutral-200 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500 whitespace-nowrap">Break End:</span>
                  <input
                    type="time"
                    value={day.break_end ? day.break_end.slice(0, 5) : ''}
                    onChange={(e) => handleUpdate(index, 'break_end', e.target.value)}
                    className="px-2 py-1 rounded border border-neutral-200 text-sm"
                  />
                </div>
              </div>
            )}
            
            {!day.is_open && (
              <div className="flex-grow text-neutral-400 text-sm italic">
                Closed
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
