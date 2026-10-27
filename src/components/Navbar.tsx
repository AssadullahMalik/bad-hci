import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Menu, 
  X, 
  Heart, 
  SlidersHorizontal, 
  MessageSquare, 
  UserCheck, 
  Sparkles,
  ChevronDown,
  Globe
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    switchUserRole, 
    savedPropertyIds, 
    comparePropertyIds, 
    currentPath, 
    navigate,
    activeSubscription,
    toggleSubscriptionExpirySimulation,
    currency,
    setCurrency,
    areaUnit,
    setAreaUnit
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Keyboard shortcut: Escape to close menus (Shneiderman Rule 2 & 7)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRoleMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* HCI Demo Simulation & Localization Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="text-teal-400 font-semibold tracking-wider text-[11px] uppercase">HCI Prototype</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300">Active Role:</span>
          <span className="font-semibold text-white capitalize">{currentUser?.role || 'Guest'}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">AI Connect:</span>
          <span className={activeSubscription?.isActive ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
            {activeSubscription ? (activeSubscription.isActive ? `Active (${activeSubscription.planName})` : 'Expired') : 'None'}
          </span>
        </div>

        {/* Right side: Localization Currency & Unit Switchers + Pass Toggle */}
        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded px-1.5 py-0.5 text-[10px] font-semibold gap-1 text-slate-300">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${currency === 'USD' ? 'bg-teal-600 text-white' : 'hover:text-white'}`}
              title="Display valuations in USD ($)"
            >
              USD $
            </button>
            <button
              onClick={() => setCurrency('PKR')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${currency === 'PKR' ? 'bg-teal-600 text-white' : 'hover:text-white'}`}
              title="Display valuations in Pakistani Rupee (PKR)"
            >
              PKR ₨
            </button>
          </div>

          {/* Area Unit Switcher */}
          <div className="hidden md:flex items-center bg-slate-800 rounded px-1.5 py-0.5 text-[10px] font-semibold gap-1 text-slate-300">
            <button
              onClick={() => setAreaUnit('sqft')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${areaUnit === 'sqft' ? 'bg-slate-700 text-white' : 'hover:text-white'}`}
              title="Square feet"
            >
              Sq Ft
            </button>
            <button
              onClick={() => setAreaUnit('marla')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${areaUnit === 'marla' ? 'bg-slate-700 text-white' : 'hover:text-white'}`}
              title="Marla (Pakistani Unit: 1 Marla ≈ 225 sq ft)"
            >
              Marla
            </button>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <button
            onClick={toggleSubscriptionExpirySimulation}
            className="text-slate-300 hover:text-white underline transition-colors cursor-pointer"
            title="Toggle subscription active/expired state for testing"
          >
            Toggle Pass Expiry
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => handleNav('/admin')}
            className="text-teal-300 hover:text-teal-200 font-medium transition-colors cursor-pointer"
          >
            Admin Panel
          </button>
        </div>
      </div>

      {/* Main Top Bar: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2 text-slate-900 hover:text-teal-700 transition-colors shrink-0 text-left cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Property Partner
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => handleNav('/properties')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              isActive('/properties') ? 'text-teal-600 font-semibold' : ''
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => handleNav('/matchmaker')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer ${
              isActive('/matchmaker') ? 'text-teal-600 font-semibold' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            AI Matchmaker
          </button>
          <button
            onClick={() => handleNav('/designer')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              isActive('/designer') ? 'text-teal-600 font-semibold' : ''
            }`}
          >
            AI Designer
          </button>
          <button
            onClick={() => handleNav('/connect')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              isActive('/connect') ? 'text-teal-600 font-semibold' : ''
            }`}
          >
            AI Connect
          </button>
          {currentUser && currentUser.role === 'buyer' && (
            <button
              onClick={() => handleNav('/dashboard')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
                isActive('/dashboard') ? 'text-teal-600 font-semibold' : ''
              }`}
            >
              Buyer Dashboard
            </button>
          )}
          {currentUser && (currentUser.role === 'seller' || currentUser.role === 'agent') && (
            <button
              onClick={() => handleNav('/seller')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
                isActive('/seller') ? 'text-teal-600 font-semibold' : ''
              }`}
            >
              Seller Studio
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Saved Properties shortcut (Consistent Terminology) */}
          <button
            onClick={() => handleNav('/saved')}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Saved Properties"
            aria-label="View Saved Properties"
          >
            <Heart className="w-5 h-5" />
            {savedPropertyIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-teal-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {savedPropertyIds.length}
              </span>
            )}
          </button>

          {/* Compare shortcut */}
          <button
            onClick={() => handleNav('/compare')}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Compare Properties"
            aria-label="Compare properties"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {comparePropertyIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-slate-900 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {comparePropertyIds.length}
              </span>
            )}
          </button>

          {/* Messages shortcut */}
          <button
            onClick={() => handleNav('/messages')}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Inquiry Messages"
            aria-label="Inquiry Messages"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Role switcher dropdown for evaluators */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              aria-expanded={roleMenuOpen}
              aria-haspopup="true"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline capitalize">{currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-900">{currentUser ? currentUser.name : 'Not Signed In'}</div>
                  <div className="text-slate-500 text-[11px] truncate">{currentUser?.email || 'Choose a persona'}</div>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">Switch Persona (HCI Demo)</div>
                  <button
                    onClick={() => { switchUserRole('buyer'); setRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 cursor-pointer"
                  >
                    <span>Buyer: Alex Rivera</span>
                    {currentUser?.role === 'buyer' && <span className="text-teal-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchUserRole('seller'); setRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 cursor-pointer"
                  >
                    <span>Seller/Agent: Marcus Vance</span>
                    {(currentUser?.role === 'seller' || currentUser?.role === 'agent') && <span className="text-teal-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchUserRole('admin'); setRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 cursor-pointer"
                  >
                    <span>Admin: Dr. Evelyn Reed</span>
                    {currentUser?.role === 'admin' && <span className="text-teal-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchUserRole('guest'); setRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 cursor-pointer"
                  >
                    <span>Guest User</span>
                    {!currentUser && <span className="text-teal-600 font-bold">✓</span>}
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  {currentUser ? (
                    <>
                      <button
                        onClick={() => { handleNav('/profile'); setRoleMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 cursor-pointer"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => { switchUserRole('guest'); setRoleMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-red-600 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { handleNav('/login'); setRoleMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-teal-700 font-medium cursor-pointer"
                    >
                      Sign In / Register
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA button */}
          {!currentUser ? (
            <button
              onClick={() => handleNav('/login')}
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign In
            </button>
          ) : currentUser.role === 'seller' || currentUser.role === 'agent' ? (
            <button
              onClick={() => handleNav('/seller/properties/new')}
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              + List Property
            </button>
          ) : (
            <button
              onClick={() => handleNav('/matchmaker')}
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Find Matches
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {/* Mobile Currency & Unit Switchers */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-semibold text-slate-600">Currency / Units:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrency(currency === 'USD' ? 'PKR' : 'USD')}
                className="px-2 py-1 bg-slate-100 rounded text-slate-800 font-bold cursor-pointer"
              >
                {currency}
              </button>
              <button
                onClick={() => setAreaUnit(areaUnit === 'sqft' ? 'marla' : 'sqft')}
                className="px-2 py-1 bg-slate-100 rounded text-slate-800 font-bold cursor-pointer"
              >
                {areaUnit}
              </button>
            </div>
          </div>

          <button
            onClick={() => handleNav('/')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-teal-600 cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/properties')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-teal-600 cursor-pointer"
          >
            Browse Properties
          </button>
          <button
            onClick={() => handleNav('/matchmaker')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-teal-600 cursor-pointer"
          >
            AI Property Matchmaker
          </button>
          <button
            onClick={() => handleNav('/designer')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-teal-600 cursor-pointer"
          >
            AI Property Designer
          </button>
          <button
            onClick={() => handleNav('/connect')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-teal-600 cursor-pointer"
          >
            AI Connect Plans
          </button>
          <button
            onClick={() => handleNav('/saved')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-teal-600 cursor-pointer"
          >
            Saved Properties ({savedPropertyIds.length})
          </button>
          <button
            onClick={() => handleNav('/compare')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-teal-600 cursor-pointer"
          >
            Compare Matrix ({comparePropertyIds.length})
          </button>
          <button
            onClick={() => handleNav('/messages')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-teal-600 cursor-pointer"
          >
            Inquiry Messages
          </button>
          <button
            onClick={() => handleNav('/admin')}
            className="block w-full text-left py-2 text-sm font-medium text-teal-700 cursor-pointer"
          >
            Administrative Panel
          </button>
        </div>
      )}
    </header>
  );
};
