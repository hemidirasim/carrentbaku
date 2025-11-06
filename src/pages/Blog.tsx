import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

interface BlogPost {
  id: string;
  title_az: string;
  title_ru?: string;
  title_en?: string;
  title_ar?: string;
  slug: string;
  content_az: string;
  content_ru?: string;
  content_en?: string;
  content_ar?: string;
  excerpt_az?: string;
  excerpt_ru?: string;
  excerpt_en?: string;
  excerpt_ar?: string;
  image_url?: string;
  author?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const Blog = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      // Fetch only published posts
      const data = await api.blog.getAll(true);
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPostTitle = (post: BlogPost) => {
    switch (language) {
      case 'ru': return post.title_ru || post.title_az;
      case 'en': return post.title_en || post.title_az;
      case 'ar': return post.title_ar || post.title_az;
      default: return post.title_az;
    }
  };

  const getPostExcerpt = (post: BlogPost) => {
    switch (language) {
      case 'ru': return post.excerpt_ru || post.excerpt_az || '';
      case 'en': return post.excerpt_en || post.excerpt_az || '';
      case 'ar': return post.excerpt_ar || post.excerpt_az || '';
      default: return post.excerpt_az || '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} dəq`;
  };

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Yüklənir...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Hələ məqalə yoxdur</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => {
                  const postTitle = getPostTitle(post);
                  const postExcerpt = getPostExcerpt(post);
                  const postDate = post.published_at || post.created_at;
                  const readTime = calculateReadTime(post.content_az);

                  return (
                    <Card 
                      key={post.id}
                      className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-white cursor-pointer"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <div 
                          className="w-full overflow-hidden rounded-t-lg"
                          style={{ aspectRatio: '2.5 / 1', minHeight: '200px' }}
                        >
                          {post.image_url ? (
                            <img
                              src={post.image_url}
                              alt={postTitle}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground">Şəkil yoxdur</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <CardContent className="pt-6 pb-4">
                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(postDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{readTime}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
                          {postTitle}
                        </h3>

                        {/* Excerpt */}
                        {postExcerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {postExcerpt}
                          </p>
                        )}
                      </CardContent>

                      <CardFooter className="pt-0 pb-6 flex items-center justify-start">
                        {/* Keep Reading Button */}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-sm hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/blog/${post.slug}`);
                          }}
                        >
                          {t('blog.keepReading')}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
