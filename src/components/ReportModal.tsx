import React, { useState } from 'react';
import { Listing, User } from '../types';
import { Flag, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (listingId: string, reason: string, details: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState('fake_pop_attempt');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(listing.id, reason, details);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-stone-200 bg-red-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-sm text-stone-900">Report to Campus Security</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 text-sm"
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-stone-900 text-sm">Report Dispatched to CPS</h4>
            <p className="text-xs text-stone-500">
              Campus Protection Services and the automated AI shield will investigate immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
              Reporting: <strong className="text-stone-900">{listing.title}</strong> by {listing.seller.name}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Reason for Flagging</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
              >
                <option value="fake_pop_attempt">Suspected Fake Proof of Payment (PoP) Scam</option>
                <option value="offplatform_redirect">Soliciting Off-Platform WhatsApp / Direct Wire</option>
                <option value="counterfeit">Suspected Stolen or Counterfeit Goods</option>
                <option value="abnormal_pricing">Unrealistic Price Anomaly (Phishing Trap)</option>
                <option value="inappropriate">Prohibited or Inappropriate Campus Item</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Additional Context / Evidence</label>
              <textarea
                rows={3}
                required
                placeholder="Describe what occurred, SMS messages received, or why this appears suspicious..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Submit Incident Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
