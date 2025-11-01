import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Mock blog posts data - in production, this would come from an API
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
      content: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        <h2>Key Benefits</h2>
        <ul>
          <li>Reliable service since 2016</li>
          <li>Quality vehicles</li>
          <li>Satisfaction guarantee</li>
          <li>24/7 customer support</li>
        </ul>
      `,
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
      content: `
        <p>Traveling on a budget doesn't mean sacrificing comfort or quality. Here are our top tips for budget-conscious adventurers.</p>
        <p>Plan ahead and book early to get the best rates. Consider traveling during off-peak seasons for better prices and fewer crowds.</p>
        <p>Pack smart and avoid unnecessary expenses. Bring reusable items and snacks to save money during your trip.</p>
        <h2>Top Tips</h2>
        <ul>
          <li>Book in advance for better rates</li>
          <li>Travel during off-peak seasons</li>
          <li>Pack efficiently</li>
          <li>Look for package deals</li>
        </ul>
      `,
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
      content: `
        <p>Road trips are one of the best ways to explore new destinations. Here's everything you need to know to make your next road trip unforgettable.</p>
        <p>Planning is key to a successful road trip. Make sure to check your vehicle, plan your route, and pack all essentials.</p>
        <h2>Essential Items</h2>
        <ul>
          <li>First aid kit</li>
          <li>Road maps and GPS</li>
          <li>Emergency kit</li>
          <li>Comfortable clothing</li>
        </ul>
      `,
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
      content: `
        <p>In this comprehensive review, we take a closer look at the latest models and their features.</p>
        <p>Our team of experts has tested various vehicles to help you make the best choice for your needs.</p>
        <h2>Review Criteria</h2>
        <ul>
          <li>Performance and handling</li>
          <li>Comfort and interior</li>
          <li>Fuel efficiency</li>
          <li>Safety features</li>
        </ul>
      `,
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
      content: `
        <p>Discover the latest trends and innovations in the automotive industry.</p>
        <p>From electric vehicles to autonomous driving, the future of transportation is here.</p>
        <h2>Innovation Highlights</h2>
        <ul>
          <li>Electric vehicle technology</li>
          <li>Autonomous driving features</li>
          <li>Sustainable materials</li>
          <li>Smart connectivity</li>
        </ul>
      `,
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
      content: `
        <p>Explore hidden gems and discover new destinations with our guide to the best travel experiences.</p>
        <p>From local attractions to cultural experiences, there's always something new to discover.</p>
        <h2>Discovery Tips</h2>
        <ul>
          <li>Talk to locals for insider tips</li>
          <li>Explore beyond tourist areas</li>
          <li>Try local cuisine</li>
          <li>Immerse in local culture</li>
        </ul>
      `,
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
      content: `
        <p>Stay updated with the latest news and developments in the car rental industry.</p>
        <p>From regulatory changes to market trends, we keep you informed about what matters most.</p>
        <h2>Industry Updates</h2>
        <ul>
          <li>Market trends and analysis</li>
          <li>Regulatory changes</li>
          <li>Technology advancements</li>
          <li>Customer insights</li>
        </ul>
      `,
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
      content: `
        <p>Make the most of your travels with these expert tips and tricks.</p>
        <p>Whether you're a first-time traveler or a seasoned explorer, these tips will help enhance your experience.</p>
        <h2>Travel Tips</h2>
        <ul>
          <li>Research destinations in advance</li>
          <li>Pack light and efficiently</li>
          <li>Keep important documents safe</li>
          <li>Stay connected but disconnect</li>
        </ul>
      `,
    },
  ];

  const post = blogPosts.find(p => p.id === Number(id));

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

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      carUpdates: t('blog.category.carUpdates'),
      rentalAdvice: t('blog.category.rentalAdvice'),
      roadTrips: t('blog.category.roadTrips'),
      carReview: t('blog.category.carReview'),
      discovery: t('blog.category.discovery'),
      industryNews: t('blog.category.industryNews'),
      travelTips: t('blog.category.travelTips'),
    };
    return categoryMap[category] || category;
  };

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
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">{getCategoryLabel(post.category)}</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              style={{ aspectRatio: '16 / 9', minHeight: '400px' }}
            />
          </div>

          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Related Posts */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Əlaqəli Məqalələr</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map((relatedPost) => (
                <Card
                  key={relatedPost.id}
                  className="cursor-pointer hover:shadow-elegant transition-all"
                  onClick={() => navigate(`/blog/${relatedPost.id}`)}
                >
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-sm text-muted-foreground">{relatedPost.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;

