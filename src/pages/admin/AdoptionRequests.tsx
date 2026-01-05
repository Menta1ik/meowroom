import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { MessageSquare, Phone, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AdoptionRequest {
  id: string;
  created_at: string;
  type: 'adopt' | 'guardian';
  name: string;
  phone: string;
  email: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  cat: {
    name: string;
    images: string[];
  };
}

export const AdoptionRequests: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('adoption_requests')
        .select(`
          *,
          cat:cats (
            name,
            images
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('adoption_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Optimistic update
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: newStatus as any } : req
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert(t('admin.schedule.save_error', 'Failed to update status'));
    }
  };

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-6 border-b border-neutral-100">
        <h2 className="text-xl font-bold text-neutral-800">{t('admin.requests.title')}</h2>
      </div>

      {requests.length === 0 ? (
        <div className="p-8 text-center text-neutral-500">
          {t('admin.requests.empty')}
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {requests.map((req) => (
            <div key={req.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                
                {/* Request Info */}
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      req.type === 'adopt' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {t(`admin.requests.types.${req.type}`)}
                    </span>
                    <span className="text-sm text-neutral-400">
                      {format(new Date(req.created_at), 'PPP p')}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={req.cat?.images?.[0] || 'https://via.placeholder.com/50'} 
                        alt={req.cat?.name}
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-200"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800">
                        {req.name} {t('admin.requests.wants_support')} <span className="text-primary-600">{req.cat?.name || t('admin.requests.unknown_cat')}</span>
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-1 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          <a href={`tel:${req.phone}`} className="hover:text-primary-600">{req.phone}</a>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          <a href={`mailto:${req.email}`} className="hover:text-primary-600">{req.email}</a>
                        </div>
                      </div>
                      {req.message && (
                        <div className="mt-2 text-sm text-neutral-600 bg-neutral-100 p-3 rounded-lg flex gap-2">
                          <MessageSquare size={16} className="shrink-0 mt-0.5 opacity-50" />
                          <p>{req.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">{t('admin.requests.table.status')}</p>
                  
                  <button
                    onClick={() => updateStatus(req.id, 'new')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      req.status === 'new' 
                        ? 'bg-yellow-100 text-yellow-800 font-medium' 
                        : 'text-neutral-500 hover:bg-neutral-100'
                    }`}
                  >
                    <Clock size={16} />
                    {t('admin.requests.statuses.new')}
                  </button>

                  <button
                    onClick={() => updateStatus(req.id, 'contacted')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      req.status === 'contacted' 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'text-neutral-500 hover:bg-neutral-100'
                    }`}
                  >
                    <CheckCircle size={16} />
                    {t('admin.requests.statuses.contacted')}
                  </button>

                  <button
                    onClick={() => updateStatus(req.id, 'closed')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      req.status === 'closed' 
                        ? 'bg-green-100 text-green-800 font-medium' 
                        : 'text-neutral-500 hover:bg-neutral-100'
                    }`}
                  >
                    <XCircle size={16} />
                    {t('admin.requests.statuses.closed')}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};