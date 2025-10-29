import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const FeedbackForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rating: 0,
    liked: '',
    improvements: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.liked) {
      toast.error(t('feedback.error.fillRequired'));
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Feedback submitted:', formData);
    toast.success(t('feedback.success'));
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      rating: 0,
      liked: '',
      improvements: '',
    });
  };

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 md:p-12 shadow-elegant">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {t('feedback.title')}
              </h2>
              <p className="text-white/90 text-lg">
                {t('feedback.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name */}
              <div>
                <Label htmlFor="firstName" className="text-white font-semibold mb-2 block">
                  {t('feedback.firstName')} <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
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
                  value={formData.lastName}
                  onChange={handleInputChange}
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
                  value={formData.email}
                  onChange={handleInputChange}
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
                          star <= formData.rating
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
                  value={formData.liked}
                  onChange={handleInputChange}
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
                  value={formData.improvements}
                  onChange={handleInputChange}
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
