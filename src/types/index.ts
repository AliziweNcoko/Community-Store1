export type UserRole = 'student' | 'faculty' | 'vendor' | 'resident' | 'moderator';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  campusOrArea: string;
  institution?: string; // e.g. "University of Cape Town", "Wits University", etc.
  studentOrStaffId?: string;
  cipcNumber?: string; // For South African registered vendors
  rating: number; // 0 - 5
  reviewsCount: number;
  dealsCompleted: number;
  trustScore: number; // 0 - 100%
  memberSince: string;
  badgeLabel: string;
  phone?: string;
}

export type ListingCategory =
  | 'textbooks'
  | 'electronics'
  | 'dorm_flat'
  | 'fashion'
  | 'services'
  | 'food_artisan'
  | 'transport'
  | 'free_giveaway';

export type ListingType = 'sale' | 'trade' | 'free' | 'service';

export type ListingCondition = 'brand_new' | 'like_new' | 'good' | 'fair';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number; // In ZAR Rands
  originalPrice?: number;
  category: ListingCategory;
  type: ListingType;
  condition: ListingCondition;
  images: string[];
  seller: User;
  campus: string;
  safeMeetupSpot: string;
  swapPreferences?: string;
  isPromoted?: boolean;
  createdAt: string;
  fraudRiskScore: number; // 0 (safest) to 100 (highest risk)
  fraudFlags?: string[];
  status: 'active' | 'reserved' | 'sold' | 'flagged';
  views: number;
  saves: number;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  offerAmount?: number;
  isOfferAccepted?: boolean;
  meetupSpotProposal?: string;
  isSystemWarning?: boolean;
}

export interface ChatConversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  otherUser: User;
  messages: ChatMessage[];
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface BulletinPost {
  id: string;
  author: User;
  title: string;
  body: string;
  category: 'rideshare' | 'study_group' | 'lost_found' | 'campus_event' | 'housing' | 'src_notice';
  campus: string;
  date: string;
  upvotes: number;
  hasUpvoted?: boolean;
  repliesCount: number;
  replies?: { id: string; author: User; text: string; timestamp: string }[];
  tags: string[];
}

export interface CartItem {
  listing: Listing;
  quantity: number;
  selectedMeetupSpot: string;
}

export type PaymentMethodType = 'ozow' | 'snapscan' | 'payfast' | 'escrow_cash';

export interface Order {
  id: string;
  listing: Listing;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  status: 'escrow_held' | 'handover_pending' | 'completed' | 'disputed';
  safeZoneLocation: string;
  createdAt: string;
  buyer: User;
  seller: User;
  escrowCode: string; // 4-digit code provided on collection
}

export interface FraudAlert {
  id: string;
  listingId?: string;
  targetUserId: string;
  userName: string;
  alertType: 'abnormal_pricing' | 'fake_pop_pattern' | 'off_platform_redirect' | 'unverified_bulk';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: string;
  resolved: boolean;
}

export interface VerificationRequest {
  id: string;
  user: User;
  documentType: 'student_card' | 'faculty_letter' | 'cipc_certificate' | 'utility_bill';
  documentName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}
