import React, { useState } from 'react';
import { Listing } from '../types';
import { formatZAR, analyzeListingRisk } from '../utils/fraudDetection';
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  ArrowLeftRight,
  MessageSquare,
  ShoppingCart,
  Flag,
  Share2,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Building2,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (listing: Listing) => void;
  onAddToCart: (listing: Listing) => void;
  onReport: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  onStartChat,
  onAddToCart,
  onReport,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !listing) return null;

  const riskAnalysis = analyzeListingRisk(
    listing.title,
    listing.description,
    listing.price,
    listing.category,
    listing.seller.verificationStatus === 'verified'
  );

  const isFlagged = listing.status === 'flagged' || listing.fraudRiskScore >= 60;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-700 capitalize">{listing.category.replace('_', ' ')}</span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{listing.campus}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-lg text-xs flex items-center gap-1"
              title="Share listing link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={() => onReport(listing)}
              className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs flex items-center gap-1"
              title="Report suspicious listing"
            >
              <Flag className="w-4 h-4" />
              <span className="hidden sm:inline">Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg text-sm ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Flagged Banner */}
        {isFlagged && (
          <div className="p-3 bg-red-600 text-white text-xs flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">CAMPUS PROCTOR FRAUD ALERT:</span> This listing contains patterns typical of off-platform scams or fake proof of payment solicitations. Do not make any direct transfers.
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left: Images */}
          <div className="space-y-3">
            <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80">
              <img
                src={listing.images[selectedImageIdx] || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>

            {listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIdx === idx ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Campus Safe Meetup Zone Card */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Verified Campus Safe Handover Zone</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                {listing.safeMeetupSpot}
              </p>
              <p className="text-[11px] text-emerald-700/80">
                Monitored by Campus Protection Services (CPS). Never agree to meet in isolated off-campus parking lots.
              </p>
            </div>
          </div>

          {/* Right: Details & Seller Profile */}
          <div className="space-y-4">
            {/* Title & Metadata */}
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <span className="font-semibold text-stone-800 capitalize">{listing.condition.replace('_', ' ')} condition</span>
                <span>·</span>
                <span className="capitalize">{listing.type} listing</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {listing.title}
              </h1>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2.5 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-2xl font-black text-stone-900">
                {formatZAR(listing.price)}
              </span>
              {listing.originalPrice && listing.originalPrice > listing.price && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 line-through">
                    {formatZAR(listing.originalPrice)}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Save {Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">Description</h2>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-stone-100">
                {listing.description}
              </p>
            </div>

            {/* Swap preferences */}
            {listing.swapPreferences && (
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <ArrowLeftRight className="w-4 h-4 text-amber-700" /> Swap Preference
                </div>
                <p className="text-amber-800">{listing.swapPreferences}</p>
              </div>
            )}

            {/* Seller Credibility Box */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Seller Trust & Credibility
              </div>
              <div className="flex items-start gap-3">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-900 text-sm truncate">{listing.seller.name}</span>
                    {listing.seller.verificationStatus === 'verified' && (
                      <span title="Verified Campus Identity" className="inline-flex">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-600 font-medium">{listing.seller.badgeLabel}</div>
                  {listing.seller.studentOrStaffId && (
                    <div className="text-[11px] font-mono text-stone-500">ID: {listing.seller.studentOrStaffId}</div>
                  )}
                  {listing.seller.cipcNumber && (
                    <div className="text-[11px] font-mono text-stone-500">CIPC: {listing.seller.cipcNumber}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/80 text-center text-xs">
                <div>
                  <div className="font-extrabold text-stone-900">{listing.seller.trustScore}%</div>
                  <div className="text-[10px] text-stone-500">Trust Score</div>
                </div>
                <div>
                  <div className="font-extrabold text-stone-900">{listing.seller.dealsCompleted}</div>
                  <div className="text-[10px] text-stone-500">Campus Trades</div>
                </div>
                <div>
                  <div className="font-extrabold text-stone-900">{listing.seller.rating} ★</div>
                  <div className="text-[10px] text-stone-500">({listing.seller.reviewsCount} reviews)</div>
                </div>
              </div>
            </div>

            {/* CPS Campus Safety Verification */}
            <div className={`p-3.5 rounded-xl border text-xs space-y-2 ${
              riskAnalysis.riskLevel === 'high'
                ? 'bg-red-50 border-red-300 text-red-900'
                : riskAnalysis.riskLevel === 'medium'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> CPS Campus Safety Verification
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/70">
                  Status: {riskAnalysis.riskLevel === 'high' ? 'High Risk / Unverified' : riskAnalysis.riskLevel === 'medium' ? 'Caution Advised' : 'Safe Campus Meetup'}
                </span>
              </div>

              {riskAnalysis.flags.length > 0 ? (
                <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
                  {riskAnalysis.flags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-emerald-800">
                  ✓ Verified against campus security guidelines. Safe handover available at designated security checkpoint.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartChat(listing);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-900 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-stone-600" />
                <span>Chat & Negotiate</span>
              </button>

              <button
                type="button"
                disabled={isFlagged}
                onClick={() => {
                  onAddToCart(listing);
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{listing.type === 'free' ? 'Claim Giveaway' : 'Buy with Mzansi Escrow'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
