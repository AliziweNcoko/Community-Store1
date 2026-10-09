import React, { useState } from 'react';
import { ChatConversation, User } from '../types';
import { formatZAR } from '../utils/fraudDetection';
import {
  ShieldCheck,
  Send,
  MapPin,
  Tag,
  AlertTriangle,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  PhoneOff,
} from 'lucide-react';

interface ChatModalProps {
  conversation: ChatConversation | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSendMessage: (conversationId: string, text: string, offerAmount?: number, meetupSpot?: string) => void;
  onAcceptOffer: (conversationId: string, offerAmount: number) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  conversation,
  isOpen,
  onClose,
  currentUser,
  onSendMessage,
  onAcceptOffer,
}) => {
  const [inputText, setInputText] = useState('');
  const [isMakingOffer, setIsMakingOffer] = useState(false);
  const [offerValue, setOfferValue] = useState(conversation ? conversation.listingPrice : 300);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(
    'Campus Protection Services (CPS) Desk - Sarah Baartman Hall'
  );

  if (!isOpen || !conversation) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(conversation.id, inputText.trim());
    setInputText('');
  };

  const handleSendOffer = () => {
    if (offerValue <= 0) return;
    onSendMessage(
      conversation.id,
      `I would like to make an offer of ${formatZAR(offerValue)} for this item.`,
      offerValue
    );
    setIsMakingOffer(false);
  };

  const handleProposeSpot = () => {
    onSendMessage(
      conversation.id,
      `Can we meet at the campus safe zone: ${selectedSpot}?`,
      undefined,
      selectedSpot
    );
    setIsPickingLocation(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl h-[85vh] max-h-[700px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={conversation.otherUser.avatar}
                alt={conversation.otherUser.name}
                className="w-10 h-10 rounded-full object-cover border border-stone-200"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-stone-900 text-sm">{conversation.otherUser.name}</h3>
                {conversation.otherUser.verificationStatus === 'verified' && (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                <span>{conversation.otherUser.badgeLabel}</span>
                <span>·</span>
                <span>{conversation.otherUser.trustScore}% Trust</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Listing preview pill bar */}
        <div className="px-4 py-2 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={conversation.listingImage}
              alt={conversation.listingTitle}
              className="w-8 h-8 rounded-md object-cover border border-stone-200 shrink-0"
            />
            <span className="font-medium text-stone-800 truncate">{conversation.listingTitle}</span>
          </div>
          <div className="font-extrabold text-stone-900 shrink-0">
            {formatZAR(conversation.listingPrice)}
          </div>
        </div>

        {/* South African Anti-Fraud Security Toast in Chat */}
        <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <div className="flex-1">
            <strong>Campus Safety Shield:</strong> Beware of fake SMS proof of payments (PoP). Keep payments in Mzansi Escrow and meet only at campus security checkpoints.
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
          {conversation.messages.map((msg) => {
            if (msg.isSystemWarning) {
              return (
                <div
                  key={msg.id}
                  className="mx-auto max-w-sm p-2.5 bg-blue-50/90 border border-blue-200 text-blue-900 rounded-xl text-center text-[11px] leading-relaxed"
                >
                  {msg.text}
                </div>
              );
            }

            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs space-y-2 ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white text-stone-800 border border-stone-200/90 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Render Offer Card if message contains an offer */}
                  {msg.offerAmount && (
                    <div
                      className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${
                        isMe
                          ? 'bg-emerald-700/60 border-emerald-500/50 text-white'
                          : 'bg-amber-50 border-amber-200 text-amber-950'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" /> Formal Offer
                        </span>
                        <span className="text-sm font-extrabold">{formatZAR(msg.offerAmount)}</span>
                      </div>

                      {!isMe && !msg.isOfferAccepted && (
                        <button
                          type="button"
                          onClick={() => onAcceptOffer(conversation.id, msg.offerAmount!)}
                          className="w-full mt-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept Offer
                        </button>
                      )}

                      {msg.isOfferAccepted && (
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5" /> Offer Accepted! Proceed to campus handover.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render Meetup Spot Proposal */}
                  {msg.meetupSpotProposal && (
                    <div
                      className={`p-2 rounded-lg border text-[11px] flex items-center gap-1.5 ${
                        isMe
                          ? 'bg-emerald-700/60 border-emerald-500/50 text-white'
                          : 'bg-stone-100 border-stone-300 text-stone-800'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Proposed Safe Zone: <strong>{msg.meetupSpotProposal}</strong></span>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-stone-400 mt-0.5 px-1">{msg.timestamp}</span>
              </div>
            );
          })}
        </div>

        {/* Action Quick Bar */}
        <div className="px-3 py-2 bg-stone-100 border-t border-stone-200 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => {
              setIsMakingOffer(!isMakingOffer);
              setIsPickingLocation(false);
            }}
            className="py-1 px-2.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium shrink-0 flex items-center gap-1 text-[11px]"
          >
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Make Offer in R</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPickingLocation(!isPickingLocation);
              setIsMakingOffer(false);
            }}
            className="py-1 px-2.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium shrink-0 flex items-center gap-1 text-[11px]"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus Safe Zone</span>
          </button>
        </div>

        {/* Make Offer Sub-drawer */}
        {isMakingOffer && (
          <div className="p-3 bg-stone-50 border-t border-stone-200 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span>Propose Price (Listing price is {formatZAR(conversation.listingPrice)})</span>
              <button onClick={() => setIsMakingOffer(false)} className="text-stone-400 text-xs">✕</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-700">R</span>
              <input
                type="number"
                min="1"
                value={offerValue}
                onChange={(e) => setOfferValue(Number(e.target.value))}
                className="w-32 px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <button
                type="button"
                onClick={handleSendOffer}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Send Formal Offer
              </button>
            </div>
          </div>
        )}

        {/* Propose Location Sub-drawer */}
        {isPickingLocation && (
          <div className="p-3 bg-stone-50 border-t border-stone-200 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span>Suggest Campus Protection Services Meetup Spot</span>
              <button onClick={() => setIsPickingLocation(false)} className="text-stone-400 text-xs">✕</button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedSpot}
                onChange={(e) => setSelectedSpot(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Campus Protection Services (CPS) Desk - Sarah Baartman Hall">
                  CPS Desk - Sarah Baartman Hall (UCT)
                </option>
                <option value="Great Hall East Security Entrance (Wits)">
                  Great Hall East Security (Wits)
                </option>
                <option value="Neelsie Student Centre Info Booth (Stellenbosch)">
                  Neelsie Student Centre Info (Stellenbosch)
                </option>
                <option value="Auckland Park Kingsway Student Centre (UJ)">
                  APK Student Centre Entrance (UJ)
                </option>
                <option value="Hatfield Campus Student Centre Piazza (UP)">
                  Hatfield Student Centre Piazza (UP)
                </option>
              </select>
              <button
                type="button"
                onClick={handleProposeSpot}
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Propose
              </button>
            </div>
          </div>
        )}

        {/* Input bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message or negotiation..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
