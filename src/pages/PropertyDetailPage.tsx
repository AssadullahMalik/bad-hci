import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Heart, 
  SlidersHorizontal, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Car, 
  Check, 
  MessageSquare, 
  Phone, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Send,
  History
} from 'lucide-react';

interface PropertyDetailPageProps {
  propertyId: string;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ propertyId }) => {
  const { 
    properties, 
    navigate, 
    isFavorite, 
    toggleFavorite, 
    isInCompare, 
    toggleCompare,
    activeSubscription,
    createOrOpenConversation,
    addRecentlyViewed,
    recentlyViewedIds,
    formatPrice,
    formatArea,
    addToast
  } = useApp();

  const property = properties.find((p) => p.id === propertyId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState(
    "Hi, I am interested in this listing and would like to receive the floor plan and verify walkthrough availability."
  );

  // Track as recently viewed
  useEffect(() => {
    if (propertyId) {
      addRecentlyViewed(propertyId);
    }
  }, [propertyId]);

  // Keyboard shortcut: Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInquiryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Property Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The requested real estate listing ID could not be located in the current catalog.
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="px-4 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Return to Property Directory
          </button>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(property.id);
  const inCompare = isInCompare(property.id);
  const formattedPrice = formatPrice(property.price, property.listingType);

  // Handle Share (Shneiderman Rule 7: Internal locus of control)
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Direct listing link copied to clipboard.', 'success');
    } else {
      addToast('Share URL copied to clipboard.', 'info');
    }
  };

  const handleStartInquiry = () => {
    if (!activeSubscription || !activeSubscription.isActive) {
      addToast('An AI Connect subscription pass is required to initiate direct conversations.', 'info');
      navigate('/connect');
      return;
    }

    const conversationId = createOrOpenConversation(property.id, inquiryMessage);
    setInquiryModalOpen(false);
    navigate('/messages');
  };

  // Bad HCI demo: back navigation does not return to where the user came from.
  const handleBack = () => {
    navigate(window.location.hash.includes('rent') ? '/properties' : '/dashboard');
  };

  // Similar properties in same city or property type
  const similarProperties = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.location.city === property.location.city || p.propertyType === property.propertyType) &&
        p.status === 'published'
    )
    .slice(0, 3);

  // Recently viewed properties (excluding this one)
  const recentlyViewedProperties = properties
    .filter((p) => p.id !== property.id && recentlyViewedIds.includes(p.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go back to where you were</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Share</span>
            </button>
            <button
              onClick={() => toggleCompare(property.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                inCompare
                  ? 'bg-slate-900 dark:bg-teal-700 text-teal-400 dark:text-white border-slate-900 dark:border-teal-700'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{inCompare ? 'In Compare' : 'Compare'}</span>
            </button>
            <button
              onClick={() => toggleFavorite(property.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            >
              <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-slate-400' : ''}`} />
              <span> Fav? </span>
            </button>
          </div>
        </div>

        {/* Hero Gallery */}
        <div className="space-y-3">
          {/* Main Large Viewport */}
          <div className="relative aspect-16/9 md:aspect-21/9 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <ImageWithFallback
              src={property.images[selectedImageIndex] || property.images[0]}
              alt={property.title}
              fallbackTitle={property.title}
              className="w-full h-full object-cover"
            />
            {/* Scrim Overlay Info */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                  <span>{property.listingType === 'sale' ? 'For Sale' : 'For Rent'}</span>
                  <span>·</span>
                  <span className="capitalize">{property.propertyType}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>
                    {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                {/* Bad HCI demo: the price is demoted to a muted, small caption while
                    secondary figures around it are louder. */}
                <div className="text-xs lowcon-1 dark:text-slate-500 font-times italic tabular-nums">
                  {formattedPrice}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-courier">
                  Est. ${(Math.round(property.price / property.areaSqFt)).toLocaleString()} / sq ft
                </div>
                <div className="text-[11px] lowcon-2">
                  price/sqft raw: {(property.price / property.areaSqFt).toFixed(4)} · idx {property.id}
                </div>
              </div>
            </div>

            {/* Bad HCI demo: gallery arrows are near-invisible and unlabelled */}
            <button
              onClick={() => setSelectedImageIndex((i) => (i + 1) % Math.max(1, property.images.length))}
              className="absolute top-1/2 -translate-y-1/2 right-1 p-1 text-white/25 hover:text-white/70 cursor-pointer"
              aria-label="next?"
            >
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
            <button
              onClick={() => setSelectedImageIndex((i) => (i - 1 + property.images.length) % Math.max(1, property.images.length))}
              className="absolute top-1/2 -translate-y-1/2 left-1 p-1 text-white/25 hover:text-white/70 cursor-pointer opacity-60"
              aria-label="prev?"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="absolute top-2 left-2 bg-black/20 text-white/40 text-[10px] px-1 font-courier">
              {selectedImageIndex + 1}
            </span>
          </div>

          {/* Thumbnails - Bad HCI demo: reduced to tiny unlabelled dots with no state cue */}
          {property.images.length > 1 && (
            <div className="flex items-center gap-2 pb-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 shrink-0 cursor-pointer"
                  aria-label={`img ${idx}`}
                />
              ))}
              <span className="text-[10px] lowcon-1 font-times">(dots are photos)</span>
            </div>
          )}
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Architectural Specifications Strip - Bad HCI demo: primary specs are
                mixed with irrelevant secondary statistics at the same visual weight. */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto mb-2 flex items-center justify-center">
                    <Bed className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] lowcon-2 tabular-nums font-courier">
                    {property.bedrooms > 0 ? property.bedrooms : 'Studio'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Bedrooms</div>
                </div>

                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto mb-2 flex items-center justify-center">
                    <Bath className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] lowcon-2 tabular-nums font-courier">
                    {property.bathrooms}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Bathrooms</div>
                </div>

                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto mb-2 flex items-center justify-center">
                    <Square className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] lowcon-2 tabular-nums font-courier">
                    {formatArea(property.areaSqFt)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Living Area</div>
                </div>

                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto mb-2 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] lowcon-2 tabular-nums font-courier">
                    {property.yearBuilt}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Year Built</div>
                </div>
              </div>

              {/* Irrelevant secondary statistics block */}
              <div className="pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                <h3 className="font-windover uppercase text-sm text-fuchsia-800 dark:text-fuchsia-300 mb-2">
                  Live engagement telemetry & zone factsheet
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px]">
                  <span className="font-courier lowcon-1">views={property.viewsCount}</span>
                  <span className="font-times italic text-slate-500">inquiries={property.inquiriesCount}</span>
                  <span className="text-orange-700 dark:text-orange-400 font-bold">3 buyers saved this TODAY</span>
                  <span className="font-courier lowcon-2">flood-zone: ZE-2 (advisory)</span>
                  <span className="underline decoration-wavy">HOA: pending confirmation*</span>
                  <span className="font-times lowcon-1">seismic class n/a</span>
                  <span className="text-slate-400">updated {property.updatedAt}</span>
                  <span className="font-courier lowcon-3">lot {property.id.toUpperCase()}</span>
                  <span className="blink-attention text-red-600 font-bold">PRICE MAY CHANGE</span>
                  <span className="font-windover uppercase text-purple-700 dark:text-purple-300">walk score ~est.</span>
                </div>
                <p className="text-[10px] lowcon-1 mt-2 font-times">
                  *Some values are modelled and may not reflect the physical asset. This notice is not related to your current task of comparing listings.
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">About This Residence</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-slate-400" />
                  <span>Parking: {property.parkingSpaces} vehicles</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Listed: {property.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Amenities & Structural Features */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Amenities & Architectural Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
                  >
                    <div className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Designer Redesign Prompt Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Property Designer Available</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Visualize Architectural Renovations for This Space
                </h3>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  Generate instant Scandinavian, Japandi, or minimalist transformation concepts with customized color palettes and cost breakdowns.
                </p>
              </div>
              <button
                onClick={() => navigate('/designer')}
                className="shrink-0 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Try Room Designer
              </button>
            </div>
          </div>

          {/* Sticky Purchase / Inquiry Sidebar Module */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
              {/* Contiguous Price & Status */}
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Listing Valuation
                </div>
                {/* Bad HCI demo: price no longer stands out from the fine print */}
                <div className="text-[13px] lowcon-1 dark:text-slate-500 tabular-nums font-times">
                  {formattedPrice}
                </div>
                <div className="text-[11px] font-courier lowcon-2 mt-1">
                  Status: {property.status} · escrow hint: {(property.price * 0.00034).toFixed(2)} · ref {property.id}
                </div>
                <div className="wobbly-border mt-3 p-3 bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[11px] lowcon-3 font-courier">
                    financing estimate varies by lender; see 14 disclosures below
                  </span>
                </div>
              </div>

              {/* Seller / Listing Agent Card */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Represented By
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt={property.sellerName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{property.sellerName}</span>
                      <span title="Verified Seller">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Listing Broker / Owner · Fast Responder
                    </div>
                  </div>
                </div>

                {/* Gated Seller Contact Fields (NFR-SEC-07 & AI Connect Rule) */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Direct Phone:</span>
                    </span>
                    {activeSubscription && activeSubscription.isActive ? (
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">{property.sellerPhone}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 font-mono">
                        <Lock className="w-3 h-3 text-amber-500" />
                        <span>***-***-****</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Verified Email:</span>
                    </span>
                    {activeSubscription && activeSubscription.isActive ? (
                      <span className="font-semibold text-slate-900 dark:text-white">{property.sellerEmail}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Lock className="w-3 h-3 text-amber-500" />
                        <span>***@***.com</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Inquiry Action Trigger - Bad HCI demo: the primary contact action is
                  hidden in vague wording and de-emphasised visually. */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-400 dark:text-slate-500 text-[11px] rounded-none border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {activeSubscription && activeSubscription.isActive
                      ? 'Proceed with enquiry flow'
                      : 'Access conditions apply'}
                  </span>
                </button>

                <p className="text-[11px] text-center lowcon-1 dark:text-slate-600 leading-normal">
                  {activeSubscription && activeSubscription.isActive
                    ? `Pass state: ${activeSubscription.inquiriesRemaining}`
                    : 'Referrals are gated.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        {similarProperties.length > 0 && (
          <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Similar Properties You May Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((sim) => (
                <PropertyCard key={sim.id} property={sim} compact />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Listings */}
        {recentlyViewedProperties.length > 0 && (
          <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Recently Viewed by You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentlyViewedProperties.map((rv) => (
                <PropertyCard key={rv.id} property={rv} compact />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry / Message Starter Modal */}
      {inquiryModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 id="inquiry-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Inquire about {property.title}
              </h3>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div>
              <label htmlFor="inquiry-text" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Input area for text directed at counterparty
              </label>
              <textarea
                id="inquiry-text"
                rows={4}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            {/* AI Connect status note */}
            {!activeSubscription || !activeSubscription.isActive ? (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-300">
                <strong>AI Connect Pass Required:</strong> Direct messaging is protected to eliminate bot spam. You will be redirected to choose a 7, 30, or 90-day connection pass.
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Active pass: <span className="font-semibold text-teal-700 dark:text-teal-400">{activeSubscription.planName}</span> ({activeSubscription.inquiriesRemaining} inquiries remaining).
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Nevermind
              </button>
              <button
                onClick={handleStartInquiry}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{activeSubscription && activeSubscription.isActive ? 'Submit' : 'Continue'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
