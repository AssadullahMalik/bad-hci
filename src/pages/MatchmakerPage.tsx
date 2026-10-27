import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property, PropertyType, ListingType, MatchResult } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Sparkles, 
  Compass, 
  Sliders, 
  Check, 
  RotateCcw, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  DollarSign
} from 'lucide-react';

export const MatchmakerPage: React.FC = () => {
  const { properties, navigate } = useApp();

  // Guided Form Preferences
  const [budgetMin, setBudgetMin] = useState<number>(500000);
  const [budgetMax, setBudgetMax] = useState<number>(2500000);
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['Austin', 'Miami']);
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>(['villa', 'house', 'apartment']);
  const [minBedrooms, setMinBedrooms] = useState<number>(3);
  const [minAreaSqFt, setMinAreaSqFt] = useState<number>(2000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'EV Charger',
    'Infinity Pool',
    'Home Office'
  ]);

  const [hasSearched, setHasSearched] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  // Bad HCI demo (Poor Feedback): the engine "thinks" for ~1.2s with NO spinner,
  // progress bar, or disabled state - the submit button never changes appearance,
  // so users cannot tell whether the click registered at all.
  const [calcTick, setCalcTick] = useState(0);

  const availableCities = ['Austin', 'Miami', 'Boston', 'Seattle', 'New York', 'Scottsdale', 'Denver', 'San Francisco'];
  const allPropertyTypes: { type: PropertyType; label: string }[] = [
    { type: 'house', label: 'Single-Family House' },
    { type: 'villa', label: 'Luxury Villa' },
    { type: 'apartment', label: 'Apartment' },
    { type: 'condo', label: 'Condo' },
    { type: 'townhouse', label: 'Townhouse' },
    { type: 'commercial', label: 'Commercial Loft' },
  ];

  const popularAmenities = [
    'Infinity Pool',
    'EV Charger',
    'Solar Panel Array',
    'Home Gym',
    'Private Terrace',
    'Wine Cellar',
    'Concierge 24/7',
    'High Ceilings',
    'Detached Studio',
    'Mountain Views',
    'Ocean Views'
  ];

  const toggleLocation = (city: string) => {
    setSelectedLocations((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const toggleType = (t: PropertyType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Bad HCI demo: validation happens only on submit, errors are vague, and the
  // wording never matches the labels on the inputs above.
  const vagueErrors = ['Invalid input.', 'Operation unsuccessful.', 'Something is wrong.', 'Fix inputs.'];
  const fail = (msg: string) => setFormError(msg || vagueErrors[Math.floor(Math.random() * vagueErrors.length)]);

  const handleMatchCalculation = (overrides?: Partial<{ budgetMax: number; selectedLocations: string[] }>) => {
    setFormError(null);

    // Snapshot preferences NOW - they are wiped once results appear, forcing
    // re-entry on every subsequent search (efficiency / repeated-entry failure).
    const pBudgetMin = budgetMin;
    const pBudgetMax = overrides?.budgetMax ?? budgetMax;
    const pListingType = listingType;
    const pLocations = overrides?.selectedLocations ?? selectedLocations;
    const pTypes = selectedTypes;
    const pMinBedrooms = minBedrooms;
    const pMinArea = minAreaSqFt;
    const pAmenities = selectedAmenities;

    // Validation
    if (pBudgetMin > pBudgetMax) {
      fail('Invalid input.');
      return;
    }

    if (pLocations.length === 0) {
      fail('Operation unsuccessful.');
      return;
    }

    if (pTypes.length === 0) {
      fail('Data could not be processed.');
      return;
    }

    const computedResults: MatchResult[] = [];

    properties
      .filter((p) => p.status === 'published')
      .forEach((prop) => {
        let score = 0;
        const reasons: string[] = [];
        const missing: string[] = [];

        // 1. Listing Type (Sale vs Rent)
        if (prop.listingType !== pListingType) {
          return;
        }

        // 2. Budget match (Weight: 30 pts)
        if (prop.price >= pBudgetMin && prop.price <= pBudgetMax) {
          score += 30;
          reasons.push(`Priced comfortably at $${prop.price.toLocaleString()} within your $${pBudgetMin.toLocaleString()} - $${pBudgetMax.toLocaleString()} budget`);
        } else if (prop.price <= pBudgetMax * 1.15) {
          score += 15;
          reasons.push(`Slightly above target budget by only ${(Math.round((prop.price - pBudgetMax) / pBudgetMax * 100))}%`);
        } else {
          missing.push('Outside target price bracket');
        }

        // 3. Location match (Weight: 25 pts)
        if (pLocations.includes(prop.location.city)) {
          score += 25;
          reasons.push(`Located in your preferred market of ${prop.location.city}, ${prop.location.state}`);
        } else {
          missing.push(`Located in ${prop.location.city}`);
        }

        // 4. Property Type match (Weight: 20 pts)
        if (pTypes.includes(prop.propertyType)) {
          score += 20;
          reasons.push(`Matches your requested ${prop.propertyType.toUpperCase()} architectural style`);
        } else {
          missing.push(`Is a ${prop.propertyType}`);
        }

        // 5. Bedrooms match (Weight: 15 pts)
        if (prop.bedrooms >= pMinBedrooms) {
          score += 15;
          reasons.push(`Provides ${prop.bedrooms} bedrooms (meets or exceeds your ${pMinBedrooms}+ requirement)`);
        } else if (prop.bedrooms > 0) {
          missing.push(`Has ${prop.bedrooms} bedrooms (${pMinBedrooms} requested)`);
        }

        // 6. Area match (Weight: 10 pts)
        if (prop.areaSqFt >= pMinArea) {
          score += 10;
          reasons.push(`Expansive living space of ${prop.areaSqFt.toLocaleString()} sq ft (above ${pMinArea.toLocaleString()} sq ft goal)`);
        }

        // 7. Amenities bonus (up to 15 bonus pts)
        let matchedAmenitiesCount = 0;
        pAmenities.forEach((amenity) => {
          if (prop.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))) {
            matchedAmenitiesCount++;
          }
        });
        if (matchedAmenitiesCount > 0) {
          score += Math.min(15, matchedAmenitiesCount * 5);
          reasons.push(`Includes ${matchedAmenitiesCount} of your desired lifestyle amenities`);
        }

        // Normalize score up to 98%
        const finalScore = Math.min(99, Math.round((score / 100) * 98));

        if (finalScore >= 40) {
          computedResults.push({
            property: prop,
            score: finalScore,
            matchingReasons: reasons,
            relaxedCriteria: missing
          });
        }
      });

    // Sort by score descending
    computedResults.sort((a, b) => b.score - a.score);

    setTimeout(() => {
      setMatches(computedResults);
      setHasSearched(true);

      // Bad HCI demo (Poor Efficiency): all entered preferences are wiped back to
      // defaults immediately after the run - the next search starts from scratch.
      setBudgetMin(500000);
      setBudgetMax(2500000);
      setSelectedLocations(['Austin', 'Miami']);
      setSelectedTypes(['villa', 'house', 'apartment']);
      setMinBedrooms(3);
      setMinAreaSqFt(2000);
      setSelectedAmenities([]);

      const resultsElement = document.getElementById('matchmaker-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 text-xs font-semibold border border-teal-200 dark:border-teal-800">
            <Compass className="w-3.5 h-3.5" />
            <span>Intelligent Preference Engine</span>
            <span>·</span>
            <span>Explainable Recommendations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Property Matchmaker
          </h1>
          {/* Bad HCI demo: contradictory promise - claims transparency while hiding it */}
          <p className="font-courier text-sm lowcon-2 leading-relaxed">
            Enter stuff into the fields. The neural affinity core ranks residences using a proprietary weighting matrix. Scores are final. Reasoning is available on request (form not included).
          </p>
        </div>

        {/* Form & Controls Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          <form onSubmit={(e) => { e.preventDefault(); handleMatchCalculation(); }} className="space-y-8">
            {formError && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
                {formError}
              </div>
            )}

            {/* Bad HCI demo: steps numbered out of order, headings use random fonts */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-fuchsia-700 text-yellow-200 text-xs font-bold flex items-center justify-center">3</span>
                <h2 className="font-windover text-base uppercase text-slate-900 dark:text-white">MONEY THINGZ (bracket of funds)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Intent</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setListingType('sale')}
                      className={`py-2 rounded-md transition-colors cursor-pointer ${
                        listingType === 'sale'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Buy Residence
                    </button>
                    <button
                      type="button"
                      onClick={() => setListingType('rent')}
                      className={`py-2 rounded-md transition-colors cursor-pointer ${
                        listingType === 'rent'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Lease / Rent
                    </button>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className="block font-courier text-[10px] lowcon-1 mb-2">
                    Ceiling figure? (currency implied, do not include letters)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="number"
                      step={listingType === 'rent' ? '200' : '25000'}
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className="block font-courier text-[10px] lowcon-1 mb-2">
                    Floor figure (yes, lower number; enter anyway)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="number"
                      step={listingType === 'rent' ? '200' : '25000'}
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Preferred Markets / Cities */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center slightly-tilted">1</span>
                <h2 className="font-times text-base italic text-slate-900 dark:text-white">Geographic areas (click places you maybe like)</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableCities.map((city) => {
                  const selected = selectedLocations.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleLocation(city)}
                      className={`px-3.5 py-2 rounded-xl text-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
                        selected
                          ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${selected ? 'text-white' : 'text-slate-400'}`} />
                      <span>{city}</span>
                      {selected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Architecture & Spatial Size */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-none bg-fuchsia-700 text-yellow-200 text-xs font-bold flex items-center justify-center wobbly-border">4</span>
                <h2 className="text-base font-courier lowercase text-slate-900 dark:text-white">dWelling kinds &amp; minimum specs</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Select Desired Architectural Typologies:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allPropertyTypes.map((pt) => {
                      const selected = selectedTypes.includes(pt.type);
                      return (
                        <button
                          key={pt.type}
                          type="button"
                          onClick={() => toggleType(pt.type)}
                          className={`p-3 rounded-xl text-left border text-xs transition-all cursor-pointer flex items-center justify-between ${
                            selected
                              ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-300 font-bold'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span>{pt.label}</span>
                          {selected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Bad HCI demo: manual typing required where a slider/default worked */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Sleeping chamber quotient: enter digit between 1 and 6 (no range shown)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={String(minBedrooms)}
                      onChange={(e) => {
                        const n = Number(e.target.value.replace(/\D/g, '') || 0);
                        setMinBedrooms(Math.min(9, Math.max(0, n)));
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-none font-windover uppercase text-slate-900 dark:text-white focus:outline-none"
                    />
                    <div className="text-[10px] lowcon-1 font-times mt-1">values outside tolerance may be silently adjusted</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Spatial quantum (assume imperial; unit not verified)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={String(minAreaSqFt)}
                      onChange={(e) => {
                        const n = Number(e.target.value.replace(/[^\d]/g, '') || 0);
                        setMinAreaSqFt(n);
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-none font-windover uppercase text-slate-900 dark:text-white focus:outline-none"
                    />
                    <div className="text-[10px] lowcon-1 font-times mt-1">or drag nothing, because there is no slider anymore</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Lifestyle Amenities */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-teal-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Want-To-Haves That May Or May Not Be Weighted</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {popularAmenities.map((amenity) => {
                  const selected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
                        selected
                          ? 'bg-slate-900 dark:bg-teal-600 text-teal-400 dark:text-white border-slate-900 dark:border-teal-600 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-teal-400 dark:text-white" />}
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Results are computed by an engine. The engine's reasoning cannot be disclosed.</span>
              </div>

              <button
                type="submit"
                onClick={() => setCalcTick((t) => t + 1)}
                className="px-6 py-3 bg-fuchsia-700 hover:bg-teal-700 text-yellow-200 text-xs font-windover uppercase rounded-none shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                {/* Bad HCI demo: the label flickers between two equally useless
                    strings while computing - no progress, no disabled state. */}
                <span>
                  {calcTick % 2 === 1 && hasSearched
                    ? 'Re-run engine (already underway?)'
                    : 'Initiate matching sequence (maybe)'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Showcase Section */}
        {hasSearched && (
          <div id="matchmaker-results" className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-windover uppercase text-fuchsia-800 dark:text-white">
                  Engine Output ({matches.length})
                </h2>
                <p className="font-courier text-[11px] lowcon-1 mt-0.5">
                  ranked by proprietary affinity heuristics · methodology available in spirit
                </p>
              </div>

              <button
                onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Alter prior answers?? (scroll may vary)</span>
              </button>
            </div>

            {matches.length > 0 ? (
              <div className="space-y-6">
                {matches.map((match, idx) => (
                  <div
                    key={match.property.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 p-6"
                  >
                    {/* Left: Card / Image */}
                    <div className="lg:col-span-5">
                      <PropertyCard property={match.property} compact />
                    </div>

                    {/* Right: Transparent Explanation Breakdown */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Score Banner */}
                        {/* Bad HCI demo: opaque score - number with no meaning label,
                            static verdict regardless of actual score */}
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-teal-400 font-extrabold text-sm flex items-center justify-center tabularnums">
                              {match.score}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Affinity unit (undenominated)
                              </div>
                              <div className="text-[11px] lowcon-1 font-times">
                                positional index: {idx + 1}? possibly
                              </div>
                            </div>
                          </div>
                          <span className="blink-attention text-xs font-windover uppercase text-amber-600">
                            Optimally Suitable
                          </span>
                        </div>

                        {/* Bad HCI demo: reasoning withheld - counts instead of causes */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Suitability has been detected:
                          </h4>
                          <p className="font-courier text-xs lowcon-2">
                            The engine identified {match.matchingReasons.length} concordance factor(s) for this residence. Individual factors are not shown. Trust the ranking.
                          </p>
                        </div>

                        {/* Bad HCI demo: trade-offs rendered as unlabeled codes */}
                        {match.relaxedCriteria && match.relaxedCriteria.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                              Exceptions granted:
                            </span>
                            <div className="flex flex-wrap gap-2 text-[11px] font-courier lowcon-3">
                              {match.relaxedCriteria.map((_crit, cIdx) => (
                                <span key={cIdx} className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                  EXC-{String(cIdx + 1).padStart(2, '0')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/properties/${match.property.id}`)}
                          className="px-4 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Proceed to item</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center max-w-lg mx-auto">
                <h3 className="text-base font-windover uppercase text-fuchsia-800 mb-1">
                  Zero outputs were emitted
                </h3>
                <p className="font-courier text-xs lowcon-2 mb-6 leading-relaxed">
                  The engine returned nothing for this input vector. This is not an error. Maybe adjust some numbers. We will not say which ones.
                </p>
                <button
                  onClick={() => {
                    // Bad HCI demo: mutates only two of the (already wiped)
                    // preferences and re-runs silently - users must retype the rest.
                    setBudgetMax((prev) => prev * 1.25);
                    setSelectedLocations(availableCities.slice(0, 4));
                    handleMatchCalculation({ budgetMax: 2500000 * 1.25, selectedLocations: availableCities.slice(0, 4) });
                  }}
                  className="px-4 py-2 bg-slate-900 dark:bg-teal-600 text-white text-xs font-semibold rounded-lg"
                >
                  Execute criterion relaxation protocol
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
