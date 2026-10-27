import React, { useEffect } from 'react';
import { useApp, ThemeMode } from '../context/AppContext';
import { 
  Building2, 
  Home, 
  Search, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  LayoutDashboard, 
  Heart, 
  SlidersHorizontal, 
  MessageSquare, 
  ListFilter, 
  PlusCircle, 
  ShieldAlert, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Monitor, 
  X,
  User as UserIcon,
  CheckCircle2,
  Lock,
  Umbrella,
  Telescope,
  Scale,
  Repeat,
  Briefcase
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentPath, 
    navigate, 
    currentUser, 
    switchUserRole,
    savedPropertyIds, 
    comparePropertyIds, 
    activeSubscription,
    theme,
    setTheme,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    mobileDrawerOpen,
    setMobileDrawerOpen
  } = useApp();

  // Escape key closes mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen, setMobileDrawerOpen]);

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (mobileDrawerOpen) {
      setMobileDrawerOpen(false);
    }
  };

  interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    badge?: string;
    // Bad HCI demo: intentionally inconsistent icon sizes across navigation.
    sizeClass?: string;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  const navigationGroups: NavGroup[] = [
    {
      group: 'EXPLORE & SERVICES',
      items: [
        { label: 'Home', path: '/', icon: Home, sizeClass: 'w-6 h-6' },
        { label: 'Properties', path: '/properties', icon: Search },
        // Bad HCI demo: an unrelated telescope glyph, oversized, for the matchmaker.
        { label: 'AI Matchmaker', path: '/matchmaker', icon: Telescope, sizeClass: 'w-6 h-6' },
        { label: 'AI Designer', path: '/designer', icon: Sparkles, sizeClass: 'w-3 h-3' },
        { label: 'AI Connect Plans', path: '/connect', icon: ShieldCheck, badge: activeSubscription?.isActive ? 'Active' : undefined },
      ]
    },
    {
      group: 'BUYER SERVICES',
      items: [
        // Bad HCI demo: a briefcase for the buyer dashboard, mismatched size.
        { label: 'Buyer Dashboard', path: '/dashboard', icon: Briefcase, sizeClass: 'w-5 h-5' },
        { 
          // Bad HCI demo: an umbrella stands in for saved favourites.
          label: 'Saved Properties', 
          path: '/saved', 
          icon: Umbrella, 
          sizeClass: 'w-3 h-3',
          count: savedPropertyIds.length 
        },
        { 
          // Bad HCI demo: a balance-scale glyph for compare, larger than neighbours.
          label: 'Compare', 
          path: '/compare', 
          icon: Scale, 
          sizeClass: 'w-6 h-6',
          count: comparePropertyIds.length 
        },
        { 
          label: 'Messages', 
          path: '/messages', 
          icon: MessageSquare,
          badge: activeSubscription?.isActive ? 'Pass' : 'Req'
        },
      ]
    },
    {
      group: 'SELLER PORTAL',
      items: [
        { label: 'Seller Dashboard', path: '/seller', icon: Building2 },
        // Bad HCI demo: a repeat/loop arrow for "manage listings".
        { label: 'Manage Listings', path: '/seller/properties', icon: Repeat, sizeClass: 'w-5 h-5' },
        { label: 'Add Property', path: '/seller/properties/new', icon: PlusCircle },
      ]
    },
    {
      group: 'ACCOUNT & ADMIN',
      items: [
        { label: 'Profile & Settings', path: '/profile', icon: UserCheck },
        { label: 'Admin Console', path: '/admin', icon: ShieldAlert },
        { label: 'Login / Register', path: '/login', icon: Lock },
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 select-none">
      {/* Brand Header */}
      <div className={`flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80 ${sidebarCollapsed ? 'px-3 justify-center' : ''}`}>
        <button
          onClick={() => handleNavigate('/')}
          className="flex items-center gap-3 cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg p-1"
          title="Property Partner - Return to Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-sm shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <span className="block font-black text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                Property Partner
              </span>
              <span className="block text-[10px] font-semibold text-teal-600 dark:text-teal-400 mt-1 uppercase tracking-wider">
                HCI Prototype
              </span>
            </div>
          )}
        </button>

        {/* Mobile close button */}
        {mobileDrawerOpen && (
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="sm:hidden p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links Scrollable Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Main Navigation">
        {navigationGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                {group.group}
              </div>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigate(item.path)}
                      title={sidebarCollapsed ? item.label : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer relative group ${
                        active
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 font-bold border-l-4 border-teal-600 dark:border-teal-400 pl-2 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <Icon className={`${item.sizeClass ?? 'w-4 h-4'} shrink-0 ${active ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                      
                      {!sidebarCollapsed && (
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      )}

                      {/* Badge / Count */}
                      {!sidebarCollapsed && item.count !== undefined && item.count > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          active 
                            ? 'bg-teal-600 text-white' 
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {item.count}
                        </span>
                      )}

                      {!sidebarCollapsed && item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Area: Theme Switcher & Collapse Toggle */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
        {/* Active Role Quick Indicator */}
        {!sidebarCollapsed && (
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Logged in as:</span>
              <span className="font-bold text-teal-700 dark:text-teal-400 capitalize">{currentUser?.role || 'Guest'}</span>
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {currentUser?.name || 'Guest Explorer'}
            </div>
          </div>
        )}

        {/* Theme Switcher (Light, Dark, System) */}
        <div>
          {!sidebarCollapsed && (
            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5 px-1">
              Display Theme
            </div>
          )}
          <div className={`grid ${sidebarCollapsed ? 'grid-cols-1 gap-1' : 'grid-cols-3 gap-1'} bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl`}>
            <button
              onClick={() => setTheme('light')}
              title="Light theme"
              aria-label="Switch to light theme"
              className={`flex items-center justify-center p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-teal-800 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              {!sidebarCollapsed && <span className="ml-1 text-[10px]">Light</span>}
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark theme"
              aria-label="Switch to dark theme"
              className={`flex items-center justify-center p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900 text-teal-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              {!sidebarCollapsed && <span className="ml-1 text-[10px]">Dark</span>}
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System default theme"
              aria-label="Switch to system default theme"
              className={`flex items-center justify-center p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              {!sidebarCollapsed && <span className="ml-1 text-[10px]">Auto</span>}
            </button>
          </div>
        </div>

        {/* Desktop Collapse / Expand Toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden sm:flex w-full items-center justify-center gap-2 p-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Left Sidebar */}
      <aside 
        className={`hidden sm:block shrink-0 h-screen sticky top-0 transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-18' : 'w-64'
        }`}
        aria-label="Desktop application sidebar"
      >
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div 
          className="sm:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
