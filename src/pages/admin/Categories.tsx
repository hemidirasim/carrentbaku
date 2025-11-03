import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Tag, 
  Search,
  ArrowLeft,
  Car
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CategoryStats {
  category: string;
  count: number;
}

const AdminCategories = () => {
  const { user } = useAdmin();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, carsData] = await Promise.all([
        api.categories.getAll(),
        api.cars.getAll(),
      ]);
      setCategories(categoriesData || []);
      setCars(carsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStats = (): CategoryStats[] => {
    const stats: Record<string, number> = {};
    cars.forEach(car => {
      stats[car.category] = (stats[car.category] || 0) + 1;
    });
    return Object.entries(stats).map(([category, count]) => ({
      category,
      count,
    })).sort((a, b) => b.count - a.count);
  };

  const categoryLabels: Record<string, string> = {
    'ekonomik': 'Ekonom',
    'medium-sedan': 'Medium Sedan',
    'biznes': 'Biznes',
    'premium': 'Premium',
    'suv': 'SUV',
    'minivan': 'Minivan',
    'luxury': 'Luxury',
    'big-bus': 'Big Bus',
  };

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoryLabels[cat]?.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 className="text-2xl font-bold">Avtomobil Kateqoriyaları</h1>
                <p className="text-muted-foreground">Kateqoriyaları idarə edin</p>
              </div>
            </div>
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
              placeholder="Kateqoriyalarda axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {getCategoryStats().map((stat) => (
            <Card key={stat.category}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {categoryLabels[stat.category] || stat.category}
                </CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
                <p className="text-xs text-muted-foreground">Avtomobil</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Yüklənir...</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Bütün Kateqoriyalar</CardTitle>
              <CardDescription>
                Mövcud avtomobil kateqoriyalarının siyahısı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kateqoriya</TableHead>
                    <TableHead>Avtomobil Sayı</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => {
                    const stats = getCategoryStats().find(s => s.category === category);
                    const count = stats?.count || 0;
                    return (
                      <TableRow key={category}>
                        <TableCell className="font-medium">
                          {categoryLabels[category] || category}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{count} avtomobil</Badge>
                        </TableCell>
                        <TableCell>
                          {count > 0 ? (
                            <Badge className="bg-green-500">Aktiv</Badge>
                          ) : (
                            <Badge variant="secondary">Boş</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {filteredCategories.length === 0 && !loading && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Kateqoriya tapılmadı</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCategories;

