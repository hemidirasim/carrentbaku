import { useState, useEffect } from 'react';
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
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (id) {
      loadPost(id);
      loadRelatedPosts();
    }
  }, [id]);

  const loadPost = async (slug: string) => {
    try {
      setLoading(true);
      const data = await api.blog.getBySlug(slug);
      setPost(data);
    } catch (error) {
      console.error('Error loading blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async () => {
    try {
      const data = await api.blog.getAll(true);
      // Exclude current post and get first 2
      const filtered = (data || []).filter((p: BlogPost) => p.slug !== id).slice(0, 2);
      setRelatedPosts(filtered);
    } catch (error) {
      console.error('Error loading related posts:', error);
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
          <p className="mt-2 text-muted-foreground">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Məqalə tapılmadı</h2>
          <Button onClick={() => navigate('/blog')}>Bloqa qayıt</Button>
        </div>
      </div>
    );
  }

  const postTitle = getPostTitle(post);
  const postContent = getPostContent(post);
  const postDate = post.published_at || post.created_at;
  const readTime = calculateReadTime(post.content_az);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Bloqa qayıt
          </Button>
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
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Əlaqəli Məqalələr</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => {
                  const relatedTitle = getPostTitle(relatedPost);
                  const relatedExcerpt = getPostExcerpt(relatedPost);
                  const relatedDate = relatedPost.published_at || relatedPost.created_at;

                  return (
                    <Card
                      key={relatedPost.id}
                      className="cursor-pointer hover:shadow-elegant transition-all"
                      onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                    >
                      {relatedPost.image_url && (
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={relatedPost.image_url}
                            alt={relatedTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="pt-4">
                        <h3 className="font-bold mb-2 line-clamp-2">{relatedTitle}</h3>
                        {relatedExcerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {relatedExcerpt}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">{formatDate(relatedDate)}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
