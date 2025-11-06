import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageGalleryUpload } from '@/components/ui/image-gallery-upload';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

const AdminServices = () => {
  const { user } = useAdmin();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

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

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await api.services.getAll();
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Xidmətləri yükləməkdə xəta baş verdi');
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
      };

      if (editingService) {
        await api.services.update(editingService.id, submitData);
        toast.success('Xidmət yeniləndi');
      } else {
        await api.services.create(submitData);
        toast.success('Xidmət yaradıldı');
      }

      setIsAddDialogOpen(false);
      setEditingService(null);
      setFormData({
        title_az: '',
        title_ru: '',
        title_en: '',
        title_ar: '',
        description_az: '',
        description_ru: '',
        description_en: '',
        description_ar: '',
        image_url: [],
        features: {
          az: [],
          ru: [],
          en: [],
          ar: [],
        },
      });
      setFeatureInputs({
        az: '',
        ru: '',
        en: '',
        ar: '',
      });
      loadServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      const errorMessage = error?.message || error?.error || 'Xidməti saxlamaqda xəta baş verdi';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    
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
    setFeatureInputs({
      az: '',
      ru: '',
      en: '',
      ar: '',
    });
    setIsAddDialogOpen(true);
  };

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

  const handleDelete = async (id: string) => {
    if (!confirm('Bu xidməti silmək istədiyinizə əminsiniz?')) return;

    try {
      await api.services.delete(id);
      toast.success('Xidmət silindi');
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Xidməti silməkdə xəta baş verdi');
    }
  };

  const filteredServices = services.filter(service =>
    service.title_az.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-2xl font-bold">Xidmətlər İdarəetməsi</h1>
                <p className="text-muted-foreground">Xidmətləri idarə edin</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingService(null);
                setFormData({
                  title_az: '',
                  title_ru: '',
                  title_en: '',
                  title_ar: '',
                  description_az: '',
                  description_ru: '',
                  description_en: '',
                  description_ar: '',
                  image_url: [],
                  features: {
                    az: [],
                    ru: [],
                    en: [],
                    ar: [],
                  },
                });
                setFeatureInputs({
                  az: '',
                  ru: '',
                  en: '',
                  ar: '',
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Xidmət
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingService ? 'Xidmət Redaktə Et' : 'Yeni Xidmət Yarat'}</DialogTitle>
                  <DialogDescription>
                    Xidmətin məlumatlarını doldurun
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Ləğv et
                    </Button>
                    <Button type="submit">
                      {editingService ? 'Yenilə' : 'Yarat'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Xidmətlərdə axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Yüklənir...</p>
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Şəkil</TableHead>
                  <TableHead>Başlıq</TableHead>
                  <TableHead>Tarix</TableHead>
                  <TableHead className="text-right">Əməliyyatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      {(() => {
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
                        return imageUrls.length > 0 ? (
                          <img 
                            src={imageUrls[0]} 
                            alt={service.title_az}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">Şəkil yoxdur</span>
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="font-medium">{service.title_az}</TableCell>
                    <TableCell>
                      {new Date(service.created_at).toLocaleDateString('az-AZ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {filteredServices.length === 0 && !loading && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Hələ xidmət yoxdur</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminServices;

