import React from 'react';
import { Sparkles, ArrowDown, Image as ImageIcon, Video, Wand2, ShieldCheck, CheckCircle2, Instagram, Send, Youtube } from 'lucide-react';

interface HeroProps {
  onStartCreating: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartCreating }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-blue-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-indigo-500/15 to-blue-500/10 border border-purple-500/30 text-purple-200 text-xs sm:text-sm font-medium mb-6 shadow-sm shadow-purple-500/10 animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Умный AI-копирайтер нового поколения</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span className="text-slate-400 text-xs hidden sm:inline">Анализ фото и видео</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          Создавай{' '}
          <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            идеальные посты
          </span>{' '}
          за секунды
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed mb-10">
          Загрузи фото или видео, расскажи свою идею — искусственный интеллект
          создаст готовую публикацию, идеально подходящую для твоей аудитории.
        </p>

        {/* Main Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onStartCreating}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-base sm:text-lg shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Создать пост</span>
            <ArrowDown className="w-4 h-4 opacity-70 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Highlight features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-[#121422]/70 border border-white/5 backdrop-blur-sm flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Анализ фото</div>
              <div className="text-[11px] text-slate-400">Считывает объекты и стиль</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121422]/70 border border-white/5 backdrop-blur-sm flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Анализ видео</div>
              <div className="text-[11px] text-slate-400">Понимание кадров и сюжета</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121422]/70 border border-white/5 backdrop-blur-sm flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Без штампов</div>
              <div className="text-[11px] text-slate-400">Живой естественный язык</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121422]/70 border border-white/5 backdrop-blur-sm flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Без вымысла</div>
              <div className="text-[11px] text-slate-400">Только реальные факты</div>
            </div>
          </div>
        </div>

        {/* Supported social platforms */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
          <span>Поддерживаемые форматы:</span>
          <div className="flex items-center gap-4 text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
              <Instagram className="w-4 h-4 text-pink-400" /> Instagram
            </span>
            <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              <span className="font-bold text-cyan-400">TT</span> TikTok
            </span>
            <span className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
              <Send className="w-4 h-4 text-sky-400" /> Telegram
            </span>
            <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
              <Youtube className="w-4 h-4 text-red-400" /> YouTube
            </span>
            <span className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <span className="font-bold text-blue-400">FB</span> Facebook
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
