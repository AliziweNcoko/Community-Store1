import React, { useState, useMemo, useEffect } from 'react';
import {
  User,
  Listing,
  BulletinPost,
  ChatConversation,
  CartItem,
  Order,
  FraudAlert,
  VerificationRequest,
  ListingCategory,
  ListingType,
} from './types';
import {
  MOCK_USERS,
  MOCK_LISTINGS,
  MOCK_BULLETIN_POSTS,
  MOCK_CHATS,
  MOCK_FRAUD_ALERTS,
  MOCK_VERIFICATION_REQUESTS,
  UNIVERSITIES,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { ChatModal } from './components/ChatModal';
import { ChatListModal } from './components/ChatListModal';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { BulletinBoard } from './components/BulletinBoard';
import { FraudDetectionDashboard } from './components/FraudDetectionDashboard';
import { VerificationModal } from './components/VerificationModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { ReportModal } from './components/ReportModal';
import { MobileFrame } from './components/MobileFrame';
import { AuthScreen } from './components/AuthScreen';
import { formatZAR } from './utils/fraudDetection';
import {
  ShieldCheck,
  Plus,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Laptop,
  Home as HomeIcon,
  Shirt,
  Utensils,
  GraduationCap,
  Bike,
  Gift,
  HelpCircle,
  Building2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('community_store_auth') === 'true';
  });

  // Layout mode state: 'auto' | 'laptop' | 'phone'
  const [layoutMode, setLayoutMode] = useState<'auto' | 'laptop' | 'phone'>(() => {
    const saved = localStorage.getItem('community_store_layout');
    return saved === 'laptop' || saved === 'phone' ? saved : 'auto';
  });

  // Current logged in persona
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('community_store_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_USERS.student;
  });

  const [allUsers, setAllUsers] = useState<Record<string, User>>(MOCK_USERS);

  // App core state
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [bulletinPosts, setBulletinPosts] = useState<BulletinPost[]>(MOCK_BULLETIN_POSTS);
  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CHATS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedListingIds, setSavedListingIds] = useState<Set<string>>(new Set(['item-1']));
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(MOCK_FRAUD_ALERTS);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(
    MOCK_VERIFICATION_REQUESTS
  );

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<'marketplace' | 'bulletin'>('marketplace');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'recent'>('featured');
  const [onlyVerifiedSellers, setOnlyVerifiedSellers] = useState<boolean>(false);

  // Modals
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isFraudDashboardOpen, setIsFraudDashboardOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportingListing, setReportingListing] = useState<Listing | null>(null);

  const handleLayoutModeChange = (mode: 'auto' | 'laptop' | 'phone') => {
    setLayoutMode(mode);
    localStorage.setItem('community_store_layout', mode);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('community_store_auth', 'true');
    localStorage.setItem('community_store_user', JSON.stringify(user));
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('community_store_auth');
  };

  const handleExploreAsGuest = () => {
    setCurrentUser(MOCK_USERS.student);
    setIsAuthenticated(true);
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Campus filter
        if (
          selectedCampus !== 'all' &&
          !item.campus.toLowerCase().includes(selectedCampus.toLowerCase())
        ) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Type filter (sale, trade, free, service)
        if (selectedType !== 'all' && item.type !== selectedType) {
          return false;
        }

        // Verified sellers filter
        if (onlyVerifiedSellers && item.seller.verificationStatus !== 'verified') {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
          const matchesSeller = item.seller.name.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesTags && !matchesSeller) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'recent') return b.id.localeCompare(a.id);
        // Featured (promoted first, then lowest fraud risk)
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return a.fraudRiskScore - b.fraudRiskScore;
      });
  }, [
    listings,
    selectedCampus,
    selectedCategory,
    selectedType,
    onlyVerifiedSellers,
    searchQuery,
    sortBy,
  ]);

  // Handlers
  const handleToggleSave = (listingId: string) => {
    setSavedListingIds((prev) => {
      const next = new Set(prev);
      if (next.has(listingId)) next.delete(listingId);
      else next.add(listingId);
      return next;
    });
  };

  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    setIsDetailOpen(true);
  };

  const handleStartChat = (listing: Listing) => {
    let convo = conversations.find((c) => c.listingId === listing.id);
    if (!convo) {
      convo = {
        id: `chat-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        listingPrice: listing.price,
        listingImage: listing.images[0],
        otherUser: listing.seller,
        messages: [
          {
            id: `msg-sys-${Date.now()}`,
            senderId: 'system',
            text: `🛡️ Welcome to Mzansi Campus Chat. You are negotiating with ${listing.seller.name} (${listing.seller.badgeLabel}). Keep negotiations in-app for safety.`,
            timestamp: 'Just now',
            isSystemWarning: true,
          },
        ],
        lastMessage: 'Started negotiation',
        updatedAt: 'Just now',
        unreadCount: 0,
      };
      setConversations((prev) => [convo!, ...prev]);
    }
    setActiveConversation(convo);
    setIsChatOpen(true);
  };

  const handleSendMessage = (
    conversationId: string,
    text: string,
    offerAmount?: number,
    meetupSpot?: string
  ) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: 'Just now',
      offerAmount,
      meetupSpotProposal: meetupSpot,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updated = {
            ...c,
            messages: [...c.messages, newMessage],
            lastMessage: text,
            updatedAt: 'Just now',
          };
          return updated;
        }
        return c;
      })
    );

    setActiveConversation((prev) => {
      if (prev && prev.id === conversationId) {
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          lastMessage: text,
        };
      }
      return prev;
    });

    // Realistic South African seller reply simulation
    setTimeout(() => {
      let replyText = 'Howzit! Sounds great, thanks for reaching out. Let me know when suits you.';
      if (offerAmount) {
        replyText = `Howzit! I can accept ${formatZAR(
          offerAmount
        )}. Let's meet at the Campus Protection Services safe zone to finalize!`;
      } else if (meetupSpot) {
        replyText = `Sharp! ${meetupSpot} is perfect for me. The campus security desk is always well lit.`;
      }

      const botReply = {
        id: `msg-reply-${Date.now()}`,
        senderId: 'seller_bot',
        text: replyText,
        timestamp: 'Just now',
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, botReply],
              lastMessage: botReply.text,
              updatedAt: 'Just now',
            };
          }
          return c;
        })
      );

      setActiveConversation((prev) => {
        if (prev && prev.id === conversationId) {
          return {
            ...prev,
            messages: [...prev.messages, botReply],
            lastMessage: botReply.text,
          };
        }
        return prev;
      });
    }, 1200);
  };

  const handleAcceptOffer = (conversationId: string, offerAmount: number) => {
    const acceptMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: `Deal accepted! Agreed price: ${formatZAR(offerAmount)}. Please proceed to Mzansi Escrow checkout.`,
      timestamp: 'Just now',
      isOfferAccepted: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            listingPrice: offerAmount,
            messages: [...c.messages, acceptMsg],
            lastMessage: acceptMsg.text,
          };
        }
        return c;
      })
    );

    setActiveConversation((prev) => {
      if (prev && prev.id === conversationId) {
        return {
          ...prev,
          listingPrice: offerAmount,
          messages: [...prev.messages, acceptMsg],
          lastMessage: acceptMsg.text,
        };
      }
      return prev;
    });
  };

  const handleAddToCart = (listing: Listing) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.listing.id === listing.id);
      if (existing) {
        return prev.map((i) =>
          i.listing.id === listing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          listing,
          quantity: 1,
          selectedMeetupSpot: listing.safeMeetupSpot,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (listingId: string) => {
    setCartItems((prev) => prev.filter((i) => i.listing.id !== listingId));
  };

  const handleUpdateCartQuantity = (listingId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.listing.id === listingId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleCreateListing = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);

    if (newListing.status === 'flagged') {
      const newAlert: FraudAlert = {
        id: `fraud-${Date.now()}`,
        listingId: newListing.id,
        targetUserId: currentUser.id,
        userName: currentUser.name,
        alertType: 'abnormal_pricing',
        severity: 'high',
        description: `Listing "${newListing.title}" flagged during automated intake. Risk Score: ${newListing.fraudRiskScore}%.`,
        timestamp: 'Just now',
        resolved: false,
      };
      setFraudAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleReleaseEscrow = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o))
    );
  };

  const handleAddBulletinPost = (newPost: BulletinPost) => {
    setBulletinPosts((prev) => [newPost, ...prev]);
  };

  const handleUpvoteBulletin = (postId: string) => {
    setBulletinPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasUp = p.hasUpvoted;
          return {
            ...p,
            upvotes: hasUp ? p.upvotes - 1 : p.upvotes + 1,
            hasUpvoted: !hasUp,
          };
        }
        return p;
      })
    );
  };

  const handleAddBulletinReply = (postId: string, text: string) => {
    setBulletinPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newReply = {
            id: `rep-${Date.now()}`,
            author: currentUser,
            text,
            timestamp: 'Just now',
          };
          return {
            ...p,
            repliesCount: p.repliesCount + 1,
            replies: [...(p.replies || []), newReply],
          };
        }
        return p;
      })
    );
  };

  const handleResolveFraudAlert = (alertId: string, action: 'ban' | 'dismiss') => {
    setFraudAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
    if (action === 'ban') {
      const alert = fraudAlerts.find((a) => a.id === alertId);
      if (alert && alert.listingId) {
        setListings((prev) => prev.filter((l) => l.id !== alert.listingId));
      }
    }
  };

  const handleResolveVerification = (requestId: string, status: 'approved' | 'rejected') => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  };

  const handleUserVerificationComplete = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('community_store_user', JSON.stringify(updatedUser));
    setAllUsers((prev) => ({
      ...prev,
      [updatedUser.role]: updatedUser,
    }));
  };

  const handleOpenReport = (listing: Listing) => {
    setReportingListing(listing);
    setIsReportOpen(true);
  };

  const handleSubmitReport = (listingId: string, reason: string, details: string) => {
    const newAlert: FraudAlert = {
      id: `fraud-report-${Date.now()}`,
      listingId,
      targetUserId: 'reported-user',
      userName: reportingListing ? reportingListing.seller.name : 'Reported User',
      alertType: 'fake_pop_pattern',
      severity: 'high',
      description: `User report: ${reason.replace('_', ' ')} - "${details}"`,
      timestamp: 'Just now',
      resolved: false,
    };
    setFraudAlerts((prev) => [newAlert, ...prev]);
  };

  const categoriesConfig = [
    { id: 'all', label: 'All Items', icon: Sparkles },
    { id: 'textbooks', label: 'Textbooks & Notes', icon: BookOpen },
    { id: 'electronics', label: 'Electronics & Tech', icon: Laptop },
    { id: 'dorm_flat', label: 'Dorm & Living', icon: HomeIcon },
    { id: 'fashion', label: 'Fashion & Thrift', icon: Shirt },
    { id: 'food_artisan', label: 'Food & Campus Bakes', icon: Utensils },
    { id: 'services', label: 'Tutoring & Skills', icon: GraduationCap },
    { id: 'transport', label: 'Bikes & Commute', icon: Bike },
    { id: 'free_giveaway', label: 'Free Giveaways', icon: Gift },
  ];

  // If not logged in, render the AuthScreen matching the screenshot
  if (!isAuthenticated) {
    return (
      <MobileFrame layoutMode={layoutMode} onChangeLayoutMode={handleLayoutModeChange}>
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          onExploreAsGuest={handleExploreAsGuest}
          layoutMode={layoutMode}
          onChangeLayoutMode={handleLayoutModeChange}
        />
      </MobileFrame>
    );
  }

  const mainContent = (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenVerification={() => setIsVerificationOpen(true)}
        onOpenFraudDashboard={() => setIsFraudDashboardOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChats={() => setIsChatListOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        layoutMode={layoutMode}
        onChangeLayoutMode={handleLayoutModeChange}
        onSignOut={handleSignOut}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={cartItems.length}
        unreadChatCount={conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
        fraudAlertsCount={fraudAlerts.filter((a) => !a.resolved).length}
        selectedCampus={selectedCampus}
        onSelectCampus={setSelectedCampus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {activeTab === 'bulletin' ? (
          <BulletinBoard
            posts={bulletinPosts}
            currentUser={currentUser}
            onAddPost={handleAddBulletinPost}
            onUpvotePost={handleUpvoteBulletin}
            onAddReply={handleAddBulletinReply}
            selectedCampus={selectedCampus}
          />
        ) : (
          <div className="space-y-5">
            {/* Campus Trust Banner */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified South African Campus Network</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Buy, Sell & Trade Locally at Your Campus
                </h1>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                  Connect with verified students, faculty, CIPC registered local vendors, and neighborhood residents. Protected by <strong className="text-emerald-400 font-semibold">Mzansi Escrow</strong> and designated <strong className="text-amber-300 font-semibold">Campus Protection Services (CPS) Safe Zones</strong>.
                </p>

                {/* Quick Persona Pills */}
                <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
                  <div className="inline-flex items-center gap-1.5 bg-stone-800/80 border border-stone-700/80 px-3 py-1.5 rounded-xl">
                    <span className="text-stone-400">Current Persona:</span>
                    <strong className="text-white font-bold">{currentUser.name}</strong>
                    <span className="text-emerald-400">({currentUser.badgeLabel})</span>
                  </div>

                  <button
                    onClick={() => setIsRoleSwitcherOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-xs"
                  >
                    Switch Campus Role
                  </button>

                  {currentUser.verificationStatus !== 'verified' && (
                    <button
                      onClick={() => setIsVerificationOpen(true)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl font-bold transition-colors shadow-xs"
                    >
                      Verify ID (.ac.za / CIPC)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category Segmented Scroll Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
                {categoriesConfig.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-white border border-stone-200/90 text-stone-700 hover:border-stone-300 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Filters: Type, Safe Zones, Sorting */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Type buttons */}
                <div className="flex items-center gap-1.5 text-xs">
                  {[
                    { id: 'all', label: 'All Types' },
                    { id: 'sale', label: 'For Sale' },
                    { id: 'trade', label: 'Swap / Trade' },
                    { id: 'free', label: 'Free Giveaway' },
                    { id: 'service', label: 'Tutoring / Service' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedType === t.id
                          ? 'bg-emerald-100/90 text-emerald-900 font-bold'
                          : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Right controls: Verified Only & Sort */}
                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 font-medium select-none bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                    <input
                      type="checkbox"
                      checked={onlyVerifiedSellers}
                      onChange={(e) => setOnlyVerifiedSellers(e.target.checked)}
                      className="rounded-sm text-emerald-600 focus:ring-emerald-500"
                    />
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Sellers Only</span>
                  </label>

                  <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                    <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-medium text-stone-700 focus:outline-hidden text-xs cursor-pointer"
                    >
                      <option value="featured">Featured / Safest</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="recent">Recently Added</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 text-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post Item</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count & Unboxed Metadata Header */}
            <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200/80">
              <div className="flex items-center gap-2">
                <span>Showing {filteredListings.length} listings</span>
                {selectedCampus !== 'all' && (
                  <>
                    <span>·</span>
                    <span className="font-semibold text-stone-700">{selectedCampus}</span>
                  </>
                )}
                {selectedCategory !== 'all' && (
                  <>
                    <span>·</span>
                    <span className="capitalize text-stone-700">{selectedCategory.replace('_', ' ')}</span>
                  </>
                )}
              </div>
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
                <Search className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-base font-bold text-stone-800">No campus listings found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different South African university campus.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedCampus('all');
                      setSelectedCategory('all');
                      setSelectedType('all');
                      setSearchQuery('');
                      setOnlyVerifiedSellers(false);
                    }}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={handleSelectListing}
                    onQuickChat={handleStartChat}
                    onToggleSave={handleToggleSave}
                    isSaved={savedListingIds.has(listing.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab === 'bulletin' ? 'bulletin' : 'marketplace'}
        onSelectTab={(tab) => {
          if (tab === 'marketplace' || tab === 'bulletin') {
            setActiveTab(tab);
          } else if (tab === 'chats') {
            setIsChatListOpen(true);
          } else if (tab === 'orders') {
            setIsOrdersOpen(true);
          } else if (tab === 'verification') {
            setIsVerificationOpen(true);
          }
        }}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        cartCount={cartItems.length}
        unreadCount={conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
      />

      {/* Modals */}
      <ListingDetailModal
        listing={selectedListing}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStartChat={handleStartChat}
        onAddToCart={handleAddToCart}
        onReport={handleOpenReport}
      />

      <CreateListingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        currentUser={currentUser}
        onCreateListing={handleCreateListing}
      />

      <ChatModal
        conversation={activeConversation}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        onAcceptOffer={handleAcceptOffer}
      />

      <ChatListModal
        isOpen={isChatListOpen}
        onClose={() => setIsChatListOpen(false)}
        conversations={conversations}
        currentUser={currentUser}
        onSelectConversation={(convo) => {
          setActiveConversation(convo);
          setIsChatOpen(true);
        }}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
        onClearCart={() => setCartItems([])}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        currentUser={currentUser}
        onReleaseEscrow={handleReleaseEscrow}
      />

      <FraudDetectionDashboard
        isOpen={isFraudDashboardOpen}
        onClose={() => setIsFraudDashboardOpen(false)}
        currentUser={currentUser}
        fraudAlerts={fraudAlerts}
        verificationRequests={verificationRequests}
        onResolveAlert={handleResolveFraudAlert}
        onResolveVerification={handleResolveVerification}
      />

      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        currentUser={currentUser}
        onVerificationComplete={handleUserVerificationComplete}
      />

      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          localStorage.setItem('community_store_user', JSON.stringify(u));
        }}
        allUsers={allUsers}
      />

      <ReportModal
        listing={reportingListing}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmitReport={handleSubmitReport}
      />
    </div>
  );

  return (
    <MobileFrame layoutMode={layoutMode} onChangeLayoutMode={handleLayoutModeChange}>
      {mainContent}
    </MobileFrame>
  );
}
