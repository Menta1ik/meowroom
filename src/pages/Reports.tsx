import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { FileText, Calendar, DollarSign, ChevronRight, CheckCircle2, Building2, HeartHandshake, Stethoscope, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';

interface Expense {
  id: string;
  title: string;
  description: string;
  title_en?: string;
  description_en?: string;
  amount: number;
  currency: string;
  category: 'monthly' | 'target' | 'operational';
  expense_date: string;
  receipt_urls: string[];
}

const Reports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'monthly' | 'target' | 'operational'>('all');
  const [selectedReceipts, setSelectedReceipts] = useState<string[] | null>(null);
  
  // Date filtering state
  // Format: "YYYY-MM" or "all"
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setItems(data || []);
      
      // If we have data but no data for current month, switch to "all" or the latest month with data
      // For now, let's just stick to current month or let user choose
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique months from items for the dropdown
  const availableMonths = React.useMemo(() => {
    const months = new Set(items.map(item => item.expense_date.slice(0, 7)));
    return Array.from(months).sort().reverse();
  }, [items]);

  // Filter items by month first
  const itemsByMonth = React.useMemo(() => {
    if (selectedMonth === 'all') return items;
    return items.filter(item => item.expense_date.startsWith(selectedMonth));
  }, [items, selectedMonth]);

  // Calculations for Infographics (based on selected month)
  const totalExpenses = itemsByMonth.reduce((acc, item) => acc + item.amount, 0);
  const teamFunded = itemsByMonth.filter(i => i.category === 'operational').reduce((acc, item) => acc + item.amount, 0);
  const donationFunded = totalExpenses - teamFunded;
  
  const teamPercentage = totalExpenses > 0 ? (teamFunded / totalExpenses) * 100 : 0;
  const donationPercentage = totalExpenses > 0 ? (donationFunded / totalExpenses) * 100 : 0;

  // Then filter by category tab
  const filteredItems = activeTab === 'all' 
    ? itemsByMonth 
    : itemsByMonth.filter(item => item.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'operational': return <Building2 size={18} />;
      case 'target': return <Stethoscope size={18} />;
      case 'monthly': return <HeartHandshake size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operational': return 'bg-purple-100 text-purple-700';
      case 'target': return 'bg-orange-100 text-orange-700';
      case 'monthly': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    // In a real app, use t() here
    switch (category) {
      case 'operational': return t('reports.cat_operational', 'Operational (Team Funded)');
      case 'target': return t('reports.cat_target', 'Medical & Target');
      case 'monthly': return t('reports.cat_monthly', 'Regular (Food & Care)');
      default: return category;
    }
  };

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <SEO 
        title={t('reports.title', 'Transparency & Reports')}
        description={t('reports.seo_description')}
      />
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
                <FileText size={32} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{t('reports.title', 'Transparency & Reports')}</h1>
            </div>
            
            {/* Month Filter */}
            <div className="inline-flex items-center bg-neutral-50 rounded-xl border border-neutral-200 p-1 self-center md:self-auto">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-neutral-800 font-medium py-2 pl-4 pr-8 rounded-lg outline-none cursor-pointer appearance-none hover:bg-neutral-100 transition-colors"
                style={{ backgroundImage: 'none' }}
              >
                <option value="all">{t('reports.filter_all_time', 'All Time')}</option>
                {availableMonths.map(month => {
                  const date = new Date(`${month}-01`);
                  const label = date.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });
                  // Capitalize first letter
                  return (
                    <option key={month} value={month}>
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </option>
                  );
                })}
              </select>
              <div className="pr-3 pointer-events-none text-neutral-400">
                <Calendar size={18} />
              </div>
            </div>
          </div>

          <p className="text-xl text-neutral-600 font-light leading-relaxed text-center md:text-left">
            {t('reports.subtitle', 'See exactly how your donations help cats. We cover operational costs ourselves, so 100% of your donation goes to the animals.')}
          </p>
        </div>

        {/* Infographics Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-neutral-50 p-6 rounded-2xl shadow-sm border border-neutral-100">
              <div className="text-sm text-neutral-500 font-medium uppercase tracking-wide mb-1">
                {t('reports.total_expenses', 'Total Expenses')}
              </div>
              <div className="text-3xl font-bold text-neutral-900">
                {totalExpenses.toLocaleString()} <span className="text-lg text-neutral-400 font-normal">UAH</span>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-sm text-blue-600 font-medium uppercase tracking-wide mb-1">
                  {t('reports.funded_by_donors', 'Funded by You')}
                </div>
                <div className="text-3xl font-bold text-blue-900">
                  {donationFunded.toLocaleString()} <span className="text-lg text-blue-400 font-normal">UAH</span>
                </div>
              </div>
              <HeartHandshake className="absolute right-4 bottom-4 text-blue-100 w-16 h-16" />
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl shadow-sm border border-purple-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-sm text-purple-600 font-medium uppercase tracking-wide mb-1">
                  {t('reports.funded_by_team', 'Funded by Team')}
                </div>
                <div className="text-3xl font-bold text-purple-900">
                  {teamFunded.toLocaleString()} <span className="text-lg text-purple-400 font-normal">UAH</span>
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  {t('reports.team_desc', '(Rent, Utilities, Admin)')}
                </div>
              </div>
              <Building2 className="absolute right-4 bottom-4 text-purple-100 w-16 h-16" />
            </div>
          </div>

          {/* Bar Chart Visual */}
          <div className="bg-neutral-50 p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-lg font-bold text-neutral-800 mb-6">{t('reports.budget_breakdown', 'Budget Breakdown')}</h3>
            <div className="h-8 w-full bg-neutral-100 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000 relative group"
                style={{ width: `${donationPercentage}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">
                  {t('reports.chart_donations', '{{percent}}% Donations', { percent: donationPercentage.toFixed(1) })}
                </div>
              </div>
              <div 
                className="h-full bg-purple-500 transition-all duration-1000 relative group"
                style={{ width: `${teamPercentage}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">
                  {t('reports.chart_team', '{{percent}}% Team Funded', { percent: teamPercentage.toFixed(1) })}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-3 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-neutral-600">{t('reports.legend_donations', 'Direct Care (Donations)')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-neutral-600">{t('reports.legend_team', 'Operational (Team Funded)')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {[
              { id: 'all', label: t('reports.all', 'All Expenses') },
              { id: 'monthly', label: t('reports.cat_monthly', 'Regular') },
              { id: 'target', label: t('reports.cat_target', 'Medical/Target') },
              { id: 'operational', label: t('reports.cat_operational', 'Operational') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Expense List */}
        <div className="max-w-5xl mx-auto space-y-4">
          {loading ? (
             <div className="text-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
             </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-neutral-100">
              <p className="text-neutral-500">{t('reports.no_data', 'No reports found for this period.')}</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={item.id} 
                className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 md:items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(item.category)}`}>
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-neutral-400">
                        {new Date(item.expense_date).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-800 leading-tight mb-1">
                      {(i18n.language === 'en' && item.title_en) ? item.title_en : item.title}
                    </h3>
                    {(item.description || item.description_en) && (
                      <p className="text-sm text-neutral-500 max-w-xl">
                        {(i18n.language === 'en' && item.description_en) ? item.description_en : item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pl-16 md:pl-0">
                  <div className="text-right">
                    <div className="text-lg font-bold text-neutral-900">
                      {item.amount.toLocaleString()} <span className="text-sm font-normal text-neutral-500">{item.currency === 'UAH' ? t('reports.currency', 'UAH') : item.currency}</span>
                    </div>
                  </div>
                  
                  {item.receipt_urls && item.receipt_urls.length > 0 && (
                    <button 
                      onClick={() => setSelectedReceipts(item.receipt_urls)}
                      className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-colors"
                    >
                      <FileText size={16} />
                      {t('reports.view_check', 'View Check')}
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Receipts Modal */}
      {selectedReceipts && createPortal(
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedReceipts(null)}
          >
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-transparent" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedReceipts(null)}
                className="absolute -top-12 right-0 text-white hover:text-neutral-300 transition-colors p-2"
              >
                <span className="sr-only">Close</span>
                <X size={32} />
              </button>
              
              <div className="grid gap-4">
                {selectedReceipts.map((url, idx) => (
                  <img 
                    key={idx} 
                    src={url} 
                    alt={`Receipt ${idx + 1}`} 
                    className="w-full h-auto rounded-lg shadow-2xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Reports;
