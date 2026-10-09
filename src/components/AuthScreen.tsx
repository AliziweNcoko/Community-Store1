import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/mockData';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  GraduationCap,
  Store,
  Home,
  Laptop,
  Smartphone,
  RefreshCw,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
  onExploreAsGuest: () => void;
  layoutMode: 'auto' | 'laptop' | 'phone';
  onChangeLayoutMode: (mode: 'auto' | 'laptop' | 'phone') => void;
}

const MARKET_PICTURES = [
  {
    id: 1,
    tag: 'Craft & Artisan Stalls',
    title: 'Campus Craft & Startup Fair',
    subtitle: 'Handmade student jewelry, beadwork, and campus entrepreneur creations.',
    heroUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    tag: 'Campus Braai & Food Stalls',
    title: 'Braamfontein & Upper Campus Food Market',
    subtitle: 'Daily student lunch combos, charcoal grilled skewers, fresh vetkoek, and snacks.',
    heroUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    tag: 'Student Apparel & Thrift',
    title: 'Varsity Thrift Pop-up & Apparel',
    subtitle: 'Pre-loved hoodies, varsity vintage jackets, denim, and res winter gear.',
    heroUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=1200&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    tag: 'Fresh Farm Produce',
    title: 'Local Community Veggie & Fruit Box',
    subtitle: 'Locally grown organic vegetables, citrus crates, and Cape honey from nearby farms.',
    heroUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    tag: 'Upper Campus Hall Fair',
    title: 'Student Hall Marketplace',
    subtitle: 'Study carrels, textbooks, engineering gear, and student entrepreneur tables.',
    heroUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=240&auto=format&fit=crop&q=80',
  },
];

const DOMAINS = [
  { id: 'uct', name: 'UCT', domain: 'myuct.ac.za', campus: 'University of Cape Town (UCT)' },
  { id: 'wits', name: 'WITS', domain: 'students.wits.ac.za', campus: 'Wits University (Braamfontein)' },
  { id: 'sun', name: 'STELLENBOSCH', domain: 'sun.ac.za', campus: 'Stellenbosch University (Maties)' },
  { id: 'up', name: 'UP', domain: 'tuks.co.za', campus: 'University of Pretoria (Tuks)' },
  { id: 'uj', name: 'UJ', domain: 'student.uj.ac.za', campus: 'University of Johannesburg (UJ)' },
  { id: 'rhodes', name: 'RHODES', domain: 'campus.ru.ac.za', campus: 'Rhodes University' },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onExploreAsGuest,
  layoutMode,
  onChangeLayoutMode,
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [accountRole, setAccountRole] = useState<'student' | 'vendor' | 'faculty' | 'resident'>('student');
  const [activeDomain, setActiveDomain] = useState(DOMAINS[0]);
  const [emailPrefix, setEmailPrefix] = useState('sipho.dlamini');
  const [password, setPassword] = useState('varsity2026');
  const [showPassword, setShowPassword] = useState(false);
  const [outlookOtp, setOutlookOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const photo = MARKET_PICTURES[selectedPhotoIdx];
  const fullEmail = `${emailPrefix ? emailPrefix.split('@')[0] : 'student'}@${activeDomain.domain}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (accountRole === 'vendor') {
        onLoginSuccess(MOCK_USERS.vendor);
      } else if (accountRole === 'faculty') {
        onLoginSuccess(MOCK_USERS.faculty);
      } else if (accountRole === 'resident') {
        onLoginSuccess(MOCK_USERS.resident);
      } else {
        const studentName = emailPrefix
          ? emailPrefix
              .split('.')[0]
              .replace(/^./, (s) => s.toUpperCase()) +
            ' ' +
            (emailPrefix.split('.')[1]
              ? emailPrefix.split('.')[1].replace(/^./, (s) => s.toUpperCase())
              : 'Student')
          : 'Sipho Dlamini';

        const user: User = {
          ...MOCK_USERS.student,
          name: studentName,
          email: fullEmail,
          campusOrArea: activeDomain.campus,
          institution: activeDomain.campus,
          badgeLabel: `${activeDomain.name} Student · Verified .ac.za`,
          verificationStatus: 'verified',
        };
        onLoginSuccess(user);
      }
    }, 600);
  };

  const handleQuickRole = (key: 'student' | 'vendor' | 'faculty' | 'resident' | 'moderator') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(MOCK_USERS[key] || MOCK_USERS.student);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-stone-100 flex flex-col items-center select-none">
      {/* Top Layout Mode Bar (Matching Screenshot Header) */}
      <div className="w-full bg-[#0a1222] border-b border-stone-800/80 px-3 sm:px-6 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-300 text-xs">Layout Mode:</span>
          <div className="flex items-center gap-1.5 bg-[#0e172a] p-1 rounded-xl border border-stone-800">
            <button
              type="button"
              onClick={() => onChangeLayoutMode('auto')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                layoutMode === 'auto'
                  ? 'bg-[#00875a] text-white shadow-xs font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Auto-Detect</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeLayoutMode('laptop')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                layoutMode === 'laptop'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Laptop View</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeLayoutMode('phone')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                layoutMode === 'phone'
                  ? 'bg-amber-500 text-stone-950 shadow-xs font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone View</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onExploreAsGuest}
          className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline"
        >
          Explore as Guest →
        </button>
      </div>

      {/* Main Column */}
      <div className="w-full max-w-[430px] p-2 sm:p-3 space-y-3.5 my-1">
        {/* Hero Card (Matches Screenshot) */}
        <div className="rounded-3xl overflow-hidden shadow-2xl bg-[#0c1424] border border-stone-800/80">
          {/* Main Photo Banner */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden">
            <img
              src={photo.heroUrl}
              alt={photo.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {/* Rich gradient shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424] via-[#0c1424]/40 to-black/30" />

            {/* Badges on top */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-[#00875a] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                <span>🇿🇦</span>
                <span>{photo.tag}</span>
              </span>

              <span className="bg-black/60 backdrop-blur-md text-stone-200 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
                Photo {selectedPhotoIdx + 1} of {MARKET_PICTURES.length}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="absolute bottom-3 inset-x-4 space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                {photo.title}
              </h1>
              <p className="text-xs text-stone-300 font-medium leading-relaxed drop-shadow-xs">
                {photo.subtitle}
              </p>
            </div>
          </div>

          {/* TAP TO VIEW MORE MARKET PICTURES Area */}
          <div className="p-4 pt-2.5 space-y-2.5">
            <div className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              TAP TO VIEW MORE MARKET PICTURES:
            </div>

            {/* Thumbnails Row (Matches Screenshot with 5 pictures) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {MARKET_PICTURES.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPhotoIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedPhotoIdx === idx
                      ? 'border-[#00875a] ring-2 ring-[#00875a]/50 scale-105'
                      : 'border-stone-700 opacity-60 hover:opacity-100 hover:border-stone-500'
                  }`}
                >
                  <img src={item.thumbUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Two Glassmorphism Cards: 100% Verified & Escrow Guard */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-3 bg-[#151f33]/90 rounded-2xl border border-stone-800/80 space-y-0.5">
                <div className="font-extrabold text-white text-xs sm:text-sm">
                  100% Verified
                </div>
                <div className="text-[10px] text-stone-400 font-medium truncate">
                  .ac.za Student SSO
                </div>
              </div>

              <div className="p-3 bg-[#151f33]/90 rounded-2xl border border-stone-800/80 space-y-0.5">
                <div className="font-extrabold text-white text-xs sm:text-sm">
                  Escrow Guard
                </div>
                <div className="text-[10px] text-stone-400 font-medium truncate">
                  SnapScan & PayFast
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* White Auth Card (Matches Screenshot) */}
        <div className="bg-white text-stone-900 rounded-3xl p-5 shadow-2xl border border-stone-200/90 space-y-3.5">
          {/* Quick Role Switcher */}
          <div className="flex p-1 bg-stone-100 rounded-xl gap-1 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setAccountRole('student')}
              className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                accountRole === 'student'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => setAccountRole('vendor')}
              className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                accountRole === 'vendor'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Vendor</span>
            </button>

            <button
              type="button"
              onClick={() => setAccountRole('faculty')}
              className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                accountRole === 'faculty'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => setAccountRole('resident')}
              className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                accountRole === 'resident'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Resident</span>
            </button>
          </div>

          {/* Student Sign In vs Sign Up (Outlook PIN) */}
          <div className="flex p-1 bg-blue-50/70 rounded-2xl border border-blue-100">
            <button
              type="button"
              onClick={() => setAuthTab('signin')}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                authTab === 'signin'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-blue-900/70 hover:text-blue-900'
              }`}
            >
              {accountRole === 'student' ? 'Student Sign In' : 'Account Sign In'}
            </button>

            <button
              type="button"
              onClick={() => setAuthTab('signup')}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                authTab === 'signup'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-blue-900/70 hover:text-blue-900'
              }`}
            >
              {accountRole === 'student' ? 'Sign Up (Outlook PIN)' : 'Register Account'}
            </button>
          </div>

          {/* Select Student Domain Chips (Exact from Screenshot: UCT, WITS, STELLENBOSCH, UP, UJ, RHODES) */}
          {accountRole === 'student' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Select Student Domain:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DOMAINS.map((dom) => (
                  <button
                    type="button"
                    key={dom.id}
                    onClick={() => setActiveDomain(dom)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      activeDomain.id === dom.id
                        ? 'border-blue-600 bg-blue-50/80 text-blue-600 ring-2 ring-blue-500/20'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {dom.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {accountRole === 'student' ? (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Student Email (.ac.za)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={emailPrefix}
                    onChange={(e) => setEmailPrefix(e.target.value)}
                    placeholder="e.g. sipho.dlamini"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-stone-50 focus:bg-white"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono font-bold text-stone-400 select-none">
                    @{activeDomain.domain}
                  </span>
                </div>
              </div>
            ) : accountRole === 'vendor' ? (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    CIPC Registered Business Email
                  </label>
                  <input
                    type="email"
                    required
                    defaultValue="orders@mamanomsafoods.co.za"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    CIPC Enterprise Number
                  </label>
                  <input
                    type="text"
                    defaultValue="2021/847291/07"
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-semibold rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  University / Personal Email
                </label>
                <input
                  type="email"
                  required
                  defaultValue={accountRole === 'faculty' ? 'annelize.vdm@sun.ac.za' : 'lerato.khumalo@gmail.com'}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-stone-300 bg-stone-50"
                />
              </div>
            )}

            {authTab === 'signin' ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">Password / SSO PIN</label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('A password reset link was sent to your South African university email.');
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Forgot PIN?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-stone-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">
                    6-Digit Outlook PIN
                  </label>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(true);
                        setOutlookOtp('849201');
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Send PIN to Outlook
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-600">
                      PIN simulated to {fullEmail}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. 849201"
                  value={outlookOtp}
                  onChange={(e) => setOutlookOtp(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono font-bold tracking-widest text-center rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Signing in to {activeDomain.name}...</span>
              ) : (
                <>
                  <span>
                    {authTab === 'signin'
                      ? `Sign In to ${activeDomain.name} Community Store`
                      : 'Verify Outlook PIN & Enter'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Bar (1-click test without typing) */}
          <div className="pt-2 border-t border-stone-100 space-y-1.5">
            <div className="text-[10px] font-bold tracking-wider text-stone-400 uppercase text-center">
              QUICK 1-CLICK DEMO ACCOUNTS:
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRole('student')}
                className="p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100 text-blue-900 border border-blue-200 font-semibold text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold text-[11px] truncate">Sipho (UCT)</div>
                  <div className="text-[10px] text-blue-700 truncate">Student .ac.za</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('vendor')}
                className="p-2 rounded-xl bg-amber-50/70 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold text-[11px] truncate">Mama Nomsa</div>
                  <div className="text-[10px] text-amber-700 truncate">CIPC Braamfontein</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('faculty')}
                className="p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold text-[11px] truncate">Dr. Annelize</div>
                  <div className="text-[10px] text-emerald-700 truncate">Maties Faculty</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('moderator')}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200 font-semibold text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
                <div className="truncate">
                  <div className="font-bold text-[11px] truncate">CPS Security</div>
                  <div className="text-[10px] text-stone-600 truncate">Campus Proctor</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
