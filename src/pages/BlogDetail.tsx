import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
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
  category: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

type ArticleCategory = 'news' | 'blogs';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  const categoryLabels = useMemo(() => ({
    news: t('blog.categories.news'),
    blogs: t('blog.categories.blogs'),
  }), [t]);

  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);

  const loadPost = async (slug: string) => {
    try {
      setLoading(true);
      const data = await api.blog.getBySlug(slug);
      if (data) {
        setPost(data);
        loadRelatedPosts(data.category, data.slug);
      } else {
        setPost(null);
      }
    } catch (error) {
      console.error('Error loading article:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async (category: string, currentSlug: string) => {
    try {
      const data = await api.blog.getAll({ published: true, category });
      const filtered = (Array.isArray(data) ? data : [])
        .filter((p: BlogPost) => p.slug !== currentSlug)
        .slice(0, 2);
      setRelatedPosts(filtered);
    } catch (error) {
      console.error('Error loading related articles:', error);
      setRelatedPosts([]);
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

  const getPostContent = (post: BlogPost) => {
    switch (language) {
      case 'ru': return post.content_ru || post.content_az;
      case 'en': return post.content_en || post.content_az;
      case 'ar': return post.content_ar || post.content_az;
      default: return post.content_az;
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
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} dəq`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('blog.loading')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('blog.notFound')}</h2>
          <Button onClick={() => navigate('/blog')}>{t('blog.backToList')}</Button>
        </div>
      </div>
    );
  }

  const postTitle = getPostTitle(post);
  const postContent = getPostContent(post);
  const postDate = post.published_at || post.created_at;
  const readTime = calculateReadTime(post.content_az);
  const categoryLabel = categoryLabels[(post.category as ArticleCategory) || 'blogs'] || post.category;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('blog.backToList')}
          </Button>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {categoryLabel}
          </span>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Info */}
          <div className="mb-8">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{postTitle}</h1>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">{post.author || 'Admin'}</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.image_url}
                alt={postTitle}
                className="w-full h-full object-cover"
                style={{ aspectRatio: '16 / 9', minHeight: '400px' }}
              />
            </div>
          )}

          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: postContent }}
              />
            </CardContent>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">{t('blog.relatedTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((related) => {
                  const relatedTitle = getPostTitle(related);
                  const relatedExcerpt = getPostExcerpt(related);
                  const relatedDate = related.published_at || related.created_at;
                  const relatedReadTime = calculateReadTime(related.content_az);

                  return (
                    <Card 
                      key={related.id}
                      className="hover:shadow-elegant transition-all cursor-pointer"
                      onClick={() => navigate(`/blog/${related.slug}`)}
                    >
                      {related.image_url && (
                        <div className="rounded-t-lg overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                          <img
                            src={related.image_url}
                            alt={relatedTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span>{formatDate(relatedDate)}</span>
                          <span>•</span>
                          <span>{relatedReadTime}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{relatedTitle}</h3>
                        {relatedExcerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{relatedExcerpt}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
