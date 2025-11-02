import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Globe, ChevronDown, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import ReservationDialog from '@/components/ReservationDialog';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isCarsMenuOpen, setIsCarsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const languages: Array<{ code: 'az' | 'ru' | 'en' | 'ar'; label: string }> = [
    { code: 'az', label: 'AZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  const carCategories = [
    { id: 'all', label: 'Hamısı' },
    { id: 'ekonomik', label: 'Ekonom' },
    { id: 'medium-sedan', label: 'Medium Sedan' },
    { id: 'biznes', label: 'Biznes' },
    { id: 'premium', label: 'Premium' },
    { id: 'suv', label: 'SUV' },
    { id: 'minivan', label: 'Minivan' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'big-bus', label: 'Big Bus' },
  ];

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/cars', label: t('nav.cars') },
    { path: '/services', label: t('nav.services') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleCategorySelect = (categoryId: string) => {
    const url = categoryId === 'all' ? '/cars' : `/cars?category=${categoryId}`;
    navigate(url);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-auto py-2.5 items-center justify-between">
          {/* Logo */}
          <a 
            href="/" 
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <img 
              src="https://urgm6grvtgvrhleh.public.blob.vercel-storage.com/Screenshot_2025-10-30_at_13.06.09-removebg-preview-nghUWyHPbnpxsh3CjJa0aJwEI0phc5.png"
              alt="Logo"
              className="h-24 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation (visible on xl and up) */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.path === '/cars') {
                return (
                  <DropdownMenu key={item.path}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                          isActive(item.path) || location.pathname.startsWith('/cars')
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        {item.label}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-background min-w-[200px]">
                      {carCategories.map((category) => (
                        <DropdownMenuItem
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={location.search.includes(`category=${category.id}`) || 
                            (category.id === 'all' && location.pathname === '/cars' && !location.search)
                              ? 'bg-primary text-primary-foreground' : ''}
                        >
                          {category.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Language Selector - Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden xl:flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{language.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Phone */}
            <a
              href="tel:+994501234567"
              className="hidden xl:flex items-center space-x-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span className="font-semibold">+994 (50) 123 45 67</span>
            </a>

            {/* Reserve Button */}
            <Button 
              onClick={() => navigate('/cars')}
              className="hidden xl:flex bg-gradient-primary shadow-glow hover:shadow-elegant transition-all"
            >
              {t('nav.reserve')}
            </Button>

            {/* Mobile Menu Toggle (visible below xl) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (shown below xl) */}
        {isMenuOpen && (
          <div className="xl:hidden py-4 space-y-2 border-t border-border">
            {navItems.map((item) => {
              if (item.path === '/cars') {
                return (
                  <div key={item.path} className="space-y-1">
                    <button
                      onClick={() => setIsCarsMenuOpen(!isCarsMenuOpen)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.path) || location.pathname.startsWith('/cars')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isCarsMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isCarsMenuOpen && (
                      <div className="pl-4 space-y-1">
                        {carCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category.id)}
                            className={`block w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                              location.search.includes(`category=${category.id}`) || 
                              (category.id === 'all' && location.pathname === '/cars' && !location.search)
                                ? 'bg-primary/20 text-primary font-medium'
                                : 'hover:bg-secondary text-muted-foreground'
                            }`}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {/* Language quick switch in mobile */}
            <div className="px-4 py-2">
              <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                      language === lang.code
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-background'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 pt-2">
              <Button 
                onClick={() => {
                  navigate('/cars');
                  setIsMenuOpen(false);
                }}
                className="w-full bg-gradient-primary"
              >
                {t('nav.reserve')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <ReservationDialog 
        open={isReservationOpen} 
        onOpenChange={setIsReservationOpen}
      />
    </header>
  );
};

export default Header;
