import React, { useState, useEffect } from 'react';
import { useApp, CurrencyType, AreaUnitType, ThemeMode } from '../context/AppContext';
import { 
  Menu, 
  ChevronRight, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Monitor, 
  Globe, 
  UserCheck, 
  ChevronDown,
  Building2,
  Heart,
  SlidersHorizontal,
  ShieldCheck,
  Check
} from 'lucide-react';
import { UserRole } from '../types';

export const AppHeader: React.FC = () => {
  const { 
    currentPath, 
    navigate, 
    currentUser, 
    users, 
    switchUserRole,
    currency, 
    setCurrency, 
    areaUnit, 
    setAreaUnit,
    theme, 
    setTheme,
    setMobileDrawerOpen,
    properties,
    savedPropertyIds,
    comparePropertyIds,
    activeSubscription,
    toggleSubscriptionExpirySimulation
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Close menus on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRoleMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Breadcrumb Trail
  const getBreadcrumbs = () => {
    const clean = currentPath.split('?')[0].replace(/\/+$/, '') || '/';
    
    if (clean === '/') {
      return [{ label: 'Home', path: '/' }];
    }

    const crumbs = [{ label: 'Home', path: '/' }];

    if (clean === '/properties') {
      crumbs.push({ label: 'Properties Catalog', path: '/properties' });
    } else if (clean.startsWith('/properties/')) {
      crumbs.push({ label: 'Properties', path: '/properties' });
      const propId = clean.replace('/properties/', '');
      const prop = properties.find((p) => p.id === propId);
      crumbs.push({ label: prop ? prop.title : 'Property Details', path: clean });
    } else if (clean === '/matchmaker') {
      crumbs.push({ label: 'AI Property Matchmaker', path: '/matchmaker' });
    } else if (clean === '/designer') {
      crumbs.push({ label: 'AI Property Designer', path: '/designer' });
    } else if (clean === '/connect') {
      crumbs.push({ label: 'AI Connect Plans', path: '/connect' });
    } else if (clean === '/dashboard') {
      crumbs.push({ label: 'Buyer Dashboard', path: '/dashboard' });
    } else if (clean === '/saved') {
      crumbs.push({ label: 'Dashboard', path: '/dashboard' });
      crumbs.push({ label: 'Saved Properties', path: '/saved' });
    } else if (clean === '/compare') {
      crumbs.push({ label: 'Properties', path: '/properties' });
      crumbs.push({ label: 'Property Comparison', path: '/compare' });
    } else if (clean === '/messages') {
      crumbs.push({ label: 'Dashboard', path: '/dashboard' });
      crumbs.push({ label: 'Direct Messages', path: '/messages' });
    } else if (clean === '/seller') {
      crumbs.push({ label: 'Seller Portal', path: '/seller' });
    } else if (clean === '/seller/properties') {
      crumbs.push({ label: 'Seller Portal', path: '/seller' });
      crumbs.push({ label: 'My Listings', path: '/seller/properties' });
    } else if (clean === '/seller/properties/new') {
      crumbs.push({ label: 'Seller Portal', path: '/seller' });
      crumbs.push({ label: 'My Listings', path: '/seller/properties' });
      crumbs.push({ label: 'Add New Property', path: '/seller/properties/new' });
    } else if (clean.startsWith('/seller/properties/') && clean.endsWith('/edit')) {
      crumbs.push({ label: 'Seller Portal', path: '/seller' });
      crumbs.push({ label: 'My Listings', path: '/seller/properties' });
      crumbs.push({ label: 'Edit Property', path: clean });
    } else if (clean === '/profile') {
      crumbs.push({ label: 'Account', path: '/profile' });
      crumbs.push({ label: 'User Profile & Preferences', path: '/profile' });
    } else if (clean === '/admin') {
      crumbs.push({ label: 'Administration', path: '/admin' });
      crumbs.push({ label: 'Platform Moderation', path: '/admin' });
    } else if (clean === '/login') {
      crumbs.push({ label: 'Authentication', path: '/login' });
      crumbs.push({ label: 'Sign In', path: '/login' });
    } else if (clean === '/register') {
      crumbs.push({ label: 'Authentication', path: '/register' });
      crumbs.push({ label: 'Create Account', path: '/register' });
    } else if (clean === '/forgot-password') {
      crumbs.push({ label: 'Authentication', path: '/login' });
      crumbs.push({ label: 'Password Recovery', path: '/forgot-password' });
    } else {
      crumbs.push({ label: 'Page', path: clean });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const canGoBack = currentPath !== '/';

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Top Prototype Context Bar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-xs py-1.5 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="text-teal-400 font-semibold tracking-wider text-[11px] uppercase">HCI Usability Build</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 hidden sm:inline">Active Persona:</span>
          <span className="font-semibold text-white capitalize">{currentUser?.name || 'Guest User'} ({currentUser?.role || 'Guest'})</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 hidden md:inline">AI Connect:</span>
          <span className={activeSubscription?.isActive ? "text-emerald-400 font-semibold text-[11px]" : "text-amber-400 font-semibold text-[11px]"}>
            {activeSubscription ? (activeSubscription.isActive ? `Active Pass (${activeSubscription.inquiriesRemaining} left)` : 'Expired Pass') : 'No Pass'}
          </span>
        </div>

        {/* Quick Evaluation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleSubscriptionExpirySimulation}
            className="hidden sm:inline-block text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded cursor-pointer transition-colors"
            title="Simulate toggle between Active and Expired AI Connect pass"
          >
            Toggle Connect Pass
          </button>
        </div>
      </div>

      {/* Main Bar: Hamburger, Breadcrumbs, Currency & Units, Theme, Persona */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile Drawer Trigger & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="sm:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Predictable Back Button (Shneiderman Rule 6) */}
          {canGoBack && (
            <button
              onClick={handleBack}
              title="Navigate back to previous screen"
              aria-label="Back"
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="min-w-0 overflow-hidden">
            <ol className="flex items-center text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap overflow-x-auto scrollbar-none gap-1.5 py-0.5">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={crumb.path + idx} className="flex items-center gap-1.5">
                    {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                    {isLast ? (
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-[300px]" aria-current="page">
                        {crumb.label}
                      </span>
                    ) : (
                      <button
                        onClick={() => navigate(crumb.path)}
                        className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer hover:underline"
                      >
                        {crumb.label}
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Right Tools: Currency, Area Units, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                currency === 'USD' 
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs font-bold' 
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="United States Dollar ($)"
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency('PKR')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                currency === 'PKR' 
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs font-bold' 
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Pakistani Rupee (₨)"
            >
              ₨ PKR
            </button>
          </div>

          {/* Area Unit Toggle (hidden on small screens) */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setAreaUnit('sqft')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                areaUnit === 'sqft' 
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs font-bold' 
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Square Feet"
            >
              sq ft
            </button>
            <button
              onClick={() => setAreaUnit('marla')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                areaUnit === 'marla' 
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs font-bold' 
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Marla (1 Marla ≈ 225 sq ft)"
            >
              Marla
            </button>
          </div>

          {/* Quick Theme Cycle Button */}
          <div className="flex items-center">
            <button
              onClick={() => {
                if (theme === 'light') setTheme('dark');
                else if (theme === 'dark') setTheme('system');
                else setTheme('light');
              }}
              title={`Current Theme: ${theme.toUpperCase()}. Click to cycle (Light -> Dark -> Auto)`}
              aria-label="Cycle theme"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-teal-400" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              )}
            </button>
          </div>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
              aria-expanded={roleMenuOpen}
              aria-label="Switch User Persona"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                alt=""
                className="w-6 h-6 rounded-full object-cover border border-teal-500/50"
              />
              <span className="hidden sm:inline capitalize font-medium">
                {currentUser ? currentUser.role : 'Guest'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 text-xs">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/60 pb-1.5 mb-1.5">
                  Switch HCI Persona
                </div>
                <div className="space-y-1">
                  {users.map((u) => {
                    const isSelected = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUserRole(u.role);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 dark:text-white truncate">{u.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{u.role}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />}
                      </button>
                    );
                  })}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-700/60">
                    <button
                      onClick={() => {
                        switchUserRole('guest');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-xs"
                    >
                      Browse as Guest
                    </button>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-teal-700 dark:text-teal-400 font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/50 cursor-pointer text-xs mt-0.5"
                    >
                      View Profile & Settings →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
