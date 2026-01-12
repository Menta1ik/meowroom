import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CreditCard, ChevronLeft, Calendar, Share2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';

interface FundraisingData {
  id: string;
  title: string;
  description: string;
  current_amount: number;
  target_amount: number;
  jar_link: string;
  card_number: string;
  image_url: string;
  created_at: string;
  is_active: boolean;
}

interface FundraisingMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
}

const FundraisingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [fundraising, setFundraising] = useState<FundraisingData | null>(null);
  const [media, setMedia] = useState<FundraisingMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching details for ID:', id);
      if (!id) return;
      
      try {
        // Fetch fundraising details
        const { data: fundraisingData, error: fundraisingError } = await supabase
          .from('fundraisings')
          .select('*')
          .eq('id', id)
          .single();

        console.log('Fundraising data:', fundraisingData);
        console.log('Fundraising error:', fundraisingError);

        if (fundraisingError) {
          console.error('Error fetching fundraising:', fundraisingError);
          setLoading(false);
          return;
        }

        setFundraising(fundraisingData);

        // Fetch media separately to avoid blocking
        const { data: mediaData, error: mediaError } = await supabase
          .from('fundraising_media')
          .select('*')
          .eq('fundraising_id', id)
          .order('created_at', { ascending: false });

        console.log('Media data:', mediaData);
        console.log('Media error:', mediaError);

        if (mediaError) {
          console.error('Error fetching media:', mediaError);
        } else {
          setMedia(mediaData || []);
        }

      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-neutral-500">Завантаження даних сбору...</p>
      </div>
    );
  }

  if (!fundraising) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">{t('common.not_found')}</h2>
        <p className="text-neutral-500 mb-6">ID: {id}</p>
        <Link to="/donate">
          <Button variant="outline">{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  const percentage = Math.min(Math.round((fundraising.current_amount / fundraising.target_amount) * 100), 100);

  const copyCardNumber = () => {
    navigator.clipboard.writeText(fundraising.card_number.replace(/\s/g, ''));
    alert(t('urgent.copy_success'));
  };

  const shareFundraising = () => {
    if (navigator.share) {
      navigator.share({
        title: fundraising.title,
        text: fundraising.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('common.link_copied'));
    }
  };

  return (
    <>
      <SEO 
        title={`${fundraising.title} | Meowroom`}
        description={fundraising.description.substring(0, 160)}
        image={fundraising.image_url}
      />

      <div className="pt-24 min-h-screen bg-white pb-20">
        <div className="container mx-auto px-4">
          <Link to="/donate" className="inline-flex items-center text-neutral-500 hover:text-primary-600 mb-8 transition-colors">
            <ChevronLeft size={20} className="mr-1" />
            {t('common.back')}
          </Link>

          <div className="max-w-6xl mx-auto">
            {/* Hero Section with Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* Left Column: Content & Media (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Title & Badge */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                      <AlertCircle size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">{t('urgent.label')}</span>
                    </div>
                    <div className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full flex items-center gap-2">
                      <Calendar size={14} />
                      <span className="text-xs font-medium">
                        {fundraising.created_at ? new Date(fundraising.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold leading-tight text-neutral-900">{fundraising.title}</h1>
                </div>

                {/* Description */}
                <div className="prose prose-lg text-neutral-600 max-w-none">
                  <p className="whitespace-pre-wrap">{fundraising.description}</p>
                </div>

                {/* Gallery Grid */}
                {media.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {media.map((item) => (
                      <div key={item.id} className="rounded-2xl overflow-hidden shadow-sm border border-neutral-100 bg-neutral-50">
                        {item.type === 'video' ? (
                          <video 
                            src={item.url} 
                            controls 
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover aspect-video bg-black"
                          >
                            <source src={item.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img 
                            src={item.url} 
                            alt="Media" 
                            className="w-full h-auto"
                            onError={(e) => {
                              console.error('Image load error:', item.url);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback if no gallery items but main image exists
                  fundraising.image_url && (
                    <div className="rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                       <img 
                        src={fundraising.image_url} 
                        alt={fundraising.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Right Column: Donation Card (4 cols) */}
              <div className="lg:col-span-4">
                <div className="sticky top-28 space-y-6">
                  {/* Progress Card */}
                  <div className="bg-orange-50/50 rounded-3xl border border-orange-100 p-6 shadow-sm">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="block text-xs font-bold text-neutral-400 uppercase mb-1">{t('urgent.collected')}</span>
                        <div className="flex items-baseline gap-1">
                           <span className="text-4xl font-black text-green-700 tracking-tight">
                             {fundraising.current_amount.toLocaleString('ru-RU')}
                           </span>
                           <span className="text-xl font-bold text-neutral-400">₴</span>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="block text-xs font-bold text-neutral-400 uppercase mb-1">{t('urgent.goal')}</span>
                         <div className="flex items-baseline justify-end gap-1">
                            <span className="text-xl font-bold text-neutral-500">
                              {fundraising.target_amount.toLocaleString('ru-RU')}
                            </span>
                            <span className="text-sm font-bold text-neutral-400">₴</span>
                         </div>
                      </div>
                    </div>

                    <div className="relative pt-2 pb-1">
                      <ProgressBar progress={percentage} colorClass="bg-red-500" className="h-2 bg-neutral-200" />
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center text-sm font-medium">
                       <span className="text-red-500 font-bold">{percentage}%</span>
                       <span className="text-neutral-500">
                         {t('urgent.remaining')} <span className="text-neutral-700 font-bold">{(fundraising.target_amount - fundraising.current_amount).toLocaleString('ru-RU')} ₴</span>
                       </span>
                    </div>

                    <div className="mt-8 space-y-3">
                      <Button 
                        href={fundraising.jar_link} 
                        target="_blank" 
                        className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100 py-4 text-lg font-bold rounded-full transition-transform active:scale-95"
                      >
                        {t('urgent.cta_help')}
                      </Button>
                      
                      <button 
                        onClick={copyCardNumber}
                        className="w-full bg-white flex flex-col items-center justify-center py-3 rounded-2xl border border-neutral-200 hover:border-red-400 hover:shadow-md transition-all group relative overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mb-1">
                           <CreditCard size={16} className="text-neutral-400 group-hover:text-red-500 transition-colors" />
                           <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">{t('urgent.card_number')}</span>
                        </div>
                        <span className="font-mono text-lg text-neutral-700 group-hover:text-red-600 font-medium tracking-wider transition-colors">
                          {fundraising.card_number.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || fundraising.card_number}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Share Button */}
                  <button 
                    onClick={shareFundraising}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors font-medium text-sm"
                  >
                    <Share2 size={16} />
                    <span>{t('common.share')}</span>
                  </button>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FundraisingDetails;
