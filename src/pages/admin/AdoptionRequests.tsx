import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { getDateLocale } from '../../lib/utils';
import { MessageSquare, Phone, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  AdminTable, 
  AdminTableHead, 
  AdminTableHeader, 
  AdminTableBody, 
  AdminTableRow, 
  AdminTableCell 
} from '../../components/ui/AdminTable';

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
  const { t, i18n } = useTranslation();
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

      <AdminTable>
        <AdminTableHead>
          <AdminTableHeader>{t('admin.requests.table.date')}</AdminTableHeader>
          <AdminTableHeader>{t('admin.requests.table.cat')}</AdminTableHeader>
          <AdminTableHeader>{t('admin.requests.table.applicant')}</AdminTableHeader>
          <AdminTableHeader>{t('admin.requests.table.message')}</AdminTableHeader>
          <AdminTableHeader align="right">{t('admin.requests.table.status')}</AdminTableHeader>
        </AdminTableHead>
        <AdminTableBody>
          {requests.map((req) => (
            <AdminTableRow key={req.id}>
              <AdminTableCell>
                <div className="flex flex-col gap-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-fit ${
                    req.type === 'adopt' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {t(`admin.requests.types.${req.type}`)}
                  </span>
                  <span className="text-sm text-neutral-600">
                    {format(new Date(req.created_at), 'dd.MM.yyyy', { locale: getDateLocale(i18n.language) })}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {format(new Date(req.created_at), 'HH:mm')}
                  </span>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex items-center gap-3">
                  <img 
                    src={req.cat?.images?.[0] || 'https://placehold.co/40x40/e2e8f0/a0aec0?text=Cat'} 
                    alt={req.cat?.name}
                    className="w-10 h-10 rounded-full object-cover bg-neutral-200"
                  />
                  <span className="font-medium text-neutral-800">{req.cat?.name || t('admin.requests.unknown_cat')}</span>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="font-medium text-neutral-800">{req.name}</div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                    <Phone size={12} />
                    <a href={`tel:${req.phone}`} className="hover:text-primary-600">{req.phone}</a>
                  </div>
                  {req.email && (
                    <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                      <Mail size={12} />
                      <a href={`mailto:${req.email}`} className="hover:text-primary-600">{req.email}</a>
                    </div>
                  )}
                </div>
              </AdminTableCell>
              <AdminTableCell>
                {req.message ? (
                  <div className="text-sm text-neutral-600 bg-neutral-50 p-2 rounded-lg max-w-xs">
                    <p className="line-clamp-3" title={req.message}>{req.message}</p>
                  </div>
                ) : (
                  <span className="text-neutral-400 text-sm">-</span>
                )}
              </AdminTableCell>
              <AdminTableCell align="right">
                <div className="flex flex-col gap-2 items-end">
                   <button
                    onClick={() => updateStatus(req.id, 'new')}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors w-full justify-end ${
                      req.status === 'new' 
                        ? 'text-yellow-700 font-bold bg-yellow-50' 
                        : 'text-neutral-400 hover:text-yellow-600'
                    }`}
                  >
                    {req.status === 'new' && <Clock size={12} />}
                    {t('admin.requests.statuses.new')}
                  </button>

                  <button
                    onClick={() => updateStatus(req.id, 'contacted')}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors w-full justify-end ${
                      req.status === 'contacted' 
                        ? 'text-blue-700 font-bold bg-blue-50' 
                        : 'text-neutral-400 hover:text-blue-600'
                    }`}
                  >
                    {req.status === 'contacted' && <CheckCircle size={12} />}
                    {t('admin.requests.statuses.contacted')}
                  </button>

                  <button
                    onClick={() => updateStatus(req.id, 'closed')}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors w-full justify-end ${
                      req.status === 'closed' 
                        ? 'text-green-700 font-bold bg-green-50' 
                        : 'text-neutral-400 hover:text-green-600'
                    }`}
                  >
                    {req.status === 'closed' && <XCircle size={12} />}
                    {t('admin.requests.statuses.closed')}
                  </button>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
          {requests.length === 0 && (
            <AdminTableRow>
              <AdminTableCell className="text-center text-neutral-500" />
              <AdminTableCell />
                {t('admin.requests.empty')}
              <AdminTableCell />
              <AdminTableCell />
            </AdminTableRow>
          )}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
};
