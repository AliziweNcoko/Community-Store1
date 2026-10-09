import React, { useState } from 'react';
import { CartItem, User, Order, PaymentMethodType } from '../types';
import { formatZAR } from '../utils/fraudDetection';
import {
  ShieldCheck,
  Lock,
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser: User;
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
}

const SA_BANKS = [
  { id: 'fnb', name: 'First National Bank (FNB)', color: 'bg-teal-700' },
  { id: 'capitec', name: 'Capitec Bank', color: 'bg-red-600' },
  { id: 'standard', name: 'Standard Bank', color: 'bg-blue-700' },
  { id: 'nedbank', name: 'Nedbank', color: 'bg-emerald-800' },
  { id: 'absa', name: 'Absa Bank', color: 'bg-rose-700' },
  { id: 'tyme', name: 'TymeBank', color: 'bg-yellow-600' },
  { id: 'discovery', name: 'Discovery Bank', color: 'bg-purple-800' },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onOrderSuccess,
  onClearCart,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('ozow');
  const [selectedBank, setSelectedBank] = useState('fnb');
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [pickupSpot, setPickupSpot] = useState(
    'Campus Protection Services (CPS) Desk - Sarah Baartman Hall'
  );
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen || cartItems.length === 0) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.listing.price * item.quantity, 0);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    setTimeout(() => {
      const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
      const newOrder: Order = {
        id: `MZA-${Math.floor(100000 + Math.random() * 900000)}`,
        listing: cartItems[0].listing,
        totalAmount,
        paymentMethod,
        status: 'escrow_held',
        safeZoneLocation: pickupSpot,
        createdAt: 'Just now',
        buyer: currentUser,
        seller: cartItems[0].listing.seller,
        escrowCode: randomPin,
      };

      setCreatedOrder(newOrder);
      setStep('success');
      onOrderSuccess(newOrder);
      onClearCart();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Top title bar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Secure Campus Checkout</h2>
              <p className="text-[11px] text-stone-500">Protected by South Africa Mzansi Escrow System</p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content Views */}
        <div className="p-5">
          {step === 'details' && (
            <div className="space-y-4">
              {/* Order Summary */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Items to Purchase ({cartItems.length})
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto pt-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={item.listing.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-stone-900 truncate">{item.listing.title}</p>
                          <p className="text-[11px] text-stone-500">Seller: {item.listing.seller.name}</p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900 shrink-0">
                        {formatZAR(item.listing.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-sm font-extrabold text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-700 text-base">{formatZAR(totalAmount)}</span>
                </div>
              </div>

              {/* Handover Spot Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Designated Campus Safe Handover Zone</span>
                </label>
                <select
                  value={pickupSpot}
                  onChange={(e) => setPickupSpot(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Campus Protection Services (CPS) Desk - Sarah Baartman Hall">
                    UCT: CPS Desk - Sarah Baartman Hall (Upper Campus)
                  </option>
                  <option value="Chancellor Oppenheimer Library Security Desk (UCT)">
                    UCT: Chancellor Oppenheimer Library Security Desk
                  </option>
                  <option value="Matrix Student Mall Central Info Desk (Wits)">
                    Wits: Matrix Student Mall Central Info Desk
                  </option>
                  <option value="Great Hall East Security Entrance (Wits)">
                    Wits: Great Hall East Security Entrance
                  </option>
                  <option value="Neelsie Student Centre Info Booth (Stellenbosch)">
                    Stellenbosch: Neelsie Student Centre Info Booth
                  </option>
                  <option value="Auckland Park Kingsway Student Centre (UJ)">
                    UJ: APK Student Centre Entrance
                  </option>
                  <option value="Hatfield Campus Student Centre Piazza (UP)">
                    UP / Tuks: Hatfield Campus Student Centre Piazza
                  </option>
                </select>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Both parties meet in the presence of campus security or public student foyers.
                </p>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Mzansi Escrow Safety Guarantee:</strong> Your payment is held securely in escrow. Funds are never released to the seller until you inspect the item and share your 4-digit Collection PIN.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Continue to South African Payment Methods</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'payment' && (
            <form onSubmit={handleStartPayment} className="space-y-4">
              <div className="text-xs font-bold text-stone-800">
                Choose Local Payment Method
              </div>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ozow')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'ozow'
                      ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" /> Ozow Instant EFT
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Zero fees via FNB, Capitec, Nedbank, Absa & more
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('snapscan')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'snapscan'
                      ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-blue-700" /> SnapScan QR
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Scan or tap using the SnapScan South Africa app
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('payfast')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'payfast'
                      ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-rose-700" /> PayFast Card
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    South African Visa & Mastercard with 3D Secure
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('escrow_cash')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'escrow_cash'
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" /> Campus Safe Pay
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Pay on safe inspection at Campus Protection Desk
                  </div>
                </button>
              </div>

              {/* Dynamic Payment Body */}
              {paymentMethod === 'ozow' && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
                  <span className="text-xs font-semibold text-stone-700 block">
                    Select Your South African Bank
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SA_BANKS.map((bank) => (
                      <button
                        type="button"
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-2 rounded-lg text-left text-xs font-medium border flex items-center gap-2 transition-all ${
                          selectedBank === bank.id
                            ? 'border-emerald-600 bg-white shadow-xs font-bold'
                            : 'border-stone-200 bg-stone-100/60 hover:bg-white text-stone-700'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${bank.color}`}></span>
                        <span className="truncate">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    You will be prompted to authorize the transaction in your {SA_BANKS.find((b) => b.id === selectedBank)?.name} banking app.
                  </p>
                </div>
              )}

              {paymentMethod === 'snapscan' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-3">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-stone-200 mx-auto flex items-center justify-center shadow-xs">
                    <div className="w-full h-full bg-blue-950 flex flex-col items-center justify-center text-white rounded-lg p-2">
                      <QrCode className="w-12 h-12 text-white mb-1" />
                      <span className="text-[9px] font-mono font-bold tracking-wider">SNAPSCAN SA</span>
                    </div>
                  </div>
                  <div className="text-xs text-stone-600">
                    Scan with your SnapScan App or click the button below to authorize simulated payment of <strong>{formatZAR(totalAmount)}</strong>.
                  </div>
                </div>
              )}

              {paymentMethod === 'payfast' && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'escrow_cash' && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <strong>Safe Campus Handover:</strong> You will meet the seller at the security post. You verify the condition of the goods first, and the campus proctor logs the exchange.
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Pay {formatZAR(totalAmount)} & Lock in Escrow
                </button>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Processing Transaction via South African Gateway</h3>
                <p className="text-xs text-stone-500 mt-1">Securing funds in Campus Safe Escrow...</p>
              </div>
            </div>
          )}

          {step === 'success' && createdOrder && (
            <div className="py-4 space-y-4 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mb-1">
                  Order #{createdOrder.id}
                </span>
                <h3 className="text-base font-extrabold text-stone-900">Payment Secured in Escrow!</h3>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                  Your funds are protected. The seller has been notified to meet you at the designated Campus Safe Zone.
                </p>
              </div>

              {/* 4 Digit Handover PIN */}
              <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-1">
                <div className="text-[11px] font-medium text-stone-300">Your Campus Handover PIN</div>
                <div className="text-2xl font-mono font-extrabold tracking-widest text-amber-400">
                  {createdOrder.escrowCode}
                </div>
                <div className="text-[10px] text-stone-400 leading-tight">
                  Only provide this PIN to the seller in person after you inspect the item!
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-1">
                <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Meetup Location:
                </div>
                <div className="text-stone-600 pl-5">{createdOrder.safeZoneLocation}</div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
