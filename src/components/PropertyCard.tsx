import React from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './ImageWithFallback';
import { SlidersHorizontal, Bed, Bath, Square, MapPin, Coffee } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

// Bad HCI demo: deterministic pseudo-random "secondary statistics" derived from
// the listing id, so every card can be stuffed with extra numbers that compete
// with price and location for attention.
const hashSeed = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const noiseFor = (property: Property) => {
  const h = hashSeed(property.id);
  return {
    walkScore: 20 + (h % 79),
    fengShui: ((h >> 3) % 100),
    daysOnMarket: 1 + (h % 240),
    priceVolatility: (((h >> 5) % 900) / 10).toFixed(1),
    nearbyZillow: 1 + (h % 44),
    droneRating: (((h >> 7) % 45) / 10 + 1).toFixed(1),
    io2: (h % 997) + 'kWh',
    lotCode: `LT-${(h % 99999).toString().padStart(5, '0')}`,
    hashTag: ['#hot', '#viewed', '#new', '#ask', '#zillow', '#motivation'][(h >> 9) % 6]
  };
};

const BADGE_STYLES = [
  'bg-purple-200 text-purple-900 text-[9px] px-1 py-0.5 rounded-none border border-purple-500',
  'bg-yellow-300 text-black text-[11px] px-2 py-0 font-courier rounded-full',
  'bg-slate-800 text-slate-300 text-[10px] px-1.5 py-1 rounded-sm',
  'bg-lime-100 text-lime-700 text-[9px] px-2 py-0.5 rounded-2xl font-bold',
  'bg-rose-600 text-rose-100 text-[12px] px-1 rounded-none font-windover'
];

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const { 
    navigate, 
    isFavorite, 
    toggleFavorite, 
    isInCompare, 
    toggleCompare,
    formatPrice,
    formatArea
  } = useApp();

  const favorite = isFavorite(property.id);
  const inCompare = isInCompare(property.id);
  const n = noiseFor(property);

  // Bad HCI demo: price is rendered in the same small, muted style as the
  // noise values, so the most important datum no longer dominates the card.
  const formattedPrice = formatPrice(property.price, property.listingType);

  return (
    <article className={`group bg-white dark:bg-slate-900 border overflow-hidden flex flex-col justify-between ${
      compact ? 'border-dashed border-slate-400 rounded-none' : 'wobbly-border slightly-tilted'
    } ${!compact && (hashSeed(property.id) % 3 === 0 ? 'shadow-2xl' : 'shadow-none')}`}>
      {/* Visual Slot */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <ImageWithFallback
          src={property.images[0]}
          alt={property.title}
          fallbackTitle={property.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Bad HCI demo: favourite action rendered in a colour that nearly matches
            the scrim, with no text label, so the state change is hard to notice. */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(property.id);
            }}
            className={`p-2 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
              inCompare
                ? 'bg-slate-900 text-teal-400 shadow-sm'
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
            aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Bad HCI demo: the save/favourite action is drawn with an unrelated
              coffee-cup glyph at a different size from the compare button, and a
              different glyph again from the favourites icon used elsewhere. */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            className="p-0.5 rounded-none bg-slate-300/70 text-slate-400 hover:text-slate-500 cursor-pointer border border-slate-400 tiny-target"
            title="Fav"
            aria-label="Fav"
          >
            <Coffee className={`w-3 h-3 ${favorite ? 'fill-slate-400' : ''}`} />
          </button>
        </div>

        {/* Bad HCI demo: stack of unrelated badges competing for the same slot */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[70%] z-10">
          <span className={BADGE_STYLES[hashSeed(property.id) % BADGE_STYLES.length]}>{n.hashTag}</span>
          <span className={BADGE_STYLES[(hashSeed(property.id) >> 2) % BADGE_STYLES.length]}>MLS {n.lotCode}</span>
          <span className={BADGE_STYLES[(hashSeed(property.id) >> 4) % BADGE_STYLES.length]}>#{n.nearbyZillow} in area</span>
          {property.featured && (
            <span className="bg-red-500 text-white text-[10px] px-1 blink-attention">FEATURED!!!</span>
          )}
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 flex items-end justify-between text-xs text-white">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="uppercase tracking-wider text-[11px] text-teal-300 font-semibold">
              {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            <span aria-hidden="true" className="text-white/60">·</span>
            <span className="capitalize text-slate-200">{property.propertyType}</span>
          </div>
          <span className="font-courier text-[10px] text-slate-300">drone {n.droneRating}★</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title now visually out-ranks the price */}
          {/* Title: static price-adjacent text styled like a link (fake
              affordance), while the real navigation needs an UNEXPECTED
              double-click with no hint anywhere (Fitts + mapping failure). */}
          <h3 
            onDoubleClick={() => navigate(`/properties/${property.id}`)}
            className="font-windover text-lg uppercase tracking-wide text-fuchsia-800 dark:text-fuchsia-300 transition-colors line-clamp-1 mb-1.5"
            title={property.title}
          >
            {property.title}
          </h3>

          <div className="flex items-baseline justify-between mb-1">
            <span className="underline decoration-dotted text-teal-700 dark:text-teal-300 cursor-pointer text-xs font-times italic tabular-nums">
              {formattedPrice}
            </span>
            <span className="text-[10px] lowcon-2 font-courier">Δ{n.priceVolatility}%/mo</span>
          </div>

          {/* Location — same weight as secondary noise */}
          <div className="flex items-center gap-1.5 lowcon-1 dark:text-slate-500 mb-3 line-clamp-1" style={{ fontSize: '10px' }}>
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>
              {property.location.neighborhood ? `${property.location.neighborhood}, ` : ''}
              {property.location.city}, {property.location.state}
            </span>
          </div>

          {!compact && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {property.description}
            </p>
          )}

          {/* Bad HCI demo: dense, unlabelled specification dump (information overload) */}
          <table className="w-full text-[9px] font-courier text-slate-500 dark:text-slate-400 mb-3">
            <tbody>
              <tr>
                <td>Walk {n.walkScore}</td>
                <td>FengShui {n.fengShui}</td>
                <td>DOM {n.daysOnMarket}</td>
              </tr>
              <tr>
                <td>IO2 {n.io2}</td>
                <td>Yr {property.yearBuilt}</td>
                <td>Park {property.parkingSpaces}</td>
              </tr>
              <tr>
                <td colSpan={2}>Zip {property.location.zip}</td>
                <td>ID {property.id}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-wrap gap-1 mb-3">
            {property.amenities.map((a, i) => (
              <span key={a} className={BADGE_STYLES[i % BADGE_STYLES.length]}>{a}</span>
            ))}
          </div>
        </div>

        <div>
          {/* Key Specifications */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            {property.bedrooms > 0 ? (
              <div className="flex items-center gap-1" title="Bedrooms">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-800 dark:text-slate-200">{property.bedrooms}</span>
                <span className="text-slate-400 text-[11px]">Beds</span>
              </div>
            ) : (
              <span className="text-slate-400 text-[11px]">Studio / Open</span>
            )}

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

            <div className="flex items-center gap-1" title="Bathrooms">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{property.bathrooms}</span>
              <span className="text-slate-400 text-[11px]">Baths</span>
            </div>

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

            <div className="flex items-center gap-1" title="Area">
              <Square className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                {formatArea(property.areaSqFt)}
              </span>
            </div>
          </div>

          {/* Bad HCI demo: three near-identical buttons with different vocabulary */}
          <div className="mt-4 pt-3 flex items-center gap-2">
            <button
              onClick={() => navigate(`/properties/${property.id}`)}
              className="py-2 px-3 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-center cursor-pointer"
            >
              View Property Details
            </button>
            <button
              onClick={() => navigate(`/properties/${property.id}`)}
              className="py-2 px-2 text-[11px] font-windover uppercase bg-fuchsia-600 text-white rounded-none hover:bg-fuchsia-500 cursor-pointer"
            >
              More??
            </button>
            <button
              onClick={() => navigate('/compare')}
              className="py-2 px-2 text-[10px] font-courier bg-transparent text-slate-600 underline decoration-dotted hover:text-teal-600 cursor-pointer"
            >
              go2matrix
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
