import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, Check } from 'lucide-react';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: Partial<UserAccount>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || (email ? email.split('@')[0] : 'Создатель');
    onLogin({
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      name: finalName,
      email: email || 'user@postmaker.ai',
      plan: 'free',
      generationsLeft: 10,
      totalGenerations: 0,
    });
    onClose();
  };

  const handleDemoLogin = () => {
    onLogin({
      id: 'demo_user',
      name: 'Алексей Смирнов',
      email: 'alex@creator.io',
      plan: 'pro',
      generationsLeft: 9999,
      totalGenerations: 12,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f111c] border border-purple-900/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {isRegister ? 'Создать аккаунт PostMaker' : 'Вход в личный кабинет'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Сохраняй историю публикаций и управляй генерациями с любого устройства
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#141726] rounded-xl border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isRegister ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Войти
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isRegister ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Ваше имя:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required={isRegister}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Петров"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141726] border border-slate-700/80 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Электронная почта:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141726] border border-slate-700/80 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Пароль:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141726] border border-slate-700/80 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            {isRegister ? 'Зарегистрироваться' : 'Войти в аккаунт'}
          </button>
        </form>

        {/* Demo Fast Login Option */}
        <div className="pt-5 mt-5 border-t border-white/5 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Быстрый вход в демонстрационный PRO-аккаунт
          </button>
        </div>
      </div>
    </div>
  );
};
