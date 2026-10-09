import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, CheckCircle2, GraduationCap, Building2, MapPin, Mail, Sparkles } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onVerificationComplete: (updatedUser: User) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onVerificationComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'vendor' | 'resident'>(
    currentUser.role === 'vendor' ? 'vendor' : currentUser.role === 'resident' ? 'resident' : 'student'
  );

  // Student form state
  const [studentEmail, setStudentEmail] = useState(currentUser.email || '');
  const [studentNumber, setStudentNumber] = useState('');
  const [studentCampus, setStudentCampus] = useState(currentUser.campusOrArea || 'University of Cape Town (UCT)');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Vendor form state
  const [cipcNumber, setCipcNumber] = useState('2024/782910/07');
  const [businessName, setBusinessName] = useState('Campus Supplies & Services PTY LTD');
  const [taxNumber, setTaxNumber] = useState('9847120391');

  // Resident form state
  const [residentAddress, setResidentAddress] = useState('14 Main Road, Rondebosch, Cape Town');
  const [suburb, setSuburb] = useState('Rondebosch (Adjacent to UCT)');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (!studentEmail.includes('.ac.za')) {
        alert('Please enter a valid South African university email ending in .ac.za (e.g. name@myuct.ac.za, name@students.wits.ac.za)');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setOtpSent(true);
      }, 700);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMessage('Student identity verified via university domain!');
        const updatedUser: User = {
          ...currentUser,
          role: 'student',
          verificationStatus: 'verified',
          campusOrArea: studentCampus,
          institution: studentCampus,
          studentOrStaffId: studentNumber || 'STU2025-ZA',
          trustScore: Math.min(100, currentUser.trustScore + 20),
          badgeLabel: `${studentCampus.split(' ')[0]} Student · Verified .ac.za`,
        };
        setTimeout(() => {
          onVerificationComplete(updatedUser);
          onClose();
        }, 1200);
      }, 800);
    }
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('CIPC Enterprise registration confirmed with SARS & Campus Authority!');
      const updatedUser: User = {
        ...currentUser,
        role: 'vendor',
        verificationStatus: 'verified',
        cipcNumber: cipcNumber,
        institution: `CIPC Reg: ${cipcNumber}`,
        trustScore: 99,
        badgeLabel: 'CIPC Verified SA Vendor',
      };
      setTimeout(() => {
        onVerificationComplete(updatedUser);
        onClose();
      }, 1200);
    }, 900);
  };

  const handleResidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Campus-adjacent residential proof verified!');
      const updatedUser: User = {
        ...currentUser,
        role: 'resident',
        verificationStatus: 'verified',
        campusOrArea: suburb,
        trustScore: 95,
        badgeLabel: `Verified Resident (${suburb.split(' ')[0]})`,
      };
      setTimeout(() => {
        onVerificationComplete(updatedUser);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Campus Verification Centre</h2>
              <p className="text-xs text-stone-500">Protecting South African campuses from fraud & fake accounts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-3 bg-stone-100/70 border-b border-stone-200 flex gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setOtpSent(false);
            }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'student'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Student (.ac.za)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vendor')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'vendor'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Vendor (CIPC)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resident')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'resident'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <MapPin className="w-4 h-4 text-purple-600" />
            <span>Local Resident</span>
          </button>
        </div>

        <div className="p-5">
          {successMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Verification Successful!</h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">{successMessage}</p>
              <div className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" /> Trust Score boosted to 98%
              </div>
            </div>
          ) : activeTab === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl text-xs text-blue-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-700" /> South African University Email Verification
                </div>
                <p className="text-blue-800/90 leading-relaxed">
                  Enter your official institution email ending in <strong className="font-semibold">.ac.za</strong> (e.g. UCT, Wits, Maties, UJ, Tuks, UKZN). We send an instantaneous OTP verification code to confirm active enrollment.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Select Your University Campus
                </label>
                <select
                  value={studentCampus}
                  onChange={(e) => setStudentCampus(e.target.value)}
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
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Official Student Email (.ac.za)
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sipho.dlamini@myuct.ac.za"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  disabled={otpSent}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:bg-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Student Number / Campus Card ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. DLMSIP004 or u21948201"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  disabled={otpSent}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:bg-stone-100"
                />
              </div>

              {otpSent && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 animate-in fade-in">
                  <label className="block text-xs font-semibold text-stone-800">
                    Enter 6-Digit OTP Code (Simulated demo code: 748291)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 748291"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono tracking-widest text-center rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-stone-500">
                    A code was simulated to <span className="font-semibold text-stone-700">{studentEmail}</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Verifying with Campus Directory...'
                  : otpSent
                  ? 'Confirm OTP & Activate Verified Badge'
                  : 'Send Verification Code to Student Email'}
              </button>
            </form>
          ) : activeTab === 'vendor' ? (
            <form onSubmit={handleVendorSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-700" /> CIPC Business Registration Verification
                </div>
                <p className="text-amber-800/90 leading-relaxed">
                  Vendors must register an official South African Companies and Intellectual Property Commission (CIPC) enterprise number to sell food, tech, or supplies.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Registered Business Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  CIPC Registration Number (YYYY/NNNNNN/NN)
                </label>
                <input
                  type="text"
                  required
                  value={cipcNumber}
                  onChange={(e) => setCipcNumber(e.target.value)}
                  placeholder="e.g. 2021/847291/07"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  SARS Tax / VAT Reference
                </label>
                <input
                  type="text"
                  required
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Cross-referencing CIPC Registry...' : 'Validate CIPC & Receive Vendor Badge'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResidentSubmit} className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200/80 rounded-xl text-xs text-purple-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-700" /> Campus Neighborhood Residence Verification
                </div>
                <p className="text-purple-800/90 leading-relaxed">
                  Residents living in campus suburbs can participate in community trading with verified neighborhood badge status.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nearby University Suburb
                </label>
                <input
                  type="text"
                  required
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="e.g. Rondebosch, Braamfontein, Stellenbosch Central"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Physical Residential Address
                </label>
                <input
                  type="text"
                  required
                  value={residentAddress}
                  onChange={(e) => setResidentAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Validating Address...' : 'Verify Residential Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
