import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Search, 
  Sparkles, 
  Layers, 
  MessageSquare, 
  ArrowRight, 
  Building2, 
  Home as HomeIcon, 
  Building, 
  Landmark, 
  MapPin, 
  ShieldCheck, 
  Compass,
  CheckCircle2,
  Flame,
  Rocket
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { properties, navigate } = useApp();

  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchListingType, setSearchListingType] = useState<'sale' | 'rent'>('sale');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');

  const featuredProperties = properties
    .filter((p) => p.status === 'published')
    .slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (searchType !== 'all') params.set('type', searchType);
    if (searchListingType) params.set('mode', searchListingType);
    if (searchMaxPrice) params.set('maxPrice', searchMaxPrice);

    navigate(`/properties?${params.toString()}`);
  };

  const categories = [
    { id: 'house', name: 'Houses & Estates', icon: HomeIcon, count: '14 Active' },
    { id: 'apartment', name: 'Urban Apartments', icon: Building, count: '18 Active' },
    { id: 'villa', name: 'Luxury Villas', icon: Landmark, count: '8 Active' },
    { id: 'commercial', name: 'Commercial & Studios', icon: Building2, count: '6 Active' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 sm:py-24 border-b border-slate-900">
        {/* Subtle Architectural Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-950/60 border border-teal-800/60 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation Real Estate Platform</span>
              <span className="text-teal-700">·</span>
              <span className="text-slate-300">HCI Design System</span>
            </div>

            {/* Display Headline (bad demo: competing font weights & sizes fight for attention) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="text-white">Discover, </span>
              <span className="font-times italic text-amber-300">visualize,</span>
              <span className="text-white"> and </span>
              <span className="font-windover uppercase text-fuchsia-400 text-2xl sm:text-3xl">secure</span>
              <span className="text-white"> your next space.</span>
            </h1>

            {/* Bad demo: irrelevant "social proof" clutter directly under the headline */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px]">
              <span className="font-courier text-lime-300 bg-lime-950/60 px-2 py-0.5 rounded-none">visitors today: 4</span>
              <span className="font-times italic text-slate-400">"Best website I have ever used!!" — random person</span>
              <span className="blink-attention font-windover uppercase text-yellow-300">*** 50% more listings than last tuesday ***</span>
              <span className="font-courier lowcon-2">page load: 0.4s (your mileage may vary)</span>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Property Partner unites intelligent preference matching, AI interior transformation concepts, and transparent buyer–seller communication in one unified experience.
            </p>

            {/* Prominent Search Card */}
            <div className="pt-4 max-w-4xl mx-auto">
              <form 
                onSubmit={handleSearchSubmit}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800"
              >
                {/* Buy / Rent Switcher */}
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSearchListingType('sale')}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                        searchListingType === 'sale'
                          ? 'bg-slate-900 dark:bg-teal-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Buy Property
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchListingType('rent')}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                        searchListingType === 'rent'
                          ? 'bg-slate-900 dark:bg-teal-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Rent Property
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                    Explore verified luxury and residential listings
                  </span>
                </div>

                {/* Search Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-left">
                  {/* Location */}
                  <div className="sm:col-span-5">
                    <label className="block font-windover text-[11px] uppercase text-fuchsia-600 dark:text-fuchsia-300 mb-1">
                      Geographic preference?? (city state or neighborhood maybe)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="e.g. Austin, Miami, Seattle"
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Property Category
                    </label>
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Categories</option>
                      <option value="house">Single Family House</option>
                      <option value="villa">Luxury Villa</option>
                      <option value="apartment">Condo & Penthouse</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="commercial">Commercial & Loft</option>
                      <option value="land">Permitted Land</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="sm:col-span-3 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-fuchsia-700 hover:bg-amber-600 text-yellow-200 text-sm font-windover uppercase rounded-none shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Flame className="w-5 h-5" />
                      <span>Execute query!!</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Core AI Triad Services Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Three Intelligent Services in One Platform
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Engineered around user-centered interaction principles to eliminate friction in buying, visualizing, and communicating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Bad demo: three "identical" service cards, each styled completely
              differently - different borders, radii, shadows, fonts */}
          {/* Service 1: Matchmaker */}
          <div className="bg-white dark:bg-slate-900 rounded-none wobbly-border p-6 flex flex-col justify-between shadow-lg slightly-tilted transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4">
                {/* Bad HCI demo: an unrelated rocket glyph, oversized vs the other service icons. */}
                <Rocket className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Property Matchmaker</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Tell us your exact budget limits, bedroom needs, and required lifestyle amenities. Our preference-matching engine scores every home with transparent matching explanations.
              </p>
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Explainable criteria scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Budget & lifestyle alignment</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/matchmaker')}
              className="w-full py-2 px-4 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Launch Matchmaker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Service 2: Designer */}
          <div className="bg-amber-50 dark:bg-slate-950 rounded-3xl border-4 border-dashed border-teal-400 p-4 flex flex-col justify-between shadow-none transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-times text-lg italic font-bold text-amber-800 dark:text-amber-300 mb-2">AI Property Designer</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Upload room photos or test sample listings to visualize Scandinavian warmth, Japandi, or minimalist renovations with architectural palettes and realistic cost estimates.
              </p>
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Interactive before / after concept view</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Material palettes & lighting guides</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/designer')}
              className="w-full py-2 px-4 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore Designer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Service 3: AI Connect */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div>
              <div className="w-14 h-8 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-950/60 text-fuchsia-700 dark:text-fuchsia-300 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Connect Direct Access</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Communicate directly with verified sellers and listing agents without middleman markup. Transparent 7, 30, and 90-day passes with clear expiration boundaries.
              </p>
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Transparent time-limited access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Simulated checkout with zero card fees</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/connect')}
              className="w-full py-2 px-4 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Connection Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Featured Real Estate</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Curated architectural residences and prime commercial locations</p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View all properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          Browse by Architectural Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/properties?type=${cat.id}`)}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-sm text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/50 group-hover:text-teal-700 dark:group-hover:text-teal-400 flex items-center justify-center mb-3 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white">{cat.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cat.count}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Dual CTA: Buyer & Seller */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Buyers */}
            <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">For Buyers & Investors</span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-3">Find a Home That Fits Your Exact Budget</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Save time filtering thousands of irrelevant listings. Use our AI Matchmaker preference questionnaire to pinpoint properties that match your commute and lifestyle requirements.
                </p>
              </div>
              <button
                onClick={() => navigate('/matchmaker')}
                className="w-full sm:w-auto self-start px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Start Matchmaker Questionnaire
              </button>
            </div>

            {/* For Sellers */}
            <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">For Property Owners & Brokers</span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-3">List Your Space to High-Intent Buyers</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Create rich property records with photos, specifications, and amenity tags. Manage inquiries directly through the Seller Studio with live status indicators.
                </p>
              </div>
              <button
                onClick={() => navigate('/seller/properties/new')}
                className="w-full sm:w-auto self-start px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Create a Free Listing
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
