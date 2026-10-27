import React from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Heart, 
  SlidersHorizontal, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Compass,
  History
} from 'lucide-react';

export const BuyerDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    savedPropertyIds, 
    comparePropertyIds, 
    activeSubscription, 
    conversations,
    properties, 
    recentlyViewedIds,
    navigate 
  } = useApp();

  const savedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));
  const recentlyViewed = properties.filter((p) => recentlyViewedIds.includes(p.id));
  const recommendedProperties = properties
    .filter((p) => p.status === 'published' && !savedPropertyIds.includes(p.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-slate-900 border border-slate-800 text-slate-600 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-teal-950/60 border border-teal-800/60 px-3 py-1 rounded-full">
              <span>Verified Buyer Profile</span>
              <span className="text-slate-700">·</span>
              <span>{currentUser?.email || 'alex.rivera@example.com'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-700">
              Welcome back, {currentUser?.name || 'Alex'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Track your saved properties, monitor active seller conversations, and explore tailored architectural matches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/matchmaker')}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Launch Matchmaker</span>
            </button>
            <button
              onClick={() => navigate('/designer')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-500 font-semibold text-xs rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-600" />
              <span>AI Designer</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Saved Properties */}
          <div 
            onClick={() => navigate('/saved')}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 dark:text-slate-800">Saved Properties</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-300 dark:text-slate-700 tabular-nums">
              {savedPropertyIds.length}
            </div>
            <div className="text-[11px] text-slate-200 dark:text-slate-800 font-medium mt-1 flex items-center gap-1">
              <span>View collection</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2: Compare Matrix */}
          <div 
            onClick={() => navigate('/compare')}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 dark:text-slate-800">Comparing</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-300 dark:text-slate-700 tabular-nums">
              {comparePropertyIds.length} <span className="text-xs font-normal text-slate-400">/ 4 max</span>
            </div>
            <div className="text-[11px] text-slate-200 dark:text-slate-800 font-medium mt-1 flex items-center gap-1">
              <span>Open matrix</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 3: AI Connect Status */}
          <div 
            onClick={() => navigate('/connect')}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 dark:text-slate-800">AI Connect</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-base font-bold text-slate-300 dark:text-slate-700 truncate">
              {activeSubscription && activeSubscription.isActive ? activeSubscription.planName : 'No Active Pass'}
            </div>
            <div className="text-[11px] text-slate-200 dark:text-slate-800 mt-1">
              {activeSubscription && activeSubscription.isActive ? `Expires ${activeSubscription.expiryDate}` : 'Unlock seller chat'}
            </div>
          </div>

          {/* Card 4: Conversations */}
          <div 
            onClick={() => navigate('/messages')}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 dark:text-slate-800">Inquiry Messages</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-300 dark:text-slate-700 tabular-nums">
              {conversations.length}
            </div>
            <div className="text-[11px] text-slate-200 dark:text-slate-800 font-medium mt-1 flex items-center gap-1">
              <span>View threads</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Section 1: Saved Properties */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-300 dark:text-slate-700">Saved Properties</h2>
              <p className="text-xs text-slate-200 dark:text-slate-800">Residences you have bookmarked for comparison and review</p>
            </div>
            {savedProperties.length > 0 && (
              <button
                onClick={() => navigate('/saved')}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Manage all ({savedProperties.length})
              </button>
            )}
          </div>

          {savedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.slice(0, 3).map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center">
              <Heart className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No saved properties yet</h3>
              <p className="text-xs text-slate-200 dark:text-slate-800 mt-1 max-w-sm mx-auto">
                Click the heart icon on any property card or detail page to bookmark listings for later review.
              </p>
              <button
                onClick={() => navigate('/properties')}
                className="mt-4 px-4 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Explore Properties
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Recently Viewed Properties */}
        {recentlyViewed.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <div>
                  <h2 className="text-lg font-bold text-slate-300 dark:text-slate-700">Recently Viewed Properties</h2>
                  <p className="text-xs text-slate-200 dark:text-slate-800">Your recent browsing history across the catalog</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyViewed.slice(0, 3).map((p) => (
                <PropertyCard key={p.id} property={p} compact />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Recommended for You */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-300 dark:text-slate-700">Tailored for Your Preferences</h2>
              <p className="text-xs text-slate-200 dark:text-slate-800">Curated suggestions aligned with your architectural tastes</p>
            </div>
            <button
              onClick={() => navigate('/matchmaker')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Adjust Match Criteria
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
