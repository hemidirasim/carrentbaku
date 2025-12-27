import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  customer_name: string;
  customer_location?: string | null;
  rating: number;
  title_az: string;
  title_ru?: string | null;
  title_en?: string | null;
  title_ar?: string | null;
  content_az: string;
  content_ru?: string | null;
  content_en?: string | null;
  content_ar?: string | null;
  review_type: 'text' | 'video';
  video_url?: string | null;
  verified: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const ReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAdmin();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_location: '',
    rating: 5,
    review_type: 'text' as 'text' | 'video',
    video_url: '',
    title_az: '',
    title_ru: '',
    title_en: '',
    title_ar: '',
    content_az: '',
    content_ru: '',
    content_en: '',
    content_ar: '',
    verified: false,
    featured: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadReview(id);
    }
  }, [id, isEditing]);

  const loadReview = async (reviewId: string) => {
    try {
      setLoading(true);
      const review: Review = await api.reviews.getById(reviewId);
      setFormData({
        customer_name: review.customer_name || '',
        customer_location: review.customer_location || '',
        rating: review.rating || 5,
        review_type: review.review_type || 'text',
        video_url: review.video_url || '',
        title_az: review.title_az || '',
        title_ru: review.title_ru || '',
        title_en: review.title_en || '',
        title_ar: review.title_ar || '',
        content_az: review.content_az || '',
        content_ru: review.content_ru || '',
        content_en: review.content_en || '',
        content_ar: review.content_ar || '',
        verified: Boolean(review.verified),
        featured: Boolean(review.featured),
      });
    } catch (error: any) {
      console.error('Error loading review:', error);
      const errorMessage = error?.message || error?.error || 'Rəyi yükləməkdə xəta baş verdi';
      toast.error(errorMessage);
      navigate('/admin/reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const makeTitle = (existing: string, fallback: string) => {
    const primary = (existing || '').trim();
    if (primary) {
      return primary.slice(0, 80);
    }
    const secondary = (fallback || '').trim();
    if (secondary) {
      return secondary.slice(0, 80);
    }
    return 'Müştəri rəyi';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name.trim()) {
      toast.error('Müştəri adı məcburidir');
      return;
    }
    if (!formData.content_az.trim()) {
      toast.error('Azərbaycan məzmunu məcburidir');
      return;
    }
    if (formData.review_type === 'video' && !formData.video_url.trim()) {
      toast.error('Video rəy üçün video linki daxil edin');
      return;
    }

    try {
      setLoading(true);
      const contentAz = formData.content_az.trim();
      const payload = {
        customer_name: formData.customer_name.trim(),
        customer_location: formData.customer_location.trim(),
        rating: Number(formData.rating),
        review_type: formData.review_type,
        video_url: formData.review_type === 'video' ? formData.video_url.trim() : null,
        title_az: makeTitle(formData.title_az, contentAz),
        title_ru: makeTitle(formData.title_ru, formData.content_ru || contentAz),
        title_en: makeTitle(formData.title_en, formData.content_en || contentAz),
        title_ar: makeTitle(formData.title_ar, formData.content_ar || contentAz),
        content_az: contentAz,
        content_ru: formData.content_ru.trim(),
        content_en: formData.content_en.trim(),
        content_ar: formData.content_ar.trim(),
        verified: formData.verified,
        featured: formData.featured,
      };

      if (isEditing && id) {
        await api.reviews.update(id, payload);
        toast.success('Rəy yeniləndi');
      } else {
        await api.reviews.create(payload);
        toast.success('Rəy yaradıldı');
      }

      navigate('/admin/reviews');
    } catch (error: any) {
      console.error('Error saving review:', error);
      const errorMessage = error?.message || error?.error || 'Rəyi saxlamaqda xəta baş verdi';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/reviews')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Rəyi Redaktə Et' : 'Yeni Rəy'}</h1>
                <p className="text-muted-foreground">{isEditing ? 'Müştəri rəyini yeniləyin' : 'Yeni müştəri rəyi əlavə edin'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Müştərinin adı *</Label>
                  <Input
                    value={formData.customer_name}
                    onChange={(e) => handleChange('customer_name', e.target.value)}
                    placeholder="Müştərinin adı"
                    required
                  />
                </div>
                <div>
                  <Label>Müştərinin yerləşdiyi şəhər</Label>
                  <Input
                    value={formData.customer_location}
                    onChange={(e) => handleChange('customer_location', e.target.value)}
                    placeholder="Şəhər"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Qiymət *</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => handleChange('rating', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bal seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(value => (
                        <SelectItem key={value} value={value.toString()}>
                          {value} / 5
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rəy növü *</Label>
                  <Select
                    value={formData.review_type}
                    onValueChange={(value: 'text' | 'video') => handleChange('review_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Növ seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Mətn</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.review_type === 'video' && (
                <div>
                  <Label>Video URL *</Label>
                  <Input
                    value={formData.video_url}
                    onChange={(e) => handleChange('video_url', e.target.value)}
                    placeholder="https://..."
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">YouTube embed link əlavə edin (məsələn, https://www.youtube.com/embed/ID).</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Məzmun (AZ) *</Label>
                  <Textarea
                    value={formData.content_az}
                    onChange={(e) => handleChange('content_az', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label>Məzmun (EN)</Label>
                  <Textarea
                    value={formData.content_en}
                    onChange={(e) => handleChange('content_en', e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Məzmun (RU)</Label>
                  <Textarea
                    value={formData.content_ru}
                    onChange={(e) => handleChange('content_ru', e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Məzmun (AR)</Label>
                  <Textarea
                    value={formData.content_ar}
                    onChange={(e) => handleChange('content_ar', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base">Təsdiqlənmiş</Label>
                    <p className="text-sm text-muted-foreground">Rəy doğrulanmış müştəriyə məxsusdur</p>
                  </div>
                  <Switch
                    checked={formData.verified}
                    onCheckedChange={(checked) => handleChange('verified', checked)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base">Seçilmiş</Label>
                    <p className="text-sm text-muted-foreground">Ana səhifədə vurğulanan rəy kimi göstər</p>
                  </div>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleChange('featured', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/reviews')}>
                  Ləğv et
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Yüklənir...' : (isEditing ? 'Yenilə' : 'Yarat')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReviewForm;
