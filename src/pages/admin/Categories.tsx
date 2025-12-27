import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, Tag, RefreshCw, Pencil, Trash2, Car, Search } from "lucide-react";

import { useAdmin } from "@/contexts/AdminContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, CategoryDto } from "@/lib/api";
import { resolveLocalizedValue } from "@/hooks/useContactInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminCategories = () => {
  const { user: _user } = useAdmin();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.categories.getAll({ includeInactive: true, includeCounts: true });
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Kateqoriyalar yüklənərkən xəta baş verdi");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return categories;
    }
    return categories.filter(category => {
      const localizedName = resolveLocalizedValue(category.name, language).toLowerCase();
      return (
        category.slug.toLowerCase().includes(term) ||
        localizedName.includes(term)
      );
    });
  }, [categories, language, searchTerm]);

  const totals = useMemo(() => {
    const total = categories.length;
    const active = categories.filter(category => category.is_active).length;
    const inactive = total - active;
    const cars = categories.reduce((sum, category) => sum + (category.car_count ?? 0), 0);
    return { total, active, inactive, cars };
  }, [categories]);

  const handleDelete = async (category: CategoryDto) => {
    if (!window.confirm(`\"${resolveLocalizedValue(category.name, language) || category.slug}\" kateqoriyasını silmək istəyirsiniz?`)) {
      return;
    }

    try {
      const response = await api.categories.delete(category.id);
      if (response?.error) {
        if (response?.car_count) {
          const forceDelete = window.confirm(
            `Bu kateqoriya ${response.car_count} avtomobildə istifadə olunur. Buna baxmayaraq silmək istəyirsiniz?`
          );
          if (!forceDelete) {
            return;
          }
          const forced = await api.categories.delete(category.id, { force: true });
          if (forced?.error) {
            toast.error(forced.error);
            return;
          }
        } else {
          toast.error(response.error);
          return;
        }
      }

      toast.success("Kateqoriya silindi");
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Kateqoriyanı silmək mümkün olmadı");
    }
  };

  const getCategoryLabel = (category: CategoryDto) => {
    const label = resolveLocalizedValue(category.name, language);
    if (label && label.trim().length > 0) {
      return label;
    }
    return category.slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dashboard")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Avtomobil Kateqoriyaları</h1>
                <p className="text-muted-foreground">Kateqoriyaları yaradın, yeniləyin və idarə edin</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadCategories} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Yenilə
              </Button>
              <Button onClick={() => navigate("/admin/categories/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni kateqoriya
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ümumi kateqoriyalar</CardTitle>
              <Tag className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.total}</div>
              <p className="text-xs text-muted-foreground">Sistemdə qeydiyyatda olan kateqoriyalar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktiv</CardTitle>
              <Badge variant="outline" className="border-green-500 text-green-600">Aktiv</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.active}</div>
              <p className="text-xs text-muted-foreground">Hazırda istifadəçilərə görünən kateqoriyalar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Passiv</CardTitle>
              <Badge variant="secondary">Passiv</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.inactive}</div>
              <p className="text-xs text-muted-foreground">Müvəqqəti olaraq gizlədilmiş kateqoriyalar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avtomobil sayı</CardTitle>
              <Car className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.cars}</div>
              <p className="text-xs text-muted-foreground">Kateqoriyalara bağlı ümumi avtomobil sayı</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Kateqoriyalarda axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bütün kateqoriyalar</CardTitle>
            <CardDescription>Slug, ad və istifadədə olan avtomobillər</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-3 text-muted-foreground text-sm">Kateqoriyalar yüklənir...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">Heç bir kateqoriya tapılmadı</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="hidden md:table-cell">Sıralama</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Avtomobillər</TableHead>
                    <TableHead className="text-right">Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map(category => {
                    const label = getCategoryLabel(category);
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            <span>{label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{category.slug}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{category.sort_order}</TableCell>
                        <TableCell>
                          {category.is_active ? (
                            <Badge className="bg-green-500">Aktiv</Badge>
                          ) : (
                            <Badge variant="secondary">Passiv</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={category.car_count ? "outline" : "secondary"}>
                            {category.car_count ?? 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(category)}
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminCategories;
