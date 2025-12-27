import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageGalleryUpload } from '@/components/ui/image-gallery-upload';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

interface CarOption {
  id: string;
  brand: string;
  model: string;
  category: string;
  image_url?: string[] | string;
}

interface Service {
  id: string;
  title_az: string;
  title_ru?: string;
  title_en?: string;
  title_ar?: string;
  description_az: string;
  description_ru?: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string | string[];
  features?: string | { az?: string[]; ru?: string[]; en?: string[]; ar?: string[] };
  created_at: string;
  updated_at: string;
}

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAdmin();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title_az: '',
    title_ru: '',
    title_en: '',
    title_ar: '',
    description_az: '',
    description_ru: '',
    description_en: '',
    description_ar: '',
    image_url: [] as string[],
    features: {
      az: [] as string[],
      ru: [] as string[],
      en: [] as string[],
      ar: [] as string[],
    },
  });

  const [featureInputs, setFeatureInputs] = useState({
    az: '',
    ru: '',
    en: '',
    ar: '',
  });

  const [loading, setLoading] = useState(false);

  const [carsLoading, setCarsLoading] = useState(true);
  const [availableCars, setAvailableCars] = useState<CarOption[]>([]);
  const [selectedCarIds, setSelectedCarIds] = useState<string[]>([]);
  useEffect(() => {
    let isMounted = true;
    const loadCars = async () => {
      try {
        setCarsLoading(true);
        const cars = await api.cars.getAll();
        if (isMounted) {
          setAvailableCars(Array.isArray(cars) ? cars : []);
        }
      } catch (error) {
        console.error('Error loading cars:', error);
        if (isMounted) {
          setAvailableCars([]);
        }
      } finally {
        if (isMounted) {
          setCarsLoading(false);
        }
      }
    };
    loadCars();
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    if (isEditing && id) {
      loadService(id);
    }
  }, [id, isEditing]);

  const loadService = async (serviceId: string) => {
    try {
      setLoading(true);
      const service = await api.services.getById(serviceId);
      
      // Parse image_url from JSON string or array
      let imageUrls: string[] = [];
      if (service.image_url) {
        if (Array.isArray(service.image_url)) {
          imageUrls = service.image_url;
        } else if (typeof service.image_url === 'string') {
          try {
            const parsed = JSON.parse(service.image_url);
            imageUrls = Array.isArray(parsed) ? parsed : [service.image_url];
          } catch {
            imageUrls = [service.image_url];
          }
        }
      }

      // Parse features from JSON string or object
      let features: { az: string[]; ru: string[]; en: string[]; ar: string[] } = {
        az: [],
        ru: [],
        en: [],
        ar: [],
      };
      if (service.features) {
        if (typeof service.features === 'string') {
          try {
            const parsed = JSON.parse(service.features);
            features = {
              az: parsed.az || [],
              ru: parsed.ru || [],
              en: parsed.en || [],
              ar: parsed.ar || [],
            };
          } catch {
            // If parsing fails, treat as empty
          }
        } else if (typeof service.features === 'object') {
          features = {
            az: service.features.az || [],
            ru: service.features.ru || [],
            en: service.features.en || [],
            ar: service.features.ar || [],
          };
        }
      }

      setFormData({
        title_az: service.title_az || '',
        title_ru: service.title_ru || '',
        title_en: service.title_en || '',
        title_ar: service.title_ar || '',
        description_az: service.description_az || '',
        description_ru: service.description_ru || '',
        description_en: service.description_en || '',
        description_ar: service.description_ar || '',
        image_url: imageUrls,
        features: features,
      });
      setSelectedCarIds(Array.isArray(service.cars) ? service.cars.map(car => car.id) : []);
    } catch (error) {
      console.error('Error loading service:', error);
      toast.error('Xidməti yükləməkdə xəta baş verdi');
      navigate('/admin/services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title_az.trim()) {
      toast.error('Azərbaycan başlığı məcburidir');
      return;
    }
    
    if (!formData.description_az.trim()) {
      toast.error('Azərbaycan təsviri məcburidir');
      return;
    }

    try {
      setLoading(true);
      
      // Convert features object to JSON string
      const featuresJson = JSON.stringify(formData.features);
      
      // Convert image_url array to JSON string
      const imageUrlJson = formData.image_url.length > 0 
        ? JSON.stringify(formData.image_url) 
        : null;

      const submitData = {
        title_az: formData.title_az.trim(),
        title_ru: formData.title_ru?.trim() || null,
        title_en: formData.title_en?.trim() || null,
        title_ar: formData.title_ar?.trim() || null,
        description_az: formData.description_az.trim(),
        description_ru: formData.description_ru?.trim() || null,
        description_en: formData.description_en?.trim() || null,
        description_ar: formData.description_ar?.trim() || null,
        image_url: imageUrlJson,
        features: featuresJson,
        carIds: selectedCarIds,
      };

      if (isEditing && id) {
        await api.services.update(id, submitData);
        toast.success('Xidmət yeniləndi');
      } else {
        await api.services.create(submitData);
        toast.success('Xidmət yaradıldı');
      }

      navigate('/admin/services');
    } catch (error: any) {
      console.error('Error saving service:', error);
      const errorMessage = error?.message || error?.error || 'Xidməti saxlamaqda xəta baş verdi';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCar = (carId: string) => {
    setSelectedCarIds(prev => {
      if (prev.includes(carId)) {
        return prev.filter(id => id !== carId);
      }
      return [...prev, carId];
    });
  };

  const isCarSelected = (carId: string) => selectedCarIds.includes(carId);

  const addFeature = (lang: 'az' | 'ru' | 'en' | 'ar') => {
    const input = featureInputs[lang];
    if (input.trim()) {
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [lang]: [...prev.features[lang], input.trim()],
        },
      }));
      setFeatureInputs(prev => ({
        ...prev,
        [lang]: '',
      }));
    }
  };

  const removeFeature = (lang: 'az' | 'ru' | 'en' | 'ar', index: number) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [lang]: prev.features[lang].filter((_, i) => i !== index),
      },
    }));
  };

  if (loading && isEditing) {
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
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/services')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Xidmət Redaktə Et' : 'Yeni Xidmət Yarat'}</h1>
                <p className="text-muted-foreground">{isEditing ? 'Xidmət məlumatlarını yeniləyin' : 'Yeni xidmət əlavə edin'}</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Başlıq (AZ) *</Label>
                  <Input
                    value={formData.title_az}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_az: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <ImageGalleryUpload
                  value={formData.image_url}
                  onChange={(urls) => setFormData(prev => ({ ...prev, image_url: urls }))}
                  folder="services"
                  label="Xidmət Şəkilləri (maksimum 3, optional)"
                  maxImages={3}
                />
              </div>

              <div>
                <Label>Xidmət üçün avtomobillər</Label>
                <p className="text-sm text-muted-foreground">Bir neçə avtomobil seçə bilərsiniz</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {carsLoading ? (
                    <span className="text-sm text-muted-foreground">Avtomobillər yüklənir...</span>
                  ) : availableCars.length === 0 ? (
                    <span className="text-sm text-muted-foreground">Mövcud avtomobil siyahısı boşdur</span>
                  ) : (
                    availableCars.map(car => {
                      const selected = isCarSelected(car.id);
                      const hasPrice = typeof car.price_per_day === 'number' && !Number.isNaN(car.price_per_day);
                      return (
                        <Button
                          key={car.id}
                          type="button"
                          variant="outline"
                          className={`rounded-full border transition ${selected ? 'bg-gradient-primary text-white border-transparent shadow-lg' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
                          onClick={() => handleToggleCar(car.id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-semibold">{car.brand} {car.model}</span>
                            <span className={selected ? 'text-xs text-white/90' : 'text-xs text-slate-600'}>
                              {car.year ? `${car.year}` : 'İl məlumatı yoxdur'}{hasPrice ? ` • ${car.price_per_day} AZN/gün` : ''}
                            </span>
                          </div>
                        </Button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Başlıq (RU)</Label>
                  <Input
                    value={formData.title_ru}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_ru: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Başlıq (EN)</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Başlıq (AR)</Label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Təsvir (AZ) *</Label>
                <Textarea
                  value={formData.description_az}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_az: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Təsvir (RU)</Label>
                  <Textarea
                    value={formData.description_ru}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_ru: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Təsvir (EN)</Label>
                  <Textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Təsvir (AR)</Label>
                  <Textarea
                    value={formData.description_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>

              {/* Features Section - Multilanguage */}
              <div className="space-y-4">
                <Label>Xüsusiyyətlər</Label>
                
                {/* Azərbaycan */}
                <div className="border rounded-lg p-4">
                  <Label className="text-base font-semibold mb-2 block">Azərbaycan</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={featureInputs.az}
                      onChange={(e) => setFeatureInputs(prev => ({ ...prev, az: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature('az');
                        }
                      }}
                      placeholder="Xüsusiyyət əlavə et və Enter bas"
                    />
                    <Button type="button" onClick={() => addFeature('az')}>
                      Əlavə et
                    </Button>
                  </div>
                  {formData.features.az.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.features.az.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                        >
                          <span className="text-sm">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature('az', index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rus */}
                <div className="border rounded-lg p-4">
                  <Label className="text-base font-semibold mb-2 block">Русский</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={featureInputs.ru}
                      onChange={(e) => setFeatureInputs(prev => ({ ...prev, ru: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature('ru');
                        }
                      }}
                      placeholder="Добавить особенность и нажать Enter"
                    />
                    <Button type="button" onClick={() => addFeature('ru')}>
                      Добавить
                    </Button>
                  </div>
                  {formData.features.ru.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.features.ru.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                        >
                          <span className="text-sm">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature('ru', index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* İngilis */}
                <div className="border rounded-lg p-4">
                  <Label className="text-base font-semibold mb-2 block">English</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={featureInputs.en}
                      onChange={(e) => setFeatureInputs(prev => ({ ...prev, en: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature('en');
                        }
                      }}
                      placeholder="Add feature and press Enter"
                    />
                    <Button type="button" onClick={() => addFeature('en')}>
                      Add
                    </Button>
                  </div>
                  {formData.features.en.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.features.en.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                        >
                          <span className="text-sm">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature('en', index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ərəb */}
                <div className="border rounded-lg p-4">
                  <Label className="text-base font-semibold mb-2 block">العربية</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={featureInputs.ar}
                      onChange={(e) => setFeatureInputs(prev => ({ ...prev, ar: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature('ar');
                        }
                      }}
                      placeholder="أضف ميزة واضغط Enter"
                    />
                    <Button type="button" onClick={() => addFeature('ar')}>
                      إضافة
                    </Button>
                  </div>
                  {formData.features.ar.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.features.ar.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                        >
                          <span className="text-sm">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature('ar', index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/services')}>
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

export default ServiceForm;

