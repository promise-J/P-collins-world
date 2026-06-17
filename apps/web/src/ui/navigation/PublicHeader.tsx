import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Target, Building2, ChevronDown } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';

export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { 
      label: 'Marketplace', 
      href: '/products',
      icon: ShoppingBag,
      description: 'Shop quality products'
    },
    { 
      label: 'Savings', 
      href: '/savings',
      icon: Target,
      description: 'Save towards goals'
    },
    { 
      label: 'Real Estate', 
      href: '/properties',
      icon: Building2,
      description: 'Find your dream property'
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] bg-clip-text text-transparent">
              P Collins
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group relative flex items-center gap-2 text-gray-600 hover:text-[var(--color-brand-primary)] transition-colors duration-200"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-brand-primary)] transition-all group-hover:w-full" />
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="primary">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <img
                    src={user?.avatar || '/avatar.png'}
                    alt={user?.firstName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t border-gray-100"
            >
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Icon size={20} className="text-[var(--color-brand-primary)]" />
                      <div>
                        <p className="font-medium text-gray-700">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </Link>
                  );
                })}
                
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {!isAuthenticated ? (
                     <>
                     <Link to="/role-selection?mode=login">
                       <Button variant="ghost" size="sm">
                         Sign In
                       </Button>
                     </Link>
                     <Link to="/role-selection?mode=register">
                       <Button variant="primary" size="sm">
                         Get Started
                       </Button>
                     </Link>
                   </>
                  ) : (
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full">
                        Go to Dashboard
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}