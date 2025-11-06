import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageGalleryUpload } from '@/components/ui/image-gallery-upload';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

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

const AdminAbout = () => {
  const { user } = useAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AboutData>({
    title_az: '',
    title_ru: '',
    title_en: '',
    title_ar: '',
    tagline_az: '',
    tagline_ru: '',
    tagline_en: '',
    tagline_ar: '',
    content_az: '',
    content_ru: '',
    content_en: '',
    content_ar: '',
    image_urls: [],
    stats: [
      { icon: 'Car', value: '100+', label: 'Avtomobil' },
      { icon: 'Users', value: '5000+', label: 'Məmnun Müştəri' },
      { icon: 'Award', value: '8+', label: 'İl Təcrübə' },
      { icon: 'Shield', value: '100%', label: 'Sığortalı' },
    ],
    values: [
      { title: 'Keyfiyyət', description: 'Yüksək keyfiyyətli avtomobillər və xidmət standartları', icon: '⭐' },
      { title: 'Etibarlılıq', description: '8 illik təcrübə və minlərlə məmnun müştəri', icon: '🤝' },
      { title: 'Şəffaflıq', description: 'Gizli ödənişlər yoxdur, hər şey aydın və anlaşılandır', icon: '💎' },
      { title: 'Dəstək', description: '24/7 müştəri dəstəyi və yardım', icon: '🛟' },
    ],
  });

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const data = await api.about.get();
      
      if (data) {
        // Parse image_urls
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
        let stats = formData.stats || [];
        if (data.stats) {
          try {
            const parsed = typeof data.stats === 'string' ? JSON.parse(data.stats) : data.stats;
            stats = Array.isArray(parsed) ? parsed : stats;
          } catch {
            stats = formData.stats || [];
          }
        }

        // Parse values
        let values = formData.values || [];
        if (data.values) {
          try {
            const parsed = typeof data.values === 'string' ? JSON.parse(data.values) : data.values;
            values = Array.isArray(parsed) ? parsed : values;
          } catch {
            values = formData.values || [];
          }
        }

        setFormData({
          title_az: data.title_az || '',
          title_ru: data.title_ru || '',
          title_en: data.title_en || '',
          title_ar: data.title_ar || '',
          tagline_az: data.tagline_az || '',
          tagline_ru: data.tagline_ru || '',
          tagline_en: data.tagline_en || '',
          tagline_ar: data.tagline_ar || '',
          content_az: data.content_az || '',
          content_ru: data.content_ru || '',
          content_en: data.content_en || '',
          content_ar: data.content_ar || '',
          image_urls: imageUrls,
          stats: stats,
          values: values,
        });
      }
    } catch (error: any) {
      console.error('Error loading about:', error);
      // If no about data exists, use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title_az.trim()) {
      toast.error('Azərbaycan başlığı məcburidir');
      return;
    }

    if (!formData.content_az.trim()) {
      toast.error('Azərbaycan məzmunu məcburidir');
      return;
    }

    try {
      setSaving(true);
      
      const submitData = {
        ...formData,
        stats: JSON.stringify(formData.stats || []),
        values: JSON.stringify(formData.values || []),
      };

      await api.about.update(submitData);
      toast.success('Haqqımızda bölməsi yeniləndi');
    } catch (error: any) {
      console.error('Error saving about:', error);
      const errorMessage = error?.message || error?.error || 'Saxlamaqda xəta baş verdi';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Haqqımızda Bölməsi İdarəetməsi</h1>
                <p className="text-muted-foreground">Haqqımızda səhifəsinin məzmununu redaktə edin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titles */}
              <div>
                <Label>Başlıq (AZ) *</Label>
                <Input
                  value={formData.title_az}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_az: e.target.value }))}
                  required
                  placeholder="Haqqımızda"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Başlıq (RU)</Label>
                  <Input
                    value={formData.title_ru}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_ru: e.target.value }))}
                    placeholder="О нас"
                  />
                </div>
                <div>
                  <Label>Başlıq (EN)</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    placeholder="About Us"
                  />
                </div>
                <div>
                  <Label>Başlıq (AR)</Label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                    placeholder="من نحن"
                  />
                </div>
              </div>

              {/* Taglines */}
              <div>
                <Label>Tagline (AZ)</Label>
                <Input
                  value={formData.tagline_az}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagline_az: e.target.value }))}
                  placeholder="Bizim haqqımızda qısa məlumat"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Tagline (RU)</Label>
                  <Input
                    value={formData.tagline_ru}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline_ru: e.target.value }))}
                    placeholder="Краткая информация о нас"
                  />
                </div>
                <div>
                  <Label>Tagline (EN)</Label>
                  <Input
                    value={formData.tagline_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline_en: e.target.value }))}
                    placeholder="Brief information about us"
                  />
                </div>
                <div>
                  <Label>Tagline (AR)</Label>
                  <Input
                    value={formData.tagline_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline_ar: e.target.value }))}
                    placeholder="معلومات موجزة عنا"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <Label>Məzmun (AZ) *</Label>
                <Textarea
                  value={formData.content_az}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_az: e.target.value }))}
                  rows={10}
                  required
                  placeholder="Haqqımızda məzmunu..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Məzmun (RU)</Label>
                  <Textarea
                    value={formData.content_ru}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_ru: e.target.value }))}
                    rows={8}
                    placeholder="Содержание..."
                  />
                </div>
                <div>
                  <Label>Məzmun (EN)</Label>
                  <Textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                    rows={8}
                    placeholder="Content..."
                  />
                </div>
                <div>
                  <Label>Məzmun (AR)</Label>
                  <Textarea
                    value={formData.content_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_ar: e.target.value }))}
                    rows={8}
                    placeholder="المحتوى..."
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <ImageGalleryUpload
                  value={formData.image_urls || []}
                  onChange={(urls) => setFormData(prev => ({ ...prev, image_urls: urls }))}
                  folder="about"
                  label="Şəkillər (maksimum 10 şəkil)"
                  maxImages={10}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')}>
                  Ləğv et
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Yüklənir...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Saxla
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminAbout;

