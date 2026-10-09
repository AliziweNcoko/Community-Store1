import React, { useState } from 'react';
import { FraudAlert, VerificationRequest, User } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  UserCheck,
  Building2,
  ArrowUpRight,
  TrendingDown,
  Lock,
} from 'lucide-react';

interface FraudDetectionDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  fraudAlerts: FraudAlert[];
  verificationRequests: VerificationRequest[];
  onResolveAlert: (alertId: string, action: 'ban' | 'dismiss') => void;
  onResolveVerification: (requestId: string, status: 'approved' | 'rejected') => void;
}

export const FraudDetectionDashboard: React.FC<FraudDetectionDashboardProps> = ({
  isOpen,
  onClose,
  currentUser,
  fraudAlerts,
  verificationRequests,
  onResolveAlert,
  onResolveVerification,
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'verifications' | 'guidelines'>('alerts');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Campus Protection Services (CPS) Safety & Oversight Desk</h2>
                <span className="text-[10px] font-mono font-bold bg-red-600/80 px-2 py-0.5 rounded-md uppercase">
                  CPS Admin
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Active scam interception, CIPC enterprise audit, and campus safe zone oversight
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-stone-50 border-b border-stone-200 text-xs">
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Scams Intercepted</div>
            <div className="text-xl font-extrabold text-stone-900 mt-0.5">38</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">↑ Fake PoP & WhatsApp scams</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Active Fraud Alerts</div>
            <div className="text-xl font-extrabold text-red-600 mt-0.5">
              {fraudAlerts.filter((a) => !a.resolved).length}
            </div>
            <div className="text-[10px] text-red-600 font-semibold mt-1">Require immediate review</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Pending Verifications</div>
            <div className="text-xl font-extrabold text-amber-600 mt-0.5">
              {verificationRequests.filter((r) => r.status === 'pending').length}
            </div>
            <div className="text-[10px] text-amber-700 font-semibold mt-1">Students & CIPC vendors</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">CPS Safe Zone Rate</div>
            <div className="text-xl font-extrabold text-emerald-600 mt-0.5">99.4%</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">Safe campus handover</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 pt-3 border-b border-stone-200 flex gap-2 bg-white">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Security Flags ({fraudAlerts.filter((a) => !a.resolved).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('verifications')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'verifications'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Verification Queue ({verificationRequests.filter((r) => r.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'guidelines'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Campus Security Protocols</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {activeTab === 'alerts' && (
            <div className="space-y-3">
              {fraudAlerts.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  All campus fraud alerts resolved!
                </div>
              ) : (
                fraudAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border transition-all ${
                      alert.resolved
                        ? 'bg-stone-50 border-stone-200 opacity-60'
                        : alert.severity === 'high'
                        ? 'bg-red-50/70 border-red-200 ring-1 ring-red-300'
                        : 'bg-amber-50/70 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              alert.severity === 'high'
                                ? 'bg-red-600 text-white'
                                : 'bg-amber-600 text-white'
                            }`}
                          >
                            {alert.severity} Risk
                          </span>
                          <span className="font-bold text-stone-900 text-xs">{alert.userName}</span>
                          <span className="text-[11px] text-stone-400">· {alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-stone-800 leading-relaxed font-medium">
                          {alert.description}
                        </p>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-1">
                          <span>Pattern: <strong className="font-mono capitalize">{alert.alertType.replace('_', ' ')}</strong></span>
                        </div>
                      </div>

                      {!alert.resolved && (
                        <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => onResolveAlert(alert.id, 'ban')}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                          >
                            Block & Delist
                          </button>
                          <button
                            type="button"
                            onClick={() => onResolveAlert(alert.id, 'dismiss')}
                            className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold text-xs rounded-lg transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}

                      {alert.resolved && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'verifications' && (
            <div className="space-y-3">
              {verificationRequests.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  No pending verification requests.
                </div>
              ) : (
                verificationRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={req.user.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-xs">{req.user.name}</span>
                          <span className="text-[11px] font-semibold text-stone-500 capitalize">
                            ({req.user.role})
                          </span>
                        </div>
                        <div className="text-xs text-stone-600">{req.user.campusOrArea}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-mono text-stone-700">{req.documentName}</span>
                          <span>· Submitted {req.submittedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onResolveVerification(req.id, 'approved')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve Badge
                          </button>
                          <button
                            type="button"
                            onClick={() => onResolveVerification(req.id, 'rejected')}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 font-semibold text-xs rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-md ${
                            req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {req.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h3 className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> Safe Campus Trading Mandate
                </h3>
                <p>
                  To eliminate common South African e-commerce fraud (such as fake SMS bank notifications, non-delivery after instant wire, and off-campus meetups in unsafe areas), all trades on this platform enforce:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-emerald-900 font-medium">
                  <li>Physical handovers conducted at official Campus Protection Services (CPS) security points.</li>
                  <li>In-app Mzansi Escrow requiring a 4-digit buyer confirmation PIN before seller payout.</li>
                  <li>Immediate AI flagging of external WhatsApp links, phone number solicitations, and eWallet demands.</li>
                  <li>Rigorous verification of student domain emails (.ac.za) and vendor CIPC company registrations.</li>
                </ul>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900">Recognizing High-Risk Scam Indicators</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 bg-white rounded-lg border border-stone-200">
                    <strong className="text-red-700 block mb-1">1. Fake Proof of Payment (PoP)</strong>
                    Scammers send a forged Standard Bank, FNB, or Capitec SMS. Sellers release goods before money clears. Our Escrow eliminates this completely.
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-stone-200">
                    <strong className="text-red-700 block mb-1">2. Off-Platform WhatsApp Steering</strong>
                    Users insisting on chatting outside the app to avoid security filters. Always keep inquiries in the community store chat.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
