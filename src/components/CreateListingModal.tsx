import React, { useState } from 'react';
import { Listing, User, ListingCategory, ListingType, ListingCondition } from '../types';
import { analyzeListingRisk, formatZAR } from '../utils/fraudDetection';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Upload,
  MapPin,
  Tag,
  ArrowLeftRight,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCreateListing: (listing: Listing) => void;
}

const PRESET_SAMPLE_IMAGES: { label: string; url: string }[] = [
  {
    label: 'Textbook / Study Notes',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Scientific Calculator / Gadget',
    url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Dorm Fridge / Microwave Appliance',
    url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Campus Commuter Bicycle',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Fresh Campus Food / Bakery',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Tutoring / Study Session',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Headphones / Tech Accessories',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  },
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateListing,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(250);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(500);
  const [category, setCategory] = useState<ListingCategory>('textbooks');
  const [type, setType] = useState<ListingType>('sale');
  const [condition, setCondition] = useState<ListingCondition>('like_new');
  const [campus, setCampus] = useState(currentUser.campusOrArea || 'University of Cape Town (UCT)');
  const [safeMeetupSpot, setSafeMeetupSpot] = useState(
    'Campus Protection Services (CPS) Desk - Sarah Baartman Hall'
  );
  const [swapPreferences, setSwapPreferences] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState(PRESET_SAMPLE_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Real-time AI fraud detection scan
  const activeImage = customImageUrl.trim() || selectedImageUrl;
  const effectivePrice = type === 'free' ? 0 : price;
  const analysis = analyzeListingRisk(
    title,
    description,
    effectivePrice,
    category,
    currentUser.verificationStatus === 'verified'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newListing: Listing = {
        id: `listing-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        price: effectivePrice,
        originalPrice: type === 'sale' && originalPrice ? originalPrice : undefined,
        category,
        type,
        condition,
        images: [activeImage],
        seller: currentUser,
        campus,
        safeMeetupSpot,
        swapPreferences: type === 'trade' ? swapPreferences : undefined,
        createdAt: 'Just now',
        fraudRiskScore: analysis.riskScore,
        fraudFlags: analysis.flags,
        status: analysis.riskScore >= 60 ? 'flagged' : 'active',
        views: 1,
        saves: 0,
        tags: [category, campus.split(' ')[0], condition],
      };

      onCreateListing(newListing);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Post New Campus Listing</h2>
            <p className="text-xs text-stone-500">
              List for sale, trade, or student giveaway across South African campuses
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Listing Type tabs */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'sale', label: 'For Sale' },
              { id: 'trade', label: 'Trade / Swap' },
              { id: 'free', label: 'Giveaway (Free)' },
              { id: 'service', label: 'Tutoring / Service' },
            ].map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setType(t.id as ListingType)}
                className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                  type === t.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-stone-300 text-stone-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Listing Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Prescribed Financial Accounting 8th Ed (ACC1006)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ListingCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="textbooks">Textbooks & Study Guides</option>
                <option value="electronics">Electronics & Tech</option>
                <option value="dorm_flat">Dorm & Flat Living</option>
                <option value="fashion">Fashion & Thrift</option>
                <option value="food_artisan">Food & Campus Bakery</option>
                <option value="services">Tutoring & Academic Services</option>
                <option value="transport">Bicycles & Campus Transport</option>
                <option value="free_giveaway">Free Giveaways</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ListingCondition)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="brand_new">Brand New / Sealed</option>
                <option value="like_new">Like New (Barely used)</option>
                <option value="good">Good (Light wear)</option>
                <option value="fair">Fair (Usable, well-loved)</option>
              </select>
            </div>
          </div>

          {/* Price (if not free) */}
          {type !== 'free' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Price (ZAR Rands)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">R</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs font-bold rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {type === 'sale' && (
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Original Retail Price (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">R</span>
                    <input
                      type="number"
                      placeholder="e.g. 850"
                      value={originalPrice || ''}
                      onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trade Preferences (if trade) */}
          {type === 'trade' && (
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
                <span>What are you looking to swap for?</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Looking for MAM1000W study guide, or graphing calculator"
                value={swapPreferences}
                onChange={(e) => setSwapPreferences(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe condition, course code, notes, included accessories, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Campus & Safe Meetup Spot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Campus</label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="University of Cape Town (UCT)">University of Cape Town (UCT)</option>
                <option value="Wits University (Braamfontein)">Wits University (Braamfontein)</option>
                <option value="Stellenbosch University (Maties)">Stellenbosch University (Maties)</option>
                <option value="University of Johannesburg (UJ)">University of Johannesburg (UJ)</option>
                <option value="University of Pretoria (Tuks)">University of Pretoria (Tuks)</option>
                <option value="University of KwaZulu-Natal (UKZN)">University of KwaZulu-Natal (UKZN)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Designated Campus Safe Zone
              </label>
              <select
                value={safeMeetupSpot}
                onChange={(e) => setSafeMeetupSpot(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Campus Protection Services (CPS) Desk - Sarah Baartman Hall">
                  CPS Desk - Sarah Baartman Hall
                </option>
                <option value="Chancellor Oppenheimer Library Security Desk">
                  Library Security Desk
                </option>
                <option value="Matrix Student Mall Central Info Desk">Matrix Info Desk</option>
                <option value="Neelsie Student Centre Info Booth">Neelsie Info Booth</option>
                <option value="Auckland Park Kingsway Student Centre Entrance">
                  APK Student Centre Entrance
                </option>
              </select>
            </div>
          </div>

          {/* Photo Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              Choose Product Image (Sample Campus Photo or Custom URL)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
              {PRESET_SAMPLE_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedImageUrl(preset.url);
                    setCustomImageUrl('');
                  }}
                  className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === preset.url
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-stone-900/80 text-[10px] text-white py-0.5 px-1 truncate text-center">
                    {preset.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="url"
              placeholder="Or paste custom image URL (https://...)"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300"
            />
          </div>

          {/* Campus Marketplace Safety Check */}
          <div
            className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
              analysis.riskLevel === 'high'
                ? 'bg-red-50 border-red-300 text-red-900'
                : analysis.riskLevel === 'medium'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Campus Trade Safety Guidelines Check</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-stone-200">
                {analysis.riskLevel === 'high' ? '⚠️ High Risk Warning' : analysis.riskLevel === 'medium' ? 'Review Recommended' : '✓ Verified Safe'}
              </span>
            </div>

            {analysis.flags.length > 0 ? (
              <div className="space-y-1 text-[11px]">
                <div className="font-semibold text-red-800">Campus Guidelines Alert:</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {analysis.flags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-[11px] text-emerald-800">
                ✓ Ready for publication. Meets South African university community guidelines.
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-xs"
            >
              {isSubmitting ? 'Publishing to Campus Hub...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
