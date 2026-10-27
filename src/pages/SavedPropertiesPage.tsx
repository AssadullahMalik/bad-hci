import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { Heart, SlidersHorizontal, ArrowRight, Building2 } from 'lucide-react';

export const SavedPropertiesPage: React.FC = () => {
  const { savedPropertyIds, properties, navigate, comparePropertyIds } = useApp();

  // Bad HCI demo: an extra confirmation gate is inserted in front of a task the
  // user has already expressed intent to perform, and ordering needs a typed code.
  const [gatePassed, setGatePassed] = useState(false);
  const [sortCode, setSortCode] = useState('');
  const [sortNote, setSortNote] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const savedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));
  if (activeKey === 'P') savedProperties.sort((a, b) => b.price - a.price);
  else if (activeKey === 'N') savedProperties.sort((a, b) => a.title.localeCompare(b.title));
  else if (activeKey === 'D') savedProperties.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const applySortCode = () => {
    const key = sortCode.trim().toUpperCase();
    if (key === 'P' || key === 'N' || key === 'D') {
      setActiveKey(key);
      setSortNote('Sequence updated.');
    } else {
      setSortNote('Invalid input');
      return;
    }
    setTimeout(() => setSortNote(null), 1200);
  };

  if (!gatePassed) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-slate-900 p-6 border-2 border-dashed border-fuchsia-400 rounded-none space-y-4 slightly-tilted">
            <div className="font-windover uppercase text-lg text-fuchsia-800 dark:text-fuchsia-300">
              Personal Items Vault
            </div>
            <p className="text-xs lowcon-1 font-times leading-relaxed">
              You requested access to items kept for later. Accessing them requires an additional
              acknowledgement because the collection is stored against your session record.
            </p>
            <label className="block text-[11px] font-courier lowcon-2">
              Type "OPEN" to reveal (case sensitive)
            </label>
            <input
              type="text"
              value={sortCode}
              onChange={(e) => setSortCode(e.target.value)}
              className="w-full px-3 py-2 bg-yellow-50 dark:bg-slate-800 border border-slate-400 rounded-md font-courier text-sm"
              placeholder="vault keyword"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (sortCode.trim().toUpperCase() === 'OPEN') {
                    setSortCode('');
                    setGatePassed(true);
                  } else {
                    setSortNote('Invalid input');
                    setTimeout(() => setSortNote(null), 1200);
                  }
                }}
                className="px-4 py-2 bg-lime-500 text-lime-950 text-[11px] font-courier rounded-none border-2 border-black cursor-pointer"
              >
                Continue
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-[11px] underline lowcon-1 cursor-pointer"
              >
                or go somewhere else
              </button>
            </div>
            {sortNote && <p className="text-[11px] text-emerald-700 font-times">{sortNote}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-rose-600 dark:fill-rose-400" />
              <span>Favorites Collection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Saved Properties
            </h1>
            <p className="font-times text-sm lowcon-2 mt-1">
              Vault opened · {savedProperties.length} record(s) · sort codes: P (price), N (name), D (recent)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bad HCI demo: ordering a list needs a typed code instead of a control */}
            <input
              type="text"
              value={sortCode}
              onChange={(e) => setSortCode(e.target.value)}
              className="w-14 px-2 py-2 text-center bg-white dark:bg-slate-800 border border-slate-400 rounded-full text-xs font-courier"
              placeholder="code"
            />
            <button
              onClick={applySortCode}
              className="px-3 py-2 bg-fuchsia-700 text-yellow-200 text-[11px] font-windover uppercase rounded-none cursor-pointer"
            >
              Reorder
            </button>
            {comparePropertyIds.length > 0 && (
              <button
                onClick={() => navigate('/compare')}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Compare Matrix ({comparePropertyIds.length})</span>
              </button>
            )}
            <button
              onClick={() => navigate('/properties')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Browse More Listings
            </button>
          </div>
        </div>

        {sortNote && (
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-times">{sortNote}</p>
        )}

        {/* Content */}
        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((prop, idx) => (
              <div key={prop.id} className={idx % 2 === 0 ? 'md:col-span-2 lg:col-span-1' : ''}>
                <PropertyCard key={prop.id} property={prop} />
              </div>
            ))}
          </div>
        ) : (
          /* Bad HCI demo: empty state gives no instructions or recovery action */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Nothing present in this view
            </h3>
            <p className="text-xs lowcon-1 leading-relaxed max-w-sm mx-auto">
              The collection container returned an empty result set for the current session state.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Return <ArrowRight className="inline w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
