import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Video,
  X,
  Play,
  Sparkles,
  HelpCircle,
  Check,
  AlertCircle,
  Instagram,
  Send,
  Youtube,
  Layers,
  Lightbulb,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  PlatformType,
  StyleType,
  LengthType,
  GoalType,
  PostSettings,
  UploadedMedia
} from '../types';
import { extractVideoKeyframes, fileToBase64 } from '../utils/videoExtractor';

interface PostCreatorProps {
  onGenerate: (data: {
    description: string;
    settings: PostSettings;
    media: UploadedMedia[];
  }) => Promise<void>;
  isLoading: boolean;
  userCredits: number;
  userPlan: string;
  onOpenPricing: () => void;
}

const PLATFORMS: { id: PlatformType; name: string; icon: React.ReactNode; color: string; badge: string }[] = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4" />, color: 'from-pink-500 via-purple-500 to-amber-500', badge: 'Reels / Пост' },
  { id: 'telegram', name: 'Telegram', icon: <Send className="w-4 h-4" />, color: 'from-sky-400 to-blue-600', badge: 'Канал / Чат' },
  { id: 'tiktok', name: 'TikTok', icon: <span className="font-black text-xs">TT</span>, color: 'from-cyan-400 to-pink-500', badge: 'Вирусный Hook' },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4" />, color: 'from-red-500 to-rose-700', badge: 'Shorts / Описание' },
  { id: 'facebook', name: 'Facebook', icon: <span className="font-black text-xs">FB</span>, color: 'from-blue-600 to-indigo-700', badge: 'Сообщество' },
];

const STYLES: { id: StyleType; label: string; desc: string; emoji: string }[] = [
  { id: 'engaging', label: 'Интересный', desc: 'Увлекательный сторителлинг и эмоции', emoji: '✨' },
  { id: 'selling', label: 'Продающий', desc: 'Формулы AIDA, фокус на выгодах и покупке', emoji: '🔥' },
  { id: 'friendly', label: 'Дружелюбный', desc: 'Теплый, душевный разговор на равных', emoji: '🤝' },
  { id: 'professional', label: 'Профессиональный', desc: 'Четкий, деловой, структурированный', emoji: '💼' },
  { id: 'expert', label: 'Экспертный', desc: 'Глубокий анализ, польза и авторитет', emoji: '🧠' },
  { id: 'humorous', label: 'Юмористический', desc: 'С юмором, самоиронией и легкостью', emoji: '😄' },
];

const LENGTHS: { id: LengthType; label: string; chars: string }[] = [
  { id: 'short', label: 'Короткий', chars: '~200-350 знаков' },
  { id: 'medium', label: 'Средний', chars: '~450-800 знаков' },
  { id: 'long', label: 'Длинный', chars: '~900-1500+ знаков' },
];

const GOALS: { id: GoalType; label: string; icon: string }[] = [
  { id: 'personal_blog', label: 'Личный блог', icon: '👤' },
  { id: 'sales', label: 'Продажи', icon: '💰' },
  { id: 'ads', label: 'Реклама', icon: '📣' },
  { id: 'informative', label: 'Информирование', icon: '📰' },
  { id: 'entertainment', label: 'Развлечение', icon: '🎉' },
];

const LANGUAGES = [
  { id: 'ru', name: 'Русский', flag: '🇷🇺' },
  { id: 'uz', name: 'O‘zbek tili', flag: '🇺🇿' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'kk', name: 'Қазақ тілі', flag: '🇰🇿' },
];

const IDEA_PROMPTS = [
  'Анонс новинки: запускаем премиальный кофе в зернах со скидкой 20% в честь открытия',
  'Личная история: как я преодолел страх публичных выступлений и провел вебинар на 500 человек',
  'Полезный совет: 3 неочевидные ошибки при настройке рекламы, которые сливают бюджет',
  'Отзыв довольного клиента и результаты работы за последний месяц',
  'Закулисье процесса: показываем, как мы упаковываем и готовим ваши заказы к отправке',
];

export const PostCreator: React.FC<PostCreatorProps> = ({
  onGenerate,
  isLoading,
  userCredits,
  userPlan,
  onOpenPricing,
}) => {
  const [mediaList, setMediaList] = useState<UploadedMedia[]>([]);
  const [description, setDescription] = useState('');
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(true);

  // Settings
  const [platform, setPlatform] = useState<PlatformType>('instagram');
  const [style, setStyle] = useState<StyleType>('engaging');
  const [length, setLength] = useState<LengthType>('medium');
  const [language, setLanguage] = useState<string>('ru');
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(true);
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);
  const [goal, setGoal] = useState<GoalType>('personal_blog');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file uploads (both image and video)
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingMedia(true);

    const newMediaItems: UploadedMedia[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isImage && !isVideo) continue;

      const previewUrl = URL.createObjectURL(file);
      const id = Math.random().toString(36).substring(2, 9);

      if (isImage) {
        try {
          const { base64Data, mimeType } = await fileToBase64(file);
          newMediaItems.push({
            id,
            type: 'image',
            file,
            previewUrl,
            name: file.name,
            size: file.size,
            base64Data,
            mimeType,
          });
        } catch (e) {
          console.error('Failed to read image:', e);
        }
      } else if (isVideo) {
        try {
          // Extract video keyframes so Gemini understands the true video content
          const frames = await extractVideoKeyframes(file, 4);
          newMediaItems.push({
            id,
            type: 'video',
            file,
            previewUrl,
            name: file.name,
            size: file.size,
            mimeType: file.type || 'video/mp4',
            extractedFrames: frames,
          });
        } catch (e) {
          console.error('Failed to extract video frames:', e);
          newMediaItems.push({
            id,
            type: 'video',
            file,
            previewUrl,
            name: file.name,
            size: file.size,
            mimeType: file.type || 'video/mp4',
          });
        }
      }
    }

    setMediaList((prev) => [...prev, ...newMediaItems]);
    setIsProcessingMedia(false);
  };

  const removeMedia = (id: string) => {
    setMediaList((prev) => {
      const item = prev.find((m) => m.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((m) => m.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() && mediaList.length === 0) {
      alert('Пожалуйста, загрузите фото/видео или напишите описание для поста.');
      return;
    }

    if (userPlan === 'free' && userCredits <= 0) {
      onOpenPricing();
      return;
    }

    const settings: PostSettings = {
      platform,
      style,
      length,
      language,
      includeEmojis,
      includeHashtags,
      goal,
    };

    await onGenerate({
      description,
      settings,
      media: mediaList,
    });
  };

  return (
    <div id="creator-section" className="scroll-mt-20">
      <div className="bg-[#0f111c]/90 border border-purple-900/30 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-purple-950/20 backdrop-blur-xl relative overflow-hidden">
        {/* Glowing top border subtle gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500" />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Мастер создания поста</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI v3.8
                </span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Загрузи медиафайлы или опиши мысль — остальное сделает искусственный интеллект
              </p>
            </div>

            {/* Quick stats / Plan notice */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Доступно: <strong className="text-slate-200">{userPlan === 'free' ? `${userCredits} генераций` : 'Безлимит'}</strong>
              </span>
            </div>
          </div>

          {/* Section 1: Media Upload (Photos & Video) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                1. Загрузка контента (Фото или Видео)
                <span className="text-xs text-slate-400 font-normal">(необязательно, но AI учтет визуал)</span>
              </label>

              {mediaList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMediaList([])}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Очистить все ({mediaList.length})
                </button>
              )}
            </div>

            {/* Drag & Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500/60 rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#121422]/50 hover:bg-indigo-950/15 group relative"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Нажми для выбора файлов или перетащи сюда
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Поддерживаются фотографии (JPG, PNG, WEBP, несколько штук) и видео (MP4, MOV, WebM)
                  </p>
                </div>
              </div>

              {isProcessingMedia && (
                <div className="absolute inset-0 bg-[#0f111c]/90 rounded-2xl flex items-center justify-center gap-3 text-indigo-300 text-sm font-medium backdrop-blur-sm">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span>Обработка медиа и извлечение кадров...</span>
                </div>
              )}
            </div>

            {/* Media Previews Gallery */}
            {mediaList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {mediaList.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-xl overflow-hidden bg-[#161928] border border-white/10 aspect-video flex flex-col justify-end"
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-black/60 flex items-center justify-center">
                        <video
                          src={item.previewUrl}
                          className="w-full h-full object-cover opacity-80"
                          muted
                          loop
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-9 h-9 rounded-full bg-purple-600/80 backdrop-blur-sm flex items-center justify-center text-white shadow-lg">
                            <Play className="w-4 h-4 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay & Badge */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-[11px] text-white">
                      <span className="flex items-center gap-1 font-medium truncate max-w-[110px]">
                        {item.type === 'image' ? (
                          <ImageIcon className="w-3 h-3 text-pink-400 shrink-0" />
                        ) : (
                          <Video className="w-3 h-3 text-cyan-400 shrink-0" />
                        )}
                        {item.name}
                      </span>

                      {item.type === 'video' && item.extractedFrames && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                          {item.extractedFrames.length} кадра AI
                        </span>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeMedia(item.id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Удалить"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Text Description & Ideas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                2. Описание публикации или идея
                <span className="text-xs text-slate-400 font-normal">(AI исправит ошибки и усилит подачу)</span>
              </label>

              <span className="text-xs text-slate-400">
                {description.length} знаков
              </span>
            </div>

            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Напиши своими словами, о чем пост... Например: 'Сегодня провели мастер-класс по рисованию для детей, все были в восторге, а в субботу делаем второй поток. Запись в директ'."
                className="w-full rounded-2xl bg-[#121422] border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-4 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none resize-y"
              />
            </div>

            {/* Quick Prompt Ideas */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-300 no-scrollbar">
              <span className="text-slate-400 shrink-0 flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Быстрые идеи:
              </span>
              {IDEA_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDescription(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-200 border border-white/5 transition-all shrink-0 text-left truncate max-w-[200px]"
                  title={prompt}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Post Settings */}
          <div className="space-y-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                3. Настройка параметров публикации
              </h3>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                {showAdvanced ? 'Свернуть' : 'Развернуть'}
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showAdvanced && (
              <div className="space-y-6 animate-fade-in">
                {/* 1. Social Platform */}
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2.5">
                    Социальная сеть:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {PLATFORMS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPlatform(item.id)}
                        className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 ${
                          platform === item.id
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/20 text-white'
                            : 'bg-[#121422] border-white/5 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} text-white shadow-sm`}>
                            {item.icon}
                          </div>
                          {platform === item.id && (
                            <Check className="w-4 h-4 text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{item.name}</div>
                          <div className="text-[10px] text-slate-400">{item.badge}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Text Style */}
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2.5">
                    Стиль текста:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {STYLES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStyle(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          style === item.id
                            ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm'
                            : 'bg-[#121422] border-white/5 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="text-base mb-1">{item.emoji}</div>
                        <div className="text-xs font-semibold">{item.label}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Length & Language & Goal Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Length */}
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-2">
                      Длина поста:
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#121422] rounded-xl border border-white/5">
                      {LENGTHS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLength(item.id)}
                          className={`py-2 px-1 rounded-lg text-center transition-all ${
                            length === item.id
                              ? 'bg-indigo-600 text-white font-semibold text-xs shadow-sm'
                              : 'text-slate-300 hover:text-white text-xs'
                          }`}
                        >
                          <div>{item.label}</div>
                          <div className="text-[9px] opacity-75">{item.chars}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-2">
                      Язык публикации:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => setLanguage(lang.id)}
                          className={`py-2 px-2.5 rounded-xl border flex items-center gap-2 text-xs transition-all ${
                            language === lang.id
                              ? 'bg-indigo-950/40 border-indigo-500 text-white font-medium'
                              : 'bg-[#121422] border-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <span className="text-sm">{lang.flag}</span>
                          <span className="truncate">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal */}
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-2">
                      Цель публикации:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {GOALS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGoal(g.id)}
                          className={`py-2 px-2 rounded-xl border flex items-center gap-1.5 text-xs transition-all ${
                            goal === g.id
                              ? 'bg-purple-950/40 border-purple-500 text-white font-medium'
                              : 'bg-[#121422] border-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <span>{g.icon}</span>
                          <span className="truncate">{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Toggles (Emojis & Hashtags) */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {/* Emoji toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer bg-[#121422] px-3.5 py-2 rounded-xl border border-white/5 hover:border-white/10 transition-all select-none">
                    <input
                      type="checkbox"
                      checked={includeEmojis}
                      onChange={(e) => setIncludeEmojis(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                        includeEmojis ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          includeEmojis ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <span className="text-xs text-slate-200 font-medium">
                      Использовать эмодзи 😀
                    </span>
                  </label>

                  {/* Hashtags toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer bg-[#121422] px-3.5 py-2 rounded-xl border border-white/5 hover:border-white/10 transition-all select-none">
                    <input
                      type="checkbox"
                      checked={includeHashtags}
                      onChange={(e) => setIncludeHashtags(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                        includeHashtags ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          includeHashtags ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <span className="text-xs text-slate-200 font-medium">
                      Подобрать хештеги #️⃣
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isProcessingMedia}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base text-white shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer ${
                isLoading || isProcessingMedia
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI анализирует контент и пишет публикацию...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>Сгенерировать пост</span>
                </>
              )}
            </button>

            {/* Anti-hallucination guarantee note */}
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs text-center mt-3">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                AI пишет живым языком, проверяет грамматику и опирается только на ваши факты
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
