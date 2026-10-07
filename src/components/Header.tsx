import React from 'react';
import { Sparkles, Crown, Zap, User, Clock, PlusCircle } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  user: UserAccount;
  activeTab: 'generator' | 'history' | 'pricing';
  setActiveTab: (tab: 'generator' | 'history' | 'pricing') => void;
  onOpenPricing: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenPricing,
  onOpenProfile,
  onOpenAuth,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08090E]/80 border-b border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#0d0f17] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                PostMaker
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
              Генератор постов для соцсетей
            </p>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#121420]/80 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Создать пост
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4" />
            История
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-500/30 text-indigo-300 font-bold border border-indigo-500/40">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenPricing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Тарифы
          </button>
        </nav>

        {/* Right Action & Profile */}
        <div className="flex items-center gap-3">
          {/* Generation Limit Badge */}
          <div 
            onClick={onOpenPricing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-all text-xs"
            title="Остаток генераций. Нажмите, чтобы пополнить"
          >
            <Zap className={`w-3.5 h-3.5 ${user.plan === 'pro' || user.plan === 'agency' ? 'text-amber-400' : 'text-indigo-400'}`} />
            <span className="text-slate-300 font-medium">
              {user.plan === 'pro' || user.plan === 'agency' ? (
                <span className="text-amber-300 font-semibold">PRO Безлимит</span>
              ) : (
                <span>
                  <strong className="text-indigo-300">{user.generationsLeft}</strong> ген.
                </span>
              )}
            </span>
          </div>

          {/* Upgrade CTA */}
          {user.plan === 'free' && (
            <button
              onClick={onOpenPricing}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-all shadow-sm"
            >
              <Crown className="w-3.5 h-3.5" />
              Подписка PRO
            </button>
          )}

          {/* Profile / User */}
          <button
            onClick={() => {
              if (user.id === 'guest') {
                onOpenAuth();
              } else {
                onOpenProfile();
              }
            }}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#141724] border border-white/10 hover:border-indigo-500/40 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-medium text-slate-200 hidden sm:block max-w-[100px] truncate">
              {user.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
