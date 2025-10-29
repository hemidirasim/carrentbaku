import { useState } from 'react';
import { Star, MapPin, Mail, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const FeedbackForm = () => {
  const { t } = useLanguage();
  const [feedbackData, setFeedbackData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rating: 0,
    liked: '',
    improvements: '',
  });

  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFeedbackData(prev => ({ ...prev, rating }));
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackData.firstName || !feedbackData.email || !feedbackData.liked) {
      toast.error(t('feedback.error.fillRequired'));
      return;
    }

    console.log('Feedback submitted:', feedbackData);
    toast.success(t('feedback.success'));
    
    setFeedbackData({
      firstName: '',
      lastName: '',
      email: '',
      rating: 0,
      liked: '',
      improvements: '',
    });
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
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Contact Section - Blue */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 shadow-elegant">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {t('contact.visitUs')}
              </h2>
            </div>

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

            {/* Contact Form */}
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
                className="w-full bg-yellow-500 text-white hover:bg-yellow-600 font-bold text-lg py-4 rounded-lg shadow-lg transition-all hover:shadow-xl"
              >
                {t('contact.submit')}
              </Button>
            </form>
          </div>

          {/* Feedback Section - Yellow */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 md:p-12 shadow-elegant">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {t('feedback.title')}
              </h2>
              <p className="text-white/90 text-lg">
                {t('feedback.subtitle')}
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* First Name */}
              <div>
                <Label htmlFor="firstName" className="text-white font-semibold mb-2 block">
                  {t('feedback.firstName')} <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={feedbackData.firstName}
                  onChange={handleFeedbackChange}
                  className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                  placeholder={t('feedback.firstNamePlaceholder')}
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastName" className="text-white font-semibold mb-2 block">
                  {t('feedback.lastName')}
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={feedbackData.lastName}
                  onChange={handleFeedbackChange}
                  className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                  placeholder={t('feedback.lastNamePlaceholder')}
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-white font-semibold mb-2 block">
                  {t('feedback.email')} <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={feedbackData.email}
                  onChange={handleFeedbackChange}
                  className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                  placeholder={t('feedback.emailPlaceholder')}
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <Label className="text-white font-semibold mb-3 block">
                  {t('feedback.rateServices')}
                </Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= feedbackData.rating
                            ? 'fill-white text-white'
                            : 'fill-white/30 text-white/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* What did you like */}
              <div>
                <Label htmlFor="liked" className="text-white font-semibold mb-2 block">
                  {t('feedback.liked')} <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="liked"
                  name="liked"
                  value={feedbackData.liked}
                  onChange={handleFeedbackChange}
                  className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50 min-h-[100px]"
                  placeholder={t('feedback.likedPlaceholder')}
                  required
                />
              </div>

              {/* How can we improve */}
              <div>
                <Label htmlFor="improvements" className="text-white font-semibold mb-2 block">
                  {t('feedback.improvements')}
                </Label>
                <Textarea
                  id="improvements"
                  name="improvements"
                  value={feedbackData.improvements}
                  onChange={handleFeedbackChange}
                  className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50 min-h-[100px]"
                  placeholder={t('feedback.improvementsPlaceholder')}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-white text-yellow-600 hover:bg-white/90 font-bold text-lg py-6 rounded-lg shadow-lg transition-all hover:shadow-xl"
                >
                  {t('feedback.send')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
