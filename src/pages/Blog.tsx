import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Blog = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const blogPosts = [
    {
      id: 1,
      title: 'The Continued Growth of Delivery and Ride share-2024',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000',
      date: '18 Sep 2024',
      readTime: '6 mins',
      comments: 38,
      category: 'carUpdates',
      author: {
        name: t('blog.author'),
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      },
    },
    {
      id: 2,
      title: 'Top 10 Travel Hacks for Budget-Conscious Adventurers',
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?q=80&w=1000',
      date: '18 Sep 2024',
      readTime: '6 mins',
      comments: 38,
      category: 'rentalAdvice',
      author: {
        name: t('blog.author'),
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      },
    },
    {
      id: 3,
      title: 'Top 10 Travel Hacks for Budget-Conscious Adventurers',
      image: 'https://images.unsplash.com/photo-1436262513933-a0b06755c784?q=80&w=1000',
      date: '18 Sep 2024',
      readTime: '6 mins',
      comments: 38,
      category: 'roadTrips',
      author: {
        name: t('blog.author'),
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      },
    },
    {
      id: 4,
      title: 'Top 10 Travel Hacks for Budget-Conscious Adventurers',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
      date: '18 Sep 2024',
      readTime: '6 mins',
      comments: 38,
      category: 'carReview',
      author: {
        name: t('blog.author'),
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
      },
    },
    {
      id: 5,
      title: 'Top 10 Travel Hacks for Budget-Conscious Adventurers',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000',
      date: '18 Sep 2024',
      readTime: '6 mins',
      comments: 38,
      category: 'carReview',
      author: {
        name: t('blog.author'),
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      },
    },
    {
      id: 6,
      title: 'The Continued Growth of Delivery and Ride share-2024',
      image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=1000',
      date: '18 Sep 2024',
      readTime: '6 mins',
      comments: 38,
      category: 'discovery',
      author: {
        name: t('blog.author'),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      },
    },
    {
      id: 7,
      title: 'The Continued Growth of Delivery and Ride share-2024',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000',
      date: '18 Sep 2024',
      readTime: '6 mins',
      comments: 38,
      category: 'industryNews',
      author: {
        name: t('blog.author'),
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      },
    },
    {
      id: 8,
      title: 'Top 10 Travel Hacks for Budget-Conscious Adventurers',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000',
      date: '18 Sep 2024',
      readTime: '6 mins',
      comments: 38,
      category: 'travelTips',
      author: {
        name: t('blog.author'),
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      },
    },
  ];

  const totalPages = Math.ceil(blogPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = blogPosts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            {t('blog.mainTitle')}
          </h1>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <Card 
                key={post.id}
                className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-white"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <div 
                    className="w-full overflow-hidden rounded-t-lg"
                    style={{ aspectRatio: '2.5 / 1', minHeight: '200px' }}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                <CardContent className="pt-6 pb-4">
                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 min-h-[3.5rem]">
                    {post.title}
                  </h3>
                </CardContent>

                <CardFooter className="pt-0 pb-6 flex items-center justify-between">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{post.author.name}</span>
                  </div>

                  {/* Keep Reading Button */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-sm hover:bg-gray-100"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    {t('blog.keepReading')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1) ||
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg ${currentPage === page ? 'bg-primary text-white' : ''}`}
                    >
                      {page}
                    </Button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
