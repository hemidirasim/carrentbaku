import { useState } from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const FeedbackForm = () => {
  const { t } = useLanguage();
  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };


  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactData.firstName || !contactData.lastName || !contactData.email || !contactData.message) {
      toast.error(t('contact.error.fillRequired'));
      return;
    }

    console.log('Contact submitted:', contactData);
    toast.success(t('contact.success'));
    
    setContactData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <section className="py-20" style={{ backgroundColor: 'aliceblue' }}>
      <div className="container mx-auto px-4">
        {/* Single redesigned contact card */}
        <div className="rounded-2xl p-0 shadow-elegant overflow-hidden relative max-w-7xl mx-auto">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600" alt="contact background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/65" />
          </div>
          <div className="relative p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              {/* Left: info */}
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
                  {t('contact.title')}
                </h2>
                <p className="text-white/80 mb-8 max-w-prose">
                  {t('contact.subtitle') || 'Bizimlə əlaqə saxlayın — komandamız sizə məmnuniyyətlə kömək edəcək.'}
                </p>

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 text-white">
                    <MapPin className="w-5 h-5" />
                    <span>{t('contact.address')}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <Mail className="w-5 h-5" />
                    <span>info@carrentbaku.az</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <Phone className="w-5 h-5" />
                    <span>+994 (50) 123 45 67</span>
                  </div>
                  <div className="space-y-2 text-white">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5" />
                      <span>{t('contact.hours.weekdays')}</span>
                    </div>
                    <div className="flex items-center space-x-3 ml-8">
                      <span>{t('contact.hours.saturday')}</span>
                    </div>
                    <div className="flex items-center space-x-3 ml-8">
                      <span>{t('contact.hours.sunday')}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block h-px bg-white/20" />
              </div>

              {/* Right: form */}
              <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactFirstName" className="text-white font-semibold mb-2 block">
                    {t('contact.firstName')} <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="contactFirstName"
                    name="firstName"
                    value={contactData.firstName}
                    onChange={handleContactChange}
                    className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                    placeholder={t('contact.firstNamePlaceholder')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactLastName" className="text-white font-semibold mb-2 block">
                    {t('contact.lastName')} <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="contactLastName"
                    name="lastName"
                    value={contactData.lastName}
                    onChange={handleContactChange}
                    className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                    placeholder={t('contact.lastNamePlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contactEmail" className="text-white font-semibold mb-2 block">
                  {t('contact.email')} <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  name="email"
                  type="email"
                  value={contactData.email}
                  onChange={handleContactChange}
                  className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                  placeholder={t('contact.emailPlaceholder')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-white font-semibold mb-2 block">
                  {t('contact.subject')}
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={contactData.subject}
                  onChange={handleContactChange}
                  className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                  placeholder={t('contact.subjectPlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="contactMessage" className="text-white font-semibold mb-2 block">
                  {t('contact.message')} <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="contactMessage"
                  name="message"
                  value={contactData.message}
                  onChange={handleContactChange}
                  className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50 min-h-[120px]"
                  placeholder={t('contact.messagePlaceholder')}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-lg py-4 rounded-lg shadow-lg transition-all hover:shadow-xl"
              >
                {t('contact.submit')}
              </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
