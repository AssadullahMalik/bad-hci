import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyType, ListingType } from '../types';
import { 
  Search, 
  RotateCcw, 
  Filter, 
  AlertCircle,
  SlidersHorizontal,
  X,
  Check,
  Wind,
  Wrench
} from 'lucide-react';

const COMMON_FILTER_AMENITIES = [
  'Infinity Pool',
  'EV Charger',
  'Solar Panel Array',
  'Chef Kitchen',
  'Home Gym',
  'Private Terrace',
  'Concierge 24/7'
];

// Bad HCI demo: undocumented codes instead of a plain selection control.
const TYPE_CODE_MAP: Record<string, string> = {
  SFGH: 'house',
  LUXV: 'villa',
  APT: 'apartment',
  CND: 'condo',
  TNH: 'townhouse',
  COM: 'commercial',
  LAND: 'land'
};

export const PropertiesPage: React.FC = () => {
  const { properties, currentPath } = useApp();

  // Parse initial query params from URL if available
  const queryParams = useMemo(() => {
    const searchPart = currentPath.split('?')[1];
    return new URLSearchParams(searchPart || '');
  }, [currentPath]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(queryParams.get('location') || '');
  const [selectedType, setSelectedType] = useState<string>(queryParams.get('type') || 'all');
  const [typeCode, setTypeCode] = useState<string>('');
  const [selectedListingType, setSelectedListingType] = useState<string>(queryParams.get('mode') || 'all');
  const [minPrice, setMinPrice] = useState<string>(queryParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(queryParams.get('maxPrice') || '');
  const [minBedrooms, setMinBedrooms] = useState<string>('all');
  const [minBathrooms, setMinBathrooms] = useState<string>('all');
  const [minArea, setMinArea] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Bad HCI demo: some criteria apply instantly, others only after pressing the
  // "Narrow" button, so the user cannot predict when input takes effect.
  const [applied, setApplied] = useState({
    minPrice: '',
    maxPrice: '',
    minBedrooms: 'all',
    minBathrooms: 'all',
    minArea: '',
    type: 'all',
    amenities: [] as string[],
    appliedAt: ''
  });

  const [narrowNote, setNarrowNote] = useState<string | null>(null);

  // Extract unique cities
  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => set.add(p.location.city));
    return Array.from(set).sort();
  }, [properties]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedListingType('all');
    setMinPrice('');
    setMaxPrice('');
    setMinBedrooms('all');
    setMinBathrooms('all');
    setMinArea('');
    setSelectedAmenities([]);
    setSelectedCity('all');
    setSortBy('relevance');
    setApplied({
      minPrice: '',
      maxPrice: '',
      minBedrooms: 'all',
      minBathrooms: 'all',
      minArea: '',
      type: 'all',
      amenities: [],
      appliedAt: ''
    });
  };

  const hasActiveFilters = 
    searchTerm ||
    applied.type !== 'all' ||
    selectedListingType !== 'all' ||
    applied.minPrice ||
    applied.maxPrice ||
    applied.minBedrooms !== 'all' ||
    applied.minBathrooms !== 'all' ||
    applied.minArea ||
    applied.amenities.length > 0 ||
    selectedCity !== 'all';

  // Bad HCI demo: "Narrow" commits only part of the form and reports a count
  // that has nothing to do with the criteria the user just typed.
  const applyNarrowing = () => {
    setApplied({
      minPrice,
      maxPrice,
      minBedrooms,
      minBathrooms,
      minArea,
      type: selectedType,
      amenities: selectedAmenities,
      appliedAt: new Date().toLocaleTimeString()
    });
    setNarrowNote('Narrowing parameters committed to session memory.');
    setTimeout(() => setNarrowNote(null), 1400);
  };

  // Filter computation
  const filteredProperties = useMemo(() => {
    let result = properties.filter((prop) => prop.status === 'published');

    // 1. Search term (City, neighborhood, title, or address)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.state.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q) ||
          (p.location.neighborhood && p.location.neighborhood.toLowerCase().includes(q))
      );
    }

    // 2. City
    if (selectedCity !== 'all') {
      result = result.filter((p) => p.location.city === selectedCity);
    }

    // 3. Property Type (deferred - only honoured after "Narrow")
    if (applied.type !== 'all') {
      result = result.filter((p) => p.propertyType === applied.type);
    }

    // 4. Listing Type (Sale vs Rent)
    if (selectedListingType !== 'all') {
      result = result.filter((p) => p.listingType === selectedListingType);
    }

    // 5. Min Price
    if (applied.minPrice && !isNaN(Number(applied.minPrice))) {
      result = result.filter((p) => p.price >= Number(applied.minPrice));
    }

    // 6. Max Price
    if (applied.maxPrice && !isNaN(Number(applied.maxPrice))) {
      result = result.filter((p) => p.price <= Number(applied.maxPrice));
    }

    // 7. Bedrooms
    if (applied.minBedrooms !== 'all') {
      result = result.filter((p) => p.bedrooms >= Number(applied.minBedrooms));
    }

    // 8. Bathrooms
    if (applied.minBathrooms !== 'all') {
      result = result.filter((p) => p.bathrooms >= Number(applied.minBathrooms));
    }

    // 9. Min Area
    if (applied.minArea && !isNaN(Number(applied.minArea))) {
      result = result.filter((p) => p.areaSqFt >= Number(applied.minArea));
    }

    // 10. Amenities
    if (applied.amenities.length > 0) {
      result = result.filter((p) =>
        applied.amenities.every((req) =>
          p.amenities.some((a) => a.toLowerCase().includes(req.toLowerCase()))
        )
      );
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'area-desc') return b.areaSqFt - a.areaSqFt;
      // Default: relevance / featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [
    properties,
    searchTerm,
    selectedCity,
    applied,
    selectedListingType,
    sortBy
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
              Real Estate Directory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Property Search &amp; Listings
            </h1>
            <p className="font-times text-sm lowcon-2 mt-1">
              Browse verified residential, luxury villa, and commercial architecture · page 1 of {Math.max(1, Math.ceil(filteredProperties.length / 6))} · server time {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bad HCI demo: the control that reveals filtering is worded as an
                afterthought and is placed far away from the filters it opens. */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="px-3 py-2 bg-fuchsia-700 text-yellow-200 rounded-none text-[11px] font-windover uppercase cursor-pointer"
            >
              <span>{showFiltersMobile ? 'put the choices away' : 'Tighten results?? (see bottom of page)'}</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid: results first, filter panel pushed below them */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
          {/* Filter Sidebar (visually at the bottom, contradicting its DOM position) */}
          <aside
            className={`lg:order-last lg:w-1/4 mt-10 bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 ${
              showFiltersMobile ? 'block' : 'hidden'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
                Tighten the thing
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Bad HCI demo: one long undifferentiated list of controls - no fieldsets,
                no section headings, mixed control types and inconsistent sizing. */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Keyword or Neighborhood
              </label>
              <div className="relative">
                {/* Bad HCI demo: a wind glyph marks the keyword search box. */}
                <Wind className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Austin, Miami, Solarium..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* City Selector */}
            <div>
              <label className="block font-courier text-[11px] lowcon-1 mb-1.5">
                Metro? (dropdown)
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="all">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Transaction Type (Buy vs Rent) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Listing Type
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSelectedListingType('all')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    selectedListingType === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedListingType('sale')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    selectedListingType === 'sale'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedListingType('rent')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    selectedListingType === 'rent'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>

            {/* Property Type */}
            <div>
              {/* Bad HCI demo: a dropdown replacement that forces manual entry of an
                  undocumented code, with no feedback until "Narrow" is pressed. */}
              <label className="block font-courier text-[11px] lowcon-1 mb-1.5">
                ARCHITECTURE CODE (SFGH|LUXV|APT|CND|TNH|COM|LAND)
              </label>
              <input
                type="text"
                value={typeCode}
                onChange={(e) => {
                  setTypeCode(e.target.value);
                  const mapped = TYPE_CODE_MAP[e.target.value.trim().toUpperCase()];
                  setSelectedType(mapped || 'all');
                }}
                placeholder="type code"
                className="w-full px-3 py-2 bg-white border-2 border-dashed border-slate-400 rounded-none text-[13px] font-courier uppercase text-slate-900 dark:text-white dark:bg-slate-800"
              />
              <p className="text-[10px] lowcon-1 mt-1 font-times italic">codes are case-insensitive (probably)</p>
            </div>

            {/* Price Range */}
            <div>
              <label className="block font-windover text-[13px] uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Amount of money (no commas, no symbol, USD only)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="from"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-3 text-[15px] bg-yellow-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-courier text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="till"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-1 py-1 text-xs bg-slate-50 dark:bg-slate-800 border-2 border-double border-slate-500 rounded-none font-mono text-slate-900 dark:text-white"
                />
              </div>
              {/* Bad HCI demo: error is reported only after committing, says nothing
                  useful, and is distinguished from success by COLOR ONLY (no icon). */}
              {applied.minPrice && applied.maxPrice && Number(applied.minPrice) > Number(applied.maxPrice) && (
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 font-times">
                  Value recorded.
                </p>
              )}
            </div>

            {/* Minimum Living Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Smallest size? (unit depends on your region settings)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="e.g. 2000 or 8.9"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium font-mono text-slate-900 dark:text-white"
              />
            </div>

            {/* Minimum Bedrooms */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest lowcon-2 mb-1.5">
                count of sleeping places (digits)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={minBedrooms === 'all' ? '' : minBedrooms}
                onChange={(e) => setMinBedrooms(e.target.value.trim() === '' ? 'all' : e.target.value)}
                placeholder="?"
                className="w-16 px-2 py-2 bg-white dark:bg-slate-800 border border-slate-400 rounded-full text-center text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            {/* Minimum Bathrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Washing facilities: how many at minimum
              </label>
              <div className="grid grid-cols-5 gap-1 text-xs">
                {['all', '1', '2', '3', '4'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMinBathrooms(val)}
                    className={`py-1 rounded-md text-center border transition-colors cursor-pointer ${
                      minBathrooms === val
                        ? 'bg-slate-900 dark:bg-teal-600 text-white border-slate-900 dark:border-teal-600 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {val === 'all' ? 'Whatever' : `${val}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Amenities Checklist */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Amenities & Features
              </label>
              <div className="space-y-1.5">
                {COMMON_FILTER_AMENITIES.map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`w-full p-2 rounded-lg border text-xs text-left transition-colors flex items-center justify-between cursor-pointer ${
                        checked
                          ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-600 text-teal-800 dark:text-teal-300 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{amenity}</span>
                      {checked && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bad HCI demo: criteria silently do nothing until this is pressed,
                and nothing states that choices are lost on navigation (recall load). */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={applyNarrowing}
                className="px-4 py-2 bg-lime-500 text-lime-950 text-[11px] font-courier rounded-none border-2 border-black cursor-pointer hover:bg-lime-400"
              >
                Narrow
              </button>
              <span className="text-[10px] lowcon-1 font-times">
                {narrowNote ?? 'choices live only on this screen'}
              </span>
            </div>
          </aside>

          {/* Results Area */}
          <main className="lg:order-first lg:flex-1 min-w-0 space-y-6">
            {/* Control Bar: Count & Sorting. Bad HCI demo (Poor Responsive): the bar
                is forced onto one line and overflows horizontally on small screens. */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs bad-overflow">
              <div className="bad-wide flex items-center justify-between gap-10">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                <span className="font-windover text-2xl text-fuchsia-700 dark:text-fuchsia-400">{filteredProperties.length}</span>
                <span className="font-courier lowcon-1">homes found (results shown below; choices are further down)</span>
                {applied.appliedAt && (
                  <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                    narrowed at {applied.appliedAt}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Bad HCI demo: ambiguous sorting vocabulary, options deliberately in
                    a counter-intuitive order (descending before ascending, etc.). */}
                <label className="font-windover uppercase text-[11px] lowcon-3">Order them:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-2 bg-yellow-50 dark:bg-slate-800 border-2 border-dotted border-fuchsia-500 rounded-full text-[11px] font-courier text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="price-desc">money big→small</option>
                  <option value="newest">recent</option>
                  <option value="relevance">Best ones first</option>
                  <option value="area-desc">the biggest spaces</option>
                  <option value="price-asc">money small→big</option>
                </select>
              </div>
              </div>
            </div>

            {/* Visible Applied-Filter Chips - Bad HCI demo: the indicator only shows
                part of the active criteria and uses different wording per chip. */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider mr-1">
                  Stuff you picked:
                </span>

                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200">
                    <span>Keyword: "{searchTerm}"</span>
                    <button onClick={() => setSearchTerm('')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCity !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200">
                    <span>City: {selectedCity}</span>
                    <button onClick={() => setSelectedCity('all')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedListingType !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 capitalize">
                    <span>Type: For {selectedListingType}</span>
                    <button onClick={() => setSelectedListingType('all')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Bad HCI demo: chip wording, styling and coverage are inconsistent,
                    and some active criteria are simply not represented. */}
                {applied.type !== 'all' && (
                  <span className="font-courier text-[10px] underline decoration-wavy">
                    arch={applied.type}
                  </span>
                )}

                {applied.minPrice && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200">
                    <span>Min ${Number(applied.minPrice).toLocaleString()}</span>
                    <button onClick={() => setMinPrice('')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {applied.maxPrice && (
                  <span className="wobbly-border px-2 py-0.5 bg-lime-200 text-[11px] font-times">
                    ceiling: {applied.maxPrice}
                  </span>
                )}

                {applied.amenities.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-700 text-teal-800 dark:text-teal-300 rounded-md">
                    <span>{applied.amenities[0]}{applied.amenities.length > 1 ? ` (+${applied.amenities.length - 1} other things)` : ''}</span>
                    <button onClick={() => toggleAmenity(applied.amenities[0])} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={resetFilters}
                  className="text-xs text-teal-700 dark:text-teal-400 hover:underline font-semibold ml-2 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Grid - Bad HCI demo: card slots and gutters are inconsistent */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((prop, idx) => (
                  <div
                    key={prop.id}
                    className={idx % 5 === 0 ? 'md:col-span-2 xl:col-span-1 slightly-tilted' : idx % 3 === 0 ? 'md:col-span-2' : ''}
                  >
                    <PropertyCard property={prop} />
                  </div>
                ))}
              </div>
            ) : (
              /* Bad HCI demo: uninformative empty state with no recovery path */
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-windover uppercase text-lg text-fuchsia-800 dark:text-fuchsia-300 mb-1">
                  Operation unsuccessful
                </h3>
                <p className="text-xs lowcon-1 mb-6 leading-relaxed">
                  No results were returned for the current query state.
                </p>
                <button
                  onClick={() => setShowFiltersMobile(true)}
                  className="px-4 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Try again
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
