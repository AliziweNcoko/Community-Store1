import React from 'react';
import { Home, Megaphone, Plus, MessageSquare, Package, ShieldCheck } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'marketplace' | 'bulletin' | 'chats' | 'orders' | 'verification';
  onSelectTab: (tab: 'marketplace' | 'bulletin' | 'chats' | 'orders' | 'verification') => void;
  onOpenCreateModal: () => void;
  cartCount: number;
  unreadCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreateModal,
  cartCount,
  unreadCount,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onSelectTab('marketplace')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
          activeTab === 'marketplace' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Market</span>
      </button>

      <button
        onClick={() => onSelectTab('bulletin')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
          activeTab === 'bulletin' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Megaphone className="w-5 h-5 mb-0.5" />
        <span>Bulletin</span>
      </button>

      {/* Floating Center Post Button */}
      <button
        onClick={onOpenCreateModal}
        className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all"
        title="Post New Listing"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => onSelectTab('chats')}
        className={`relative flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
          activeTab === 'chats' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <MessageSquare className="w-5 h-5 mb-0.5" />
        <span>Chats</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onSelectTab('orders')}
        className={`relative flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
          activeTab === 'orders' ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Package className="w-5 h-5 mb-0.5" />
        <span>Orders</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  );
};
