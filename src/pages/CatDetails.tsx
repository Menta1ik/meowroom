import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Share2, Heart, X, ZoomIn } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Cat } from '../components/cards/CatCard';
import { Button } from '../components/ui/Button';
import { useBooking } from '../context/BookingContext';
import { AdoptionModal } from '../components/ui/AdoptionModal';

const CatDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { openBooking } = useBooking();
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchCat = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('cats')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCat(data);
      } catch (error) {
        console.error('Error fetching cat:', error);
        navigate('/cats'); // Redirect if not found
      } finally {
        setLoading(false);
      }
    };

    fetchCat();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cat) return null;

  const shareUrl = window.location.href;
  const description = `${cat.name} — ${cat.age}. ${cat.history.substring(0, 150)}...`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Meowroom - ${cat.name}`,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <Helmet>
        <title>{cat.name} | Meowroom</title>
        <meta name="description" content={description} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${cat.name} | Meowroom`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={cat.images[0]} />
        <meta property="og:type" content="article" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${cat.name} | Meowroom`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={cat.images[0]} />
      </Helmet>

      <div className="min-h-screen bg-white pt-24 pb-20">
        <AdoptionModal 
          isOpen={isAdoptionModalOpen} 
          onClose={() => setIsAdoptionModalOpen(false)} 
          cat={cat} 
        />

        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsLightboxOpen(false)}
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full"
              >
                <X size={32} />
              </button>
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                src={cat.images[activeImage]}
                alt={cat.name}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Back Button */}
          <Link to="/cats" className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors mb-8 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>{t('booking.back')}</span>
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Left: Images */}
            <div className="space-y-4">
              <div 
                className="aspect-square rounded-3xl overflow-hidden bg-neutral-100 shadow-sm relative group cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img 
                  src={cat.images[activeImage]} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
                  <ZoomIn size={20} />
                </div>
                {cat.tags && (
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                    {cat.tags.map((tag, i) => (
                      <span key={i} className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-neutral-600 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {cat.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto p-2 scrollbar-hide">
                  {cat.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                        activeImage === idx 
                          ? 'ring-2 ring-primary-500 ring-offset-2 opacity-100 shadow-sm' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-2">{cat.name}</h1>
                  <p className="text-xl text-neutral-500 font-medium flex items-center gap-2">
                    {cat.gender === 'boy' || cat.gender === 'Мальчик' ? t('admin.cats.gender.boy') : 
                     cat.gender === 'girl' || cat.gender === 'Девочка' ? t('admin.cats.gender.girl') : cat.gender}
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                    {cat.age}
                  </p>
                </div>
                <button 
                  onClick={handleShare}
                  className="p-3 rounded-full bg-neutral-50 text-neutral-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  aria-label="Share"
                >
                  <Share2 size={24} />
                </button>
              </div>

              <div className="prose prose-lg text-neutral-600 leading-relaxed mb-10">
                <h3 className="text-xl font-bold text-neutral-800 mb-4">{t('admin.cats.form.history')}</h3>
                <p className="whitespace-pre-line">{cat.history}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => setIsAdoptionModalOpen(true)} size="lg" className="flex-1 gap-2 justify-center">
                  <Heart size={20} className="fill-current" />
                  {t('hero.cta_cats')}
                </Button>
                
                <Button 
                  onClick={openBooking} 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 justify-center"
                >
                  {t('cats.card.meet')}
                </Button>
              </div>
              
              <p className="text-center text-sm text-neutral-400 mt-6 max-w-sm mx-auto">
                * Всі котики віддаються тільки після співбесіди та підписання договору
              </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatDetails;
