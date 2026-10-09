import React from 'react';
import { Listing } from '../types';
import { formatZAR } from '../utils/fraudDetection';
import { ShieldCheck, MapPin, AlertTriangle, ArrowLeftRight, Heart, Sparkles } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onQuickChat: (listing: Listing) => void;
  onToggleSave: (listingId: string) => void;
  isSaved?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelect,
  onQuickChat,
  onToggleSave,
  isSaved = false,
}) => {
  const isFlagged = listing.status === 'flagged' || listing.fraudRiskScore >= 60;

  return (
    <article
      onClick={() => onSelect(listing)}
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer hover:shadow-md ${
        isFlagged
          ? 'border-red-300 bg-red-50/20'
          : 'border-stone-200/80 hover:border-stone-300'
      }`}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
          loading="lazy"
        />

        {/* Flagged warning banner */}
        {isFlagged && (
          <div className="absolute inset-x-0 top-0 bg-red-600 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> High Risk / Scam Warning
            </span>
            <span className="text-[10px] uppercase tracking-wider font-mono">Flagged</span>
          </div>
        )}

        {/* Type indicator (Trade / Free) */}
        {!isFlagged && listing.type === 'trade' && (
          <div className="absolute top-2.5 left-2.5 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs">
            <ArrowLeftRight className="w-3 h-3 text-amber-400" />
            <span>Open to Swap</span>
          </div>
        )}

        {!isFlagged && listing.type === 'free' && (
          <div className="absolute top-2.5 left-2.5 bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-white" />
            <span>Campus Giveaway</span>
          </div>
        )}

        {/* Save button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(listing.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all shadow-xs ${
            isSaved
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 backdrop-blur-xs text-stone-600 hover:bg-white hover:text-stone-900'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          {/* Unboxed clean metadata kicker (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1.5 line-clamp-1">
            <span className="font-medium text-stone-700 capitalize">{listing.category.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{listing.condition.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.createdAt}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-stone-900 text-sm line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
            {listing.title}
          </h3>

          {/* Campus Location */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-2">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{listing.campus}</span>
          </div>
        </div>

        {/* Price & Seller Row */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-stone-900">
                {formatZAR(listing.price)}
              </span>
              {listing.originalPrice && listing.originalPrice > listing.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatZAR(listing.originalPrice)}
                </span>
              )}
            </div>

            {/* Seller trust snippet */}
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-stone-600">
              <span className="truncate max-w-[110px] font-medium">{listing.seller.name}</span>
              {listing.seller.verificationStatus === 'verified' && (
                <span title="Verified Campus Identity" className="inline-flex">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </span>
              )}
              <span>·</span>
              <span className="text-stone-500">{listing.seller.trustScore}% Trust</span>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickChat(listing);
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors shrink-0"
          >
            Chat
          </button>
        </div>
      </div>
    </article>
  );
};
