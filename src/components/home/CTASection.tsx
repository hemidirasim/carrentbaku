import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* CTA Content */}
          <div className="text-white flex flex-col justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-white/90 mb-8">
              {t('cta.subtitle')}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-base font-semibold h-14"
                onClick={() => window.location.href = 'tel:+994502345678'}
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('cta.button')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base font-semibold h-14 bg-white/10 text-white border-white/30 hover:bg-white/20"
                onClick={() => window.location.href = '/cars'}
              >
                {t('cars.viewAll')}
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="h-[400px] lg:h-auto rounded-2xl overflow-hidden shadow-elegant ring-2 ring-white/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194472.87406069526!2d49.70854745!3d40.39477495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[20%]"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
