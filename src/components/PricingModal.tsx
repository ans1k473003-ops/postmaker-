import React from 'react';
import { Check, Crown, Zap, Shield, Sparkles, X } from 'lucide-react';
import { UserAccount } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onUpgradePlan: (plan: 'free' | 'pro' | 'agency') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpgradePlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0e101a] border border-purple-900/40 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Crown className="w-3.5 h-3.5" />
            Инвестируй в качество своего контента
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Тарифы и возможности PostMaker AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Создавай виральный контент быстрее конкурентов. Никаких шаблонных текстов — только живой авторский копирайтинг.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="p-6 rounded-2xl bg-[#121422] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Стартовый
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  Free
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">0 ₽</div>
              <p className="text-xs text-slate-400 mb-6">Для знакомства с AI-генератором</p>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">10 бесплатных генераций</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Анализ фото и текстов</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Все 5 соцсетей</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Глубокий анализ видео</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Мгновенный перевод постов</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5">
              {user.plan === 'free' ? (
                <div className="w-full py-2.5 rounded-xl bg-white/5 text-slate-400 text-xs font-semibold text-center">
                  Текущий тариф ({user.generationsLeft} ост.)
                </div>
              ) : (
                <button
                  onClick={() => {
                    onUpgradePlan('free');
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold text-center transition-all"
                >
                  Перейти на Free
                </button>
              )}
            </div>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/60 via-[#131526] to-[#0e101a] border-2 border-indigo-500 relative flex flex-col justify-between shadow-2xl shadow-indigo-600/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              Популярный выбор
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Pro Автор
                </span>
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">
                990 ₽ <span className="text-xs font-normal text-slate-400">/ мес</span>
              </div>
              <p className="text-xs text-indigo-200/80 mb-6">
                ~99 000 UZS или $12 / месяц
              </p>

              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-white">Безлимитные генерации постов</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Покадровый анализ видео</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Генерация 3 вариантов публикаций</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Быстрый перевод (RU, UZ, EN, KZ)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Умная смена стиля и длины поста</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-indigo-500/20">
              <button
                onClick={() => {
                  onUpgradePlan('pro');
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold text-center transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                {user.plan === 'pro' ? 'Продлить Pro' : 'Активировать Pro тариф'}
              </button>
            </div>
          </div>

          {/* Agency Tier */}
          <div className="p-6 rounded-2xl bg-[#121422] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Агентство
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Agency
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">
                2 990 ₽ <span className="text-xs font-normal text-slate-400">/ мес</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">Для SMM-команд и бизнеса</p>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Всё из тарифа Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Приоритетная скорость Gemini 3.8</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>До 5 аккаунтов команды</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Экспорт контент-планов</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Персональный менеджер</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5">
              <button
                onClick={() => {
                  onUpgradePlan('agency');
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold text-center transition-all cursor-pointer"
              >
                {user.plan === 'agency' ? 'Текущий тариф Agency' : 'Подключить Agency'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
