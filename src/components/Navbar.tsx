import React from 'react';
import { User } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  ShoppingCart,
  User as UserIcon,
  Smartphone,
  Laptop,
  RefreshCw,
  Search,
  Sparkles,
  ChevronDown,
  Building,
  GraduationCap,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onOpenRoleSwitcher: () => void;
  onOpenVerification: () => void;
  onOpenFraudDashboard: () => void;
  onOpenCart: () => void;
  onOpenChats: () => void;
  onOpenOrders: () => void;
  layoutMode: 'auto' | 'laptop' | 'phone';
  onChangeLayoutMode: (mode: 'auto' | 'laptop' | 'phone') => void;
  onSignOut: () => void;
  activeTab: 'marketplace' | 'bulletin';
  onSelectTab: (tab: 'marketplace' | 'bulletin') => void;
  cartCount: number;
  unreadChatCount: number;
  fraudAlertsCount: number;
  selectedCampus: string;
  onSelectCampus: (campus: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenRoleSwitcher,
  onOpenVerification,
  onOpenFraudDashboard,
  onOpenCart,
  onOpenChats,
  onOpenOrders,
  layoutMode,
  onChangeLayoutMode,
  onSignOut,
  activeTab,
  onSelectTab,
  cartCount,
  unreadChatCount,
  fraudAlertsCount,
  selectedCampus,
  onSelectCampus,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Layout Mode Switcher Bar (Identical to Screenshot) */}
      <div className="bg-[#0a1222] border-b border-stone-800 text-stone-100 px-3 sm:px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-400 text-[11px] sm:text-xs">Layout Mode:</span>
          <div className="flex items-center gap-1 bg-stone-900/90 p-0.5 sm:p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => onChangeLayoutMode('auto')}
              className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
                layoutMode === 'auto'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              <span>Auto-Detect</span>
            </button>

            <button
              onClick={() => onChangeLayoutMode('laptop')}
              className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
                layoutMode === 'laptop'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3 h-3" />
              <span>Laptop View</span>
            </button>

            <button
              onClick={() => onChangeLayoutMode('phone')}
              className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
                layoutMode === 'phone'
                  ? 'bg-amber-500 text-stone-950 shadow-xs font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Phone View</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSignOut}
            className="text-[11px] text-stone-400 hover:text-rose-400 flex items-center gap-1 font-semibold transition-colors"
            title="Sign out to authentication screen"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* South African Accent Strip */}
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-600 via-amber-400 to-blue-700" />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand & Campus Selector */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            onClick={() => onSelectTab('marketplace')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center font-black text-lg shadow-xs group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-stone-900 text-xs sm:text-sm tracking-tight">
                  Mzansi Campus Store
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded-md">
                  ZA
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium hidden md:block">
                South Africa’s Trusted Varsity Marketplace
              </p>
            </div>
          </div>

          {/* Campus Selector Dropdown */}
          <div className="hidden lg:flex items-center ml-2 pl-3 border-l border-stone-200">
            <select
              value={selectedCampus}
              onChange={(e) => onSelectCampus(e.target.value)}
              className="text-xs font-semibold text-stone-700 bg-stone-100/80 hover:bg-stone-200/80 px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">🇿🇦 All SA Universities</option>
              <option value="Cape Town">UCT (Cape Town)</option>
              <option value="Wits">Wits (Johannesburg)</option>
              <option value="Stellenbosch">Stellenbosch (Maties)</option>
              <option value="Johannesburg">UJ (Auckland Park)</option>
              <option value="Pretoria">UP (Tuks Hatfield)</option>
              <option value="KwaZulu-Natal">UKZN (Durban)</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search textbooks, calculators, dorm fridges, tutoring..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Navigation Tabs (Marketplace vs Bulletin Hub) */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => onSelectTab('marketplace')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'marketplace'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => onSelectTab('bulletin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'bulletin'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Campus Bulletin
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Fraud / Moderation Hub */}
          <button
            onClick={onOpenFraudDashboard}
            className="relative p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
            title="Campus Trust & Fraud Moderation Panel"
          >
            <ShieldAlert className="w-4 h-4 text-stone-600" />
            {fraudAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {fraudAlertsCount}
              </span>
            )}
          </button>

          {/* Messages */}
          <button
            onClick={onOpenChats}
            className="relative p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
            title="Campus Negotiations & Chat"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
            title="Shopping Cart & Escrow"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Role Switcher Button */}
          <button
            onClick={onOpenRoleSwitcher}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-all shadow-xs"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover"
              />
              {currentUser.verificationStatus === 'verified' && (
                <ShieldCheck className="w-3 h-3 text-emerald-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-bold text-stone-900 leading-tight truncate max-w-[100px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-stone-500 capitalize">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Mobile search bar row on small screens */}
      <div className="px-3 pb-2 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search campus marketplace..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
    </header>
  );
};
