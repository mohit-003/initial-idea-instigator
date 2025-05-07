
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Home, BarChart3, Settings, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { name: 'Instructions', path: '/instructions', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-12',
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 hover-lift" 
          onClick={closeMobileMenu}
        >
          <img src="/src/assets/logo.svg" alt="Harvest Steps" className="w-8 h-8" />
          <span className="font-semibold text-lg tracking-tight">Harvest Steps</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'button-transition flex items-center text-sm font-medium py-2 px-3 rounded-md',
                location.pathname === link.path
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-border mx-2"></div>
          
          <Link to="/login">
            <Button variant="outline" size="sm" className="button-transition hover-lift">
              Sign In
            </Button>
          </Link>
          
          <Link to="/login?signup=true">
            <Button size="sm" className="button-transition hover-lift">
              Sign Up
            </Button>
          </Link>
        </div>
        
        <button
          className="md:hidden button-transition p-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-muted"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 bg-white z-40 pt-20 px-6 transform transition-transform duration-300 ease-in-out md:hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'button-transition flex items-center text-base font-medium py-3 px-4 rounded-md',
                location.pathname === link.path
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              )}
              onClick={closeMobileMenu}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          
          <div className="h-px w-full bg-border my-2"></div>
          
          <Link 
            to="/login" 
            className="w-full"
            onClick={closeMobileMenu}
          >
            <Button variant="outline" className="w-full button-transition">
              Sign In
            </Button>
          </Link>
          
          <Link 
            to="/login?signup=true" 
            className="w-full"
            onClick={closeMobileMenu}
          >
            <Button className="w-full button-transition">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
