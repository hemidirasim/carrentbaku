import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Globe, ChevronDown, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import ReservationDialog from '@/components/ReservationDialog';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const languages: Array<{ code: 'az' | 'ru' | 'en' | 'ar'; label: string }> = [
    { code: 'az', label: 'AZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
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

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Car className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary hidden lg:block">
              CARRENTBAKU.AZ
            </span>
          </Link>

          {/* Desktop Navigation (visible on xl and up) */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => (
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
            ))}
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
              onClick={() => setIsReservationOpen(true)}
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
            {navItems.map((item) => (
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
            ))}
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
                  setIsReservationOpen(true);
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
