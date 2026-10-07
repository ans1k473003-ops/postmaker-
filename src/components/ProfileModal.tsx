import React from 'react';
import { X, Crown, Zap, User, Clock, Sparkles, LogOut, CheckCircle } from 'lucide-react';
import { UserAccount } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onLogout: () => void;
  onOpenPricing: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onOpenPricing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f111c] border border-purple-900/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full rounded-2xl bg-[#141726] flex items-center justify-center text-white text-xl font-bold">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{user.name}</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  user.plan === 'pro' || user.plan === 'agency'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {user.plan}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#141726] border border-white/5">
            <div className="text-[11px] text-slate-400">Остаток генераций</div>
            <div className="text-xl font-extrabold text-white mt-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              {user.plan === 'pro' || user.plan === 'agency' ? '∞ Безлимит' : user.generationsLeft}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#141726] border border-white/5">
            <div className="text-[11px] text-slate-400">Всего создано постов</div>
            <div className="text-xl font-extrabold text-white mt-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              {user.totalGenerations}
            </div>
          </div>
        </div>

        {/* Plan Upgrade Banner */}
        {user.plan === 'free' && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 mb-6 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" /> Тариф Free
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Переходи на PRO для безлимитной генерации
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs shrink-0 cursor-pointer shadow-sm"
            >
              Улучшить
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenPricing();
            }}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Управление тарифом и подпиской
          </button>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
};
