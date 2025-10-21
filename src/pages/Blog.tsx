import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Blog = () => {
  const { t } = useLanguage();

  const blogPosts = [
    {
      id: 1,
      title: 'Bakıda Avtomobil Kirayəsi üçün Ən Yaxşı Məsləhətlər',
      excerpt: 'Bakıda avtomobil kirayələyərkən nəyə diqqət etməlisiniz? Faydalı məsləhətlərimizi oxuyun.',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000',
      date: '15 Mart 2024',
      category: 'Məsləhətlər',
    },
    {
      id: 2,
      title: 'Premium Avtomobillərin Üstünlükləri',
      excerpt: 'Premium səqəfli avtomobillərin sizə təqdim etdiyi rahatlıq və xüsusiyyətlər haqqında.',
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?q=80&w=1000',
      date: '10 Mart 2024',
      category: 'Premium',
    },
    {
      id: 3,
      title: 'Hava Limanı Transfer Xidmətləri',
      excerpt: 'Bakı Hava Limanından şəhərə rahat və sürətli transferin sirlərini öyrənin.',
      image: 'https://images.unsplash.com/photo-1436262513933-a0b06755c784?q=80&w=1000',
      date: '5 Mart 2024',
      category: 'Xidmətlər',
    },
    {
      id: 4,
      title: 'Uzunmüddətli Kirayə Endirimlərindən Yararlanın',
      excerpt: 'Uzunmüddətli avtomobil kirayəsi ilə qənaət edin və əlavə üstünlüklər əldə edin.',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
      date: '1 Mart 2024',
      category: 'Endirimlər',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-white/90 text-center text-lg">
            {t('blog.subtitle')}
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card 
                key={post.id}
                className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    {post.category}
                  </Badge>
                </div>

                <CardContent className="pt-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {post.date}
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>

                <CardFooter>
                  <Button variant="ghost" className="w-full group/btn">
                    {t('blog.readMore')}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
