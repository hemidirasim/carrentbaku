import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2, Wand2 } from "lucide-react";

import { useAdmin } from "@/contexts/AdminContext";
import { api, CategoryDto, CategoryNameMap } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const LANGUAGE_OPTIONS: Array<{ code: keyof CategoryNameMap; label: string }> = [
  { code: "az", label: "AZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

const createEmptyNameMap = (): CategoryNameMap => ({
  az: "",
  ru: "",
  en: "",
  ar: "",
});

interface EditableCategory {
  slug: string;
  name: CategoryNameMap;
  sort_order: number;
  is_active: boolean;
}

const defaultForm: EditableCategory = {
  slug: "",
  name: createEmptyNameMap(),
  sort_order: 0,
  is_active: true,
};

const CategoryForm = () => {
  const params = useParams<{ id?: string }>();
  const categoryId = params.id;
  const isEditing = Boolean(categoryId);

  const navigate = useNavigate();
  const { user: _user } = useAdmin();

  const [formData, setFormData] = useState<EditableCategory>({ ...defaultForm });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [usageCount, setUsageCount] = useState<number | null>(null);

  useEffect(() => {
    if (isEditing && categoryId) {
      loadCategory(categoryId);
    }
  }, [isEditing, categoryId]);

  const loadCategory = async (id: string) => {
    try {
      setFetching(true);
      const data: CategoryDto = await api.categories.getById(id, { includeCounts: true });
      if (!data) {
        toast.error("Kateqoriya tapılmadı");
        navigate("/admin/categories");
        return;
      }
      setFormData({
        slug: data.slug,
        name: {
          az: data.name.az ?? "",
          ru: data.name.ru ?? "",
          en: data.name.en ?? "",
          ar: data.name.ar ?? "",
        },
        sort_order: data.sort_order ?? 0,
        is_active: data.is_active,
      });
      setUsageCount(typeof data.car_count === "number" ? data.car_count : null);
    } catch (error) {
      console.error("Error loading category:", error);
      toast.error("Kateqoriya məlumatı yüklənmədi");
      navigate("/admin/categories");
    } finally {
      setFetching(false);
    }
  };

  const handleNameChange = (code: keyof CategoryNameMap, value: string) => {
    setFormData(prev => ({
      ...prev,
      name: {
        ...prev.name,
        [code]: value,
      },
    }));
  };

  const handleSlugChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      slug: value,
    }));
  };

  const handleSortOrderChange = (value: string) => {
    const parsed = Number.parseInt(value, 10);
    setFormData(prev => ({
      ...prev,
      sort_order: Number.isFinite(parsed) ? parsed : 0,
    }));
  };

  const primaryName = useMemo(() => {
    return (
      formData.name.az?.trim() ||
      formData.name.en?.trim() ||
      formData.name.ru?.trim() ||
      formData.name.ar?.trim() ||
      ""
    );
  }, [formData.name]);

  const handleGenerateSlug = () => {
    if (!primaryName) {
      toast.error("Slug yaratmaq üçün ən azı bir ad daxil edin");
      return;
    }
    setFormData(prev => ({
      ...prev,
      slug: slugify(primaryName),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nameValues = Object.values(formData.name).map(value => value?.trim()).filter(Boolean);
    if (nameValues.length === 0) {
      toast.error("Ən azı bir dildə kateqoriya adı daxil edin");
      return;
    }

    let slug = formData.slug.trim();
    if (!slug) {
      slug = primaryName ? slugify(primaryName) : "";
    }

    if (!slug) {
      toast.error("Slug dəyəri məcburidir");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        slug,
        name: formData.name,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
      };

      let response;
      if (isEditing && categoryId) {
        response = await api.categories.update(categoryId, payload);
      } else {
        response = await api.categories.create(payload);
      }

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      toast.success(isEditing ? "Kateqoriya yeniləndi" : "Kateqoriya yaradıldı");

      if (response?.car_count !== undefined) {
        setUsageCount(response.car_count);
      }

      navigate("/admin/categories");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Kateqoriyanı saxlamaq mümkün olmadı");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !categoryId) {
      return;
    }

    const confirmMessage = usageCount && usageCount > 0
      ? `Bu kateqoriya ${usageCount} avtomobildə istifadə olunur. Silmək istədiyinizə əminsiniz?`
      : "Kateqoriyanı silmək istəyirsiniz?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.categories.delete(categoryId, { force: true });
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Kateqoriya silindi");
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Kateqoriyanı silmək mümkün olmadı");
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
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin/categories")}> 
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Kateqoriya {isEditing ? "Redaktəsi" : "Yaradılması"}</h1>
                <p className="text-muted-foreground">
                  {isEditing ? "Mövcud kateqoriyanın məlumatlarını yeniləyin" : "Yeni avtomobil kateqoriyası əlavə edin"}
                </p>
              </div>
            </div>
            {isEditing && (
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
                <Trash2 className="w-4 h-4 mr-2" />
                Sil
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Kateqoriya məlumatları</CardTitle>
            <CardDescription>
              Çoxdilli adlar və slug dəyəri daxil edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fetching ? (
              <div className="py-12 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-3 text-muted-foreground text-sm">Məlumat yüklənir...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="məsələn: econom"
                        disabled={loading}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={handleGenerateSlug} disabled={loading || !primaryName}>
                        <Wand2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">URL-də istifadə olunacaq unikal identifikator</p>
                  </div>

                  <div className="space-y-3">
                    <Label>Kateqoriya adları</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {LANGUAGE_OPTIONS.map(({ code, label }) => (
                        <div key={code}>
                          <Label htmlFor={`name-${code}`} className="text-xs text-muted-foreground">
                            {label}
                          </Label>
                          <Input
                            id={`name-${code}`}
                            value={formData.name[code] ?? ""}
                            onChange={(e) => handleNameChange(code, e.target.value)}
                            placeholder={`${label} kateqoriya adı`}
                            disabled={loading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sort-order">Sıralama</Label>
                      <Input
                        id="sort-order"
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => handleSortOrderChange(e.target.value)}
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Menü və filtrlərdə görünmə ardıcıllığı</p>
                    </div>
                    <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                      <div>
                        <Label className="text-sm font-medium">Aktivlik</Label>
                        <p className="text-xs text-muted-foreground">Aktiv kateqoriyalar istifadəçilərə göstərilir</p>
                      </div>
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({
                            ...prev,
                            is_active: checked,
                          }))
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {isEditing && usageCount !== null && (
                    <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                      Bu kateqoriya hazırda <span className="font-semibold text-foreground">{usageCount}</span> avtomobildə istifadə olunur.
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/categories')} disabled={loading}>
                    Ləğv et
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Yüklənir...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? 'Yenilə' : 'Yarat'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CategoryForm;
