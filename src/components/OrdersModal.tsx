import React, { useState } from 'react';
import { Order, User } from '../types';
import { formatZAR } from '../utils/fraudDetection';
import {
  ShieldCheck,
  Package,
  MapPin,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentUser: User;
  onReleaseEscrow: (orderId: string) => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentUser,
  onReleaseEscrow,
}) => {
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRelease = (orderId: string) => {
    onReleaseEscrow(orderId);
    setSuccessToast(`Escrow released for order #${orderId}! Seller payout initiated.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-stone-900">Campus Orders & Escrow Vault</h2>
              <p className="text-xs text-stone-500">Track handovers, safe releases, and receipts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {successToast && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
          {orders.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Package className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-800 text-sm">No active orders</h3>
              <p className="text-xs text-stone-500">
                Purchases made through Mzansi Escrow appear here with pickup PINs.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isBuyer = order.buyer.id === currentUser.id;

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-stone-200 bg-white space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.listing.images[0]}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-xs sm:text-sm">
                            {order.listing.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Order #{order.id} · {order.createdAt}
                        </div>
                        <div className="text-xs font-extrabold text-stone-900 mt-1">
                          {formatZAR(order.totalAmount)}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status === 'completed' ? 'Completed' : 'Funds in Escrow'}
                    </span>
                  </div>

                  {/* Handover Details */}
                  <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1.5 border border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Handover Location:</span>
                      <span className="font-semibold text-stone-800 text-right">{order.safeZoneLocation}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Payment Gateway:</span>
                      <span className="font-semibold text-stone-800 uppercase">{order.paymentMethod}</span>
                    </div>

                    {isBuyer && order.status !== 'completed' && (
                      <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                        <span className="text-stone-500">Your Handover PIN:</span>
                        <span className="font-mono font-extrabold text-stone-900 bg-amber-100 px-2 py-0.5 rounded-md">
                          {order.escrowCode}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {order.status !== 'completed' && isBuyer && (
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Inspect in person before releasing</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRelease(order.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Release Escrow Funds
                      </button>
                    </div>
                  )}

                  {order.status === 'completed' && (
                    <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Item inspected & transaction completed at Campus Safe Zone</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
