import React from 'react';
import { CartItem, User } from '../types';
import { formatZAR } from '../utils/fraudDetection';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (listingId: string) => void;
  onUpdateQuantity: (listingId: string, delta: number) => void;
  onProceedToCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.listing.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-stone-900">Your Campus Cart</h2>
              <p className="text-xs text-stone-500">{cartItems.length} items reserved</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {cartItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <ShoppingCart className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-800 text-sm">Your cart is empty</h3>
              <p className="text-xs text-stone-500">
                Explore campus textbooks, electronics, and vendor meal packs.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.listing.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.listing.images[0]}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-stone-900 text-xs truncate">{item.listing.title}</h4>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <span>{item.listing.seller.name}</span>
                      <span>·</span>
                      <span className="font-extrabold text-stone-900">{formatZAR(item.listing.price)}</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{item.listing.campus}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.listing.id, -1)}
                      className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-stone-800">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.listing.id, 1)}
                      className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.listing.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-stone-900">
              <span>Total in Escrow</span>
              <span className="text-base text-emerald-700">{formatZAR(totalAmount)}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
