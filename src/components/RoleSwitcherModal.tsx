import React from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, Store, GraduationCap, Home, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectUser: (user: User) => void;
  allUsers: Record<string, User>;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  allUsers,
}) => {
  if (!isOpen) return null;

  const rolesConfig: { role: UserRole; title: string; desc: string; icon: React.ReactNode; userKey: string }[] = [
    {
      role: 'student',
      title: 'University Student',
      desc: 'Verified .ac.za email, student ID, buy/sell textbooks, electronics, and dorm essentials.',
      icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
      userKey: 'student',
    },
    {
      role: 'vendor',
      title: 'Local Campus Vendor',
      desc: 'CIPC registered enterprise, sell campus meals, crafts, supplies to thousands of students.',
      icon: <Store className="w-5 h-5 text-amber-600" />,
      userKey: 'vendor',
    },
    {
      role: 'faculty',
      title: 'Faculty & University Staff',
      desc: 'Official departmental staff, offer research equipment, books, academic peer tutoring.',
      icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
      userKey: 'faculty',
    },
    {
      role: 'resident',
      title: 'Campus-Adjacent Resident',
      desc: 'Local community member in university suburbs (Rondebosch, Braamfontein, Stellenbosch).',
      icon: <Home className="w-5 h-5 text-purple-600" />,
      userKey: 'resident',
    },
    {
      role: 'moderator',
      title: 'Campus Proctor & Fraud Lead',
      desc: 'Audit AI fraud alerts, verify CIPC business documents, oversee safe zone handovers.',
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      userKey: 'moderator',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Switch Community Role</h2>
            <p className="text-xs text-stone-500">
              Experience the marketplace from different campus stakeholders in South Africa
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {rolesConfig.map((item) => {
            const user = allUsers[item.userKey];
            if (!user) return null;
            const isSelected = currentUser.id === user.id;

            return (
              <button
                key={item.role}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/80'
                }`}
              >
                <div className="relative mt-0.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover border border-stone-200"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-xs">
                    {item.icon}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-stone-900 text-sm">{user.name}</span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-stone-700 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{user.badgeLabel}</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-snug">{item.desc}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-500">
                    <span>{user.campusOrArea}</span>
                    <span>·</span>
                    <span>{user.trustScore}% Trust Score</span>
                    <span>·</span>
                    <span>{user.dealsCompleted} Deals Done</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
