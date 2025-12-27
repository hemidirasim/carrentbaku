import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Car, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

interface AboutData {
  id?: string;
  title_az: string;
  title_ru?: string;
  title_en?: string;
  title_ar?: string;
  tagline_az?: string;
  tagline_ru?: string;
  tagline_en?: string;
  tagline_ar?: string;
  content_az: string;
  content_ru?: string;
  content_en?: string;
  content_ar?: string;
  image_urls?: string[];
  stats?: Array<{ icon: string; value: string; label: string }>;
  values?: Array<{ title: string; description: string; icon: string }>;
}

const About = () => {
  const { t, language } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const data = await api.about.get();
      
      if (data) {
        // Parse image_urls if needed
        let imageUrls: string[] = [];
        if (data.image_urls && Array.isArray(data.image_urls)) {
          imageUrls = data.image_urls;
        } else if (data.image_urls) {
          try {
            const parsed = JSON.parse(data.image_urls);
            imageUrls = Array.isArray(parsed) ? parsed : [];
          } catch {
            imageUrls = [];
          }
        }

        // Parse stats
        let stats = null;
        if (data.stats) {
          try {
            stats = typeof data.stats === 'string' ? JSON.parse(data.stats) : data.stats;
          } catch {
            stats = null;
          }
        }

        // Parse values
        let values = null;
        if (data.values) {
          try {
            values = typeof data.values === 'string' ? JSON.parse(data.values) : data.values;
          } catch {
            values = null;
          }
        }

        setAboutData({
          ...data,
          image_urls: imageUrls,
          stats: stats,
          values: values,
        });
      }
    } catch (error) {
      console.error('Error loading about:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (!aboutData) return t('about.title');
    switch (language) {
      case 'ru': return aboutData.title_ru || aboutData.title_az;
      case 'en': return aboutData.title_en || aboutData.title_az;
      case 'ar': return aboutData.title_ar || aboutData.title_az;
      default: return aboutData.title_az;
    }
  };

  const getTagline = () => {
    if (!aboutData) return t('about.tagline');
    switch (language) {
      case 'ru': return aboutData.tagline_ru || aboutData.tagline_az || t('about.tagline');
      case 'en': return aboutData.tagline_en || aboutData.tagline_az || t('about.tagline');
      case 'ar': return aboutData.tagline_ar || aboutData.tagline_az || t('about.tagline');
      default: return aboutData.tagline_az || t('about.tagline');
    }
  };

  const formatContent = (content: string) => {
    if (!content) return '';
    
    // If content already contains HTML tags, return as is
    if (content.includes('<') && content.includes('>')) {
      return content;
    }
    
    // Otherwise, convert newlines to paragraphs
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => `<p>${line.trim()}</p>`)
      .join('');
  };

  const getContent = () => {
    if (!aboutData) {
      const defaultContent = t('about.description');
      return formatContent(defaultContent);
    }
    
    let content = '';
    switch (language) {
      case 'ru': content = aboutData.content_ru || aboutData.content_az; break;
      case 'en': content = aboutData.content_en || aboutData.content_az; break;
      case 'ar': content = aboutData.content_ar || aboutData.content_az; break;
      default: content = aboutData.content_az;
    }
    
    return formatContent(content);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Car': return Car;
      case 'Users': return Users;
      case 'Award': return Award;
      case 'Shield': return Shield;
      default: return Car;
    }
  };

  // Default stats if not loaded
  const rawStats = Array.isArray(aboutData?.stats) ? aboutData!.stats : [];
  const stats = rawStats
    .map(stat => ({
      icon: getIconComponent(stat.icon),
      value: stat.value,
      label: stat.label,
    }))
    .filter(stat => stat.value && stat.label);

  const values = Array.isArray(aboutData?.values)
    ? aboutData!.values.filter(value => (value.title && value.title.trim()) || (value.description && value.description.trim()))
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {getTitle()}
          </h1>
          {getTagline() && (
            <p className="text-white/90 text-center text-lg md:text-xl max-w-4xl mx-auto">
              {getTagline()}
            </p>
          )}
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('about.storyTitle')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <div 
                  className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: getContent() }}
                />
              </div>
            </div>

            {aboutData?.image_urls && aboutData.image_urls.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {aboutData.image_urls.slice(0, 4).map((imageUrl, index) => (
                  <div key={index} className={index === 1 || index === 3 ? 'pt-8' : ''}>
                    <img 
                      src={imageUrl}
                      alt={t('about.galleryAlt')}
                      className="rounded-lg shadow-card w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      style={{ aspectRatio: '1 / 1', minHeight: '200px' }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"
                    alt={t('about.galleryAlt')}
                    className="rounded-lg shadow-card"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000"
                    alt={t('about.galleryAlt')}
                    className="rounded-lg shadow-card"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000"
                    alt={t('about.galleryAlt')}
                    className="rounded-lg shadow-card"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000"
                    alt={t('about.galleryAlt')}
                    className="rounded-lg shadow-card"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="py-16 bg-gradient-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-elegant transition-all">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {values.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Dəyərlərimiz</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-elegant transition-all hover:-translate-y-2">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
