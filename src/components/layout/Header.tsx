import { useEffect, useMemo, useState } from 'react';
import type { SVGProps } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Globe, ChevronDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/contexts/LanguageContext';
import { api, CategoryDto } from '@/lib/api';
import { useContactInfo, resolveLocalizedValue } from '@/hooks/useContactInfo';
import { useLocalizedPath, stripLanguageFromPath } from '@/hooks/useLocalizedPath';

const buildTelHref = (value?: string) => {
  if (!value) {
    return '#';
  }
  const digits = value.replace(/[^+\d]/g, '');
  if (!digits) {
    return '#';
  }
  return digits.startsWith('+') ? `tel:${digits}` : `tel:+${digits}`;
};

const buildWhatsAppLink = (number?: string, fallback?: string) => {
  if (fallback && fallback.startsWith('http')) {
    return fallback;
  }
  if (!number) {
    return undefined;
  }
  const digits = number.replace(/[^\d+]/g, '');
  if (!digits) {
    return undefined;
  }
  const normalized = digits.startsWith('+') ? digits.replace(/\+/g, '') : digits;
  return `https://wa.me/${normalized}`;
};

const WhatsAppGlyph = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    stroke="currentColor"
    {...props}
  >
    <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z" />
  </svg>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCarsMenuOpen, setIsCarsMenuOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: contactInfo } = useContactInfo();
  const localizePath = useLocalizedPath();
  const normalizedPath = stripLanguageFromPath(location.pathname);
  const homeHref = localizePath('/');

  const primaryPhoneDisplay = contactInfo?.phones?.[0] ?? '+994 (50) 123 45 67';
  const primaryPhoneHref = buildTelHref(contactInfo?.phones?.[0]);

  const phoneHref = primaryPhoneHref === '#' ? undefined : primaryPhoneHref;
  const whatsappHref = buildWhatsAppLink(contactInfo?.whatsapp_numbers?.[0], contactInfo?.social_links?.whatsapp);
  const hasContactOptions = Boolean(whatsappHref || phoneHref);

  const languages: Array<{ code: Language; label: string }> = [
    { code: 'az', label: 'AZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  const changeLanguage = (code: Language) => {
    if (code === language) {
      setLanguage(code);
      return;
    }
    setLanguage(code);
    const suffix = normalizedPath === '/' ? '' : normalizedPath;
    navigate(`/${code}${suffix}${location.search}${location.hash}`, { replace: false });
  };

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await api.categories.getAll({ includeInactive: false, includeCounts: true });
        if (isMounted) {
          setCategories(Array.isArray(data) ? (data as CategoryDto[]) : []);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        if (isMounted) {
          setCategories([]);
        }
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategories = useMemo(() => {
    return categories
      .filter(category => category?.is_active)
      .sort((a, b) => {
        if ((a?.sort_order ?? 0) !== (b?.sort_order ?? 0)) {
          return (a?.sort_order ?? 0) - (b?.sort_order ?? 0);
        }
        const labelA = resolveLocalizedValue(a.name, language);
        const labelB = resolveLocalizedValue(b.name, language);
        return labelA.localeCompare(labelB);
      });
  }, [categories, language]);

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

  const allLabel = t('cars.filter.all');

  const carCategories = useMemo(() => {
    const baseLabel = allLabel !== 'cars.filter.all' ? allLabel : t('cars.filter.all');
    return [
      { id: 'all', label: baseLabel },
      ...activeCategories.map(category => ({
        id: category.slug,
        label: getCategoryLabel(category),
      })),
    ];
  }, [activeCategories, allLabel]);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/cars', label: t('nav.cars') },
    { path: '/services', label: t('nav.services') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isNavActive = (path: string) => {
    if (path === '/blog') {
      return normalizedPath === '/blog' || normalizedPath.startsWith('/blog/');
    }
    return normalizedPath === (path === '/' ? '/' : path);
  };

  const handleCategorySelect = (categoryId: string) => {
    const url = categoryId === 'all' ? '/cars' : `/cars?category=${categoryId}`;
    navigate(localizePath(url));
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-auto py-2.5 items-center justify-between">
          {/* Logo */}
          <a 
            href={homeHref}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = homeHref;
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
                          isNavActive(item.path) || normalizedPath.startsWith('/cars')
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
                            (category.id === 'all' && normalizedPath === '/cars' && !location.search)
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
                  to={localizePath(item.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isNavActive(item.path)
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
            {hasContactOptions && (
              <Sheet open={isMobileContactOpen} onOpenChange={setIsMobileContactOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label={t('cta.floating.buttonLabel')}
                    className="xl:hidden flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm"
                  >
                    <WhatsAppGlyph className="h-4 w-4 text-[#2d7e16]" />
                    <span className="truncate max-w-[140px]">{primaryPhoneDisplay}</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="sm:max-w-md sm:mx-auto">
                  <SheetHeader className="mb-4 text-left">
                    <SheetTitle className="text-lg font-semibold">{t('cta.floating.title')}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{t('cta.floating.subtitle')}</p>
                  </SheetHeader>
                  <div className="space-y-3">
                    {whatsappHref && (
                      <Button
                        variant="outline"
                        asChild
                        className="w-full justify-start gap-3 border-border py-4"
                      >
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-white">
                              <WhatsAppGlyph className="h-5 w-5" />
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">{t('cta.floating.whatsapp')}</span>
                              {contactInfo?.whatsapp_numbers?.[0] && (
                                <span className="text-xs text-muted-foreground">{contactInfo.whatsapp_numbers[0]}</span>
                              )}
                            </div>
                          </div>
                        </a>
                      </Button>
                    )}
                    {phoneHref && (
                      <Button
                        variant="outline"
                        asChild
                        className="w-full justify-start gap-3 border-border py-4"
                      >
                        <a href={phoneHref}>
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                              <Phone className="h-5 w-5" />
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">{t('cta.floating.phone')}</span>
                              <span className="text-xs text-muted-foreground">{primaryPhoneDisplay}</span>
                            </div>
                          </div>
                        </a>
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {/* Mobile Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="xl:hidden flex items-center gap-1 px-3 py-2"
                  aria-label="Dil seçimi"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-semibold">{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={language === lang.code ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
                    onClick={() => changeLanguage(lang.code)}
                    className={language === lang.code ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Terms Link */}
            <Link
              to={localizePath('/terms')}
              className="hidden xl:flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-secondary hover:bg-secondary/80"
            >
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-semibold">{t('footer.terms')}</span>
            </Link>

            {/* Reserve Button */}
            <Button 
              onClick={() => navigate(localizePath('/cars'))}
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
                        isNavActive(item.path) || normalizedPath.startsWith('/cars')
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
                              (category.id === 'all' && normalizedPath === '/cars' && !location.search)
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
                  to={localizePath(item.path)}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isNavActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to={localizePath('/terms')}
              onClick={() => setIsMenuOpen(false)}
              className="mx-4 flex items-center gap-2 px-4 py-3 rounded-md border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <FileText className="w-4 h-4 text-primary" />
              {t('footer.terms')}
            </Link>

            {/* Language quick switch in mobile */}
            <div className="px-4 py-2">
              <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
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
                  navigate('/reserve');
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

    </header>
  );
};

export default Header;
