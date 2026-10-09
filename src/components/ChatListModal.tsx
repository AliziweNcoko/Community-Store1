import React from 'react';
import { ChatConversation, User } from '../types';
import { formatZAR } from '../utils/fraudDetection';
import { MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';

interface ChatListModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: ChatConversation[];
  currentUser: User;
  onSelectConversation: (convo: ChatConversation) => void;
}

export const ChatListModal: React.FC<ChatListModalProps> = ({
  isOpen,
  onClose,
  conversations,
  currentUser,
  onSelectConversation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-stone-900">Campus Inquiries & Offers</h2>
              <p className="text-xs text-stone-500">Secure in-app buyer & seller communications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-2">
          {conversations.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-800 text-sm">No messages yet</h3>
              <p className="text-xs text-stone-500">
                Click "Chat" on any campus listing to inquire or propose an offer.
              </p>
            </div>
          ) : (
            conversations.map((convo) => (
              <button
                key={convo.id}
                type="button"
                onClick={() => {
                  onSelectConversation(convo);
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50/70 transition-all flex items-center gap-3.5 group"
              >
                <div className="relative shrink-0">
                  <img
                    src={convo.otherUser.avatar}
                    alt=""
                    className="w-11 h-11 rounded-full object-cover border border-stone-200"
                  />
                  {convo.otherUser.verificationStatus === 'verified' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 absolute -bottom-0.5 -right-0.5 bg-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                      {convo.otherUser.name}
                    </span>
                    <span className="text-[10px] text-stone-400 shrink-0">{convo.updatedAt}</span>
                  </div>

                  <div className="text-[11px] font-semibold text-emerald-800 truncate mt-0.5">
                    {convo.listingTitle} ({formatZAR(convo.listingPrice)})
                  </div>

                  <p className="text-xs text-stone-500 truncate mt-1 leading-snug">
                    {convo.lastMessage}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-700 shrink-0 transition-colors" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
