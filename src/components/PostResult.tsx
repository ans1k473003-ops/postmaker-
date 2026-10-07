import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Minimize2,
  Maximize2,
  Languages,
  Edit3,
  Save,
  X,
  Share2,
  Sparkles,
  HelpCircle,
  Hash,
  Eye,
  BookmarkCheck,
  Send,
  MessageSquare
} from 'lucide-react';
import { GeneratedPostData, StyleType } from '../types';
import { SocialMockup } from './SocialMockup';

interface PostResultProps {
  post: GeneratedPostData;
  onRegenerate: () => void;
  onModify: (action: 'shorter' | 'longer' | 'change_style' | 'translate' | 'clarify', options?: any) => Promise<void>;
  onUpdatePost: (updatedPost: Partial<GeneratedPostData>) => void;
  isModifying: boolean;
  onSaveToHistory: () => void;
  isSaved: boolean;
}

const STYLES_LIST: { id: StyleType; label: string; emoji: string }[] = [
  { id: 'engaging', label: 'Интересный', emoji: '✨' },
  { id: 'selling', label: 'Продающий', emoji: '🔥' },
  { id: 'friendly', label: 'Дружелюбный', emoji: '🤝' },
  { id: 'professional', label: 'Профессиональный', emoji: '💼' },
  { id: 'expert', label: 'Экспертный', emoji: '🧠' },
  { id: 'humorous', label: 'Юмористический', emoji: '😄' },
];

const TRANSLATE_LANGUAGES = [
  { id: 'ru', name: 'Русский', flag: '🇷🇺' },
  { id: 'uz', name: 'O‘zbek', flag: '🇺🇿' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'kk', name: 'Қазақша', flag: '🇰🇿' },
];

export const PostResult: React.FC<PostResultProps> = ({
  post,
  onRegenerate,
  onModify,
  onUpdatePost,
  isModifying,
  onSaveToHistory,
  isSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'alt0' | 'alt1'>('main');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPart, setCopiedPart] = useState<string | null>(null);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [showMockup, setShowMockup] = useState(true);

  // Edit draft states
  const [editHeadline, setEditHeadline] = useState(post.headline);
  const [editBody, setEditBody] = useState(post.body);
  const [editCTA, setEditCTA] = useState(post.callToAction);
  const [editFullText, setEditFullText] = useState(post.fullText);

  // Clarification reply input
  const [clarificationReply, setClarificationReply] = useState('');
  const [isReplyingClarification, setIsReplyingClarification] = useState(false);

  // Active post content based on selected tab
  const currentPostContent = () => {
    if (activeTab === 'alt0' && post.alternatives?.[0]) {
      return post.alternatives[0].fullText;
    }
    if (activeTab === 'alt1' && post.alternatives?.[1]) {
      return post.alternatives[1].fullText;
    }
    return post.fullText;
  };

  const handleCopy = (text: string, partName: string = 'full') => {
    navigator.clipboard.writeText(text);
    if (partName === 'full') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedPart(partName);
      setTimeout(() => setCopiedPart(null), 2000);
    }
  };

  const handleSaveEdit = () => {
    // Reconstruct full text
    const assembled = `${editHeadline ? editHeadline + '\n\n' : ''}${editBody}${editCTA ? '\n\n' + editCTA : ''}${
      post.hashtags?.length ? '\n\n' + post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ') : ''
    }`;

    onUpdatePost({
      headline: editHeadline,
      body: editBody,
      callToAction: editCTA,
      fullText: assembled,
    });
    setIsEditing(false);
  };

  const handleClarificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationReply.trim()) return;
    setIsReplyingClarification(true);
    await onModify('clarify', { clarificationAnswer: clarificationReply });
    setIsReplyingClarification(false);
    setClarificationReply('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Media AI analysis summary */}
      {post.mediaAnalysis && (
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3 backdrop-blur-md">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-xs sm:text-sm text-slate-200">
            <span className="font-bold text-indigo-300 block mb-0.5">
              AI проанализировал визуальный контент:
            </span>
            {post.mediaAnalysis}
          </div>
        </div>
      )}

      {/* Clarification Dialog Box (if AI asks for critical missing details) */}
      {post.clarificationQuestion && post.clarificationQuestion.trim() && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-amber-200">
                Уточняющий вопрос от AI для идеального поста:
              </h4>
              <p className="text-xs text-amber-100/90 mt-1 mb-3">
                {post.clarificationQuestion}
              </p>

              <form onSubmit={handleClarificationSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={clarificationReply}
                  onChange={(e) => setClarificationReply(e.target.value)}
                  placeholder="Напишите ответ (например: 'Скидка 25%, акция до пятницы')..."
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-amber-500/30 text-xs text-white placeholder:text-amber-200/50 outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={isReplyingClarification || !clarificationReply.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isReplyingClarification ? (
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Дополнить
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Result Card */}
      <div className="bg-[#0f111c]/95 border border-purple-900/30 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl relative">
        {/* Loading overlay during modification */}
        {isModifying && (
          <div className="absolute inset-0 bg-[#08090e]/80 backdrop-blur-sm z-30 rounded-3xl flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-indigo-200">
              AI обновляет публикацию по вашему запросу...
            </p>
          </div>
        )}

        {/* Top Bar: Tabs for Main & Alternatives + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          {/* Alternatives Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#141726] rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('main')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'main'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Основной пост
            </button>

            {post.alternatives?.[0] && (
              <button
                onClick={() => setActiveTab('alt0')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'alt0'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {post.alternatives[0].label || 'Вариант 2'}
              </button>
            )}

            {post.alternatives?.[1] && (
              <button
                onClick={() => setActiveTab('alt1')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'alt1'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {post.alternatives[1].label || 'Вариант 3'}
              </button>
            )}
          </div>

          {/* Quick Mockup Toggle & Save */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMockup(!showMockup)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                showMockup
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {showMockup ? 'Скрыть превью' : 'Превью соцсети'}
            </button>

            <button
              onClick={onSaveToHistory}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isSaved
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              {isSaved ? 'Сохранено' : 'В историю'}
            </button>
          </div>
        </div>

        {/* Content Body: Grid layout (Left: Post breakdown / Right: Mockup) */}
        <div className={`grid grid-cols-1 ${showMockup ? 'lg:grid-cols-12 gap-8' : ''} pt-6`}>
          {/* Post Text & Breakdown */}
          <div className={showMockup ? 'lg:col-span-7 space-y-6' : 'space-y-6 max-w-3xl mx-auto'}>
            {activeTab === 'main' ? (
              !isEditing ? (
                <>
                  {/* Headline (Hook) */}
                  {post.headline && (
                    <div className="p-4 rounded-2xl bg-[#141726] border border-white/5 space-y-1.5 relative group">
                      <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Цепляющий заголовок (Hook):
                        </span>
                        <button
                          onClick={() => handleCopy(post.headline, 'headline')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          {copiedPart === 'headline' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          Скопировать
                        </button>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-white leading-snug">
                        {post.headline}
                      </p>
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="p-4 rounded-2xl bg-[#141726] border border-white/5 space-y-2 relative group">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span>Основной текст:</span>
                      <button
                        onClick={() => handleCopy(post.body, 'body')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        {copiedPart === 'body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        Скопировать
                      </button>
                    </div>
                    <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                      {post.body}
                    </div>
                  </div>

                  {/* Call to Action */}
                  {post.callToAction && (
                    <div className="p-3.5 rounded-2xl bg-indigo-950/25 border border-indigo-500/20 space-y-1">
                      <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                        Призыв к действию (CTA):
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {post.callToAction}
                      </p>
                    </div>
                  )}

                  {/* Hashtags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5 text-blue-400" /> Релевантные хештеги:
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' '),
                              'hashtags'
                            )
                          }
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          {copiedPart === 'hashtags' ? 'Скопировано!' : 'Скопировать все теги'}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {post.hashtags.map((tag, idx) => {
                          const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleCopy(formattedTag, `tag-${idx}`)}
                              className="px-2.5 py-1 rounded-lg bg-[#141726] border border-white/5 text-xs text-blue-300 hover:bg-blue-900/30 hover:border-blue-500/30 transition-all cursor-pointer"
                              title="Нажмите, чтобы скопировать хештег"
                            >
                              {copiedPart === `tag-${idx}` ? '✓ ' : ''}
                              {formattedTag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Inline Editor Mode */
                <div className="space-y-4 p-5 rounded-2xl bg-[#121422] border border-indigo-500/40">
                  <div className="flex items-center justify-between text-sm font-bold text-white">
                    <span className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-indigo-400" /> Режим ручного редактирования
                    </span>
                    <div className="text-xs text-slate-400">
                      {editFullText.length} символов
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      Заголовок:
                    </label>
                    <input
                      type="text"
                      value={editHeadline}
                      onChange={(e) => setEditHeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#161928] border border-slate-700 text-sm text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      Основной текст:
                    </label>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={6}
                      className="w-full p-3 rounded-xl bg-[#161928] border border-slate-700 text-sm text-white outline-none focus:border-indigo-500 leading-relaxed resize-y"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      Призыв к действию (CTA):
                    </label>
                    <input
                      type="text"
                      value={editCTA}
                      onChange={(e) => setEditCTA(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#161928] border border-slate-700 text-sm text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-all"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Сохранить изменения
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* Alternative Post Tab */
              <div className="p-5 rounded-2xl bg-[#141726] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {activeTab === 'alt0' ? post.alternatives?.[0]?.toneHint : post.alternatives?.[1]?.toneHint}
                  </span>
                  <button
                    onClick={() => handleCopy(currentPostContent())}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Скопировать этот вариант
                  </button>
                </div>

                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {currentPostContent()}
                </div>
              </div>
            )}
          </div>

          {/* Social Network Live Mockup */}
          {showMockup && (
            <div className="lg:col-span-5 flex flex-col justify-start">
              <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                Как пост будет выглядеть в {post.settings.platform.toUpperCase()}:
              </div>

              <SocialMockup
                platform={post.settings.platform}
                headline={post.headline}
                body={post.body}
                callToAction={post.callToAction}
                hashtags={post.hashtags}
                fullText={post.fullText}
                mediaPreview={post.mediaPreviews?.[0]}
              />
            </div>
          )}
        </div>

        {/* Required Bottom Actions Toolbar:
            «Скопировать пост», «Создать новый вариант», «Изменить стиль»,
            «Сделать короче», «Сделать длиннее», «Перевести», «Редактировать текст»
        */}
        <div className="pt-8 mt-6 border-t border-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Primary Action: Copy Full Post */}
            <button
              onClick={() => handleCopy(currentPostContent(), 'full')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Пост скопирован!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Скопировать пост</span>
                </>
              )}
            </button>

            {/* Quick AI Refine Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* «Создать новый вариант» */}
              <button
                onClick={onRegenerate}
                className="px-3.5 py-2.5 rounded-xl bg-[#141726] hover:bg-[#1a1e30] border border-white/10 text-slate-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                title="Сгенерировать абсолютно новый вариант поста с теми же настройками"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Создать новый вариант</span>
              </button>

              {/* «Изменить стиль» */}
              <button
                onClick={() => setShowStyleModal(!showStyleModal)}
                className="px-3.5 py-2.5 rounded-xl bg-[#141726] hover:bg-[#1a1e30] border border-white/10 text-slate-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer relative"
              >
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Изменить стиль</span>
              </button>

              {/* «Сделать короче» */}
              <button
                onClick={() => onModify('shorter')}
                className="px-3.5 py-2.5 rounded-xl bg-[#141726] hover:bg-[#1a1e30] border border-white/10 text-slate-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                title="Сократить текст без потери главного смысла"
              >
                <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Сделать короче</span>
              </button>

              {/* «Сделать длиннее» */}
              <button
                onClick={() => onModify('longer')}
                className="px-3.5 py-2.5 rounded-xl bg-[#141726] hover:bg-[#1a1e30] border border-white/10 text-slate-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                title="Расширить текст и добавить интересных подробностей"
              >
                <Maximize2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Сделать длиннее</span>
              </button>

              {/* «Перевести» */}
              <button
                onClick={() => setShowTranslateModal(!showTranslateModal)}
                className="px-3.5 py-2.5 rounded-xl bg-[#141726] hover:bg-[#1a1e30] border border-white/10 text-slate-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span>Перевести</span>
              </button>

              {/* «Редактировать текст» */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isEditing
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-[#141726] hover:bg-[#1a1e30] border-white/10 text-slate-200 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEditing ? 'Закрыть редактор' : 'Редактировать текст'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Change Style Popover Modal */}
        {showStyleModal && (
          <div className="mt-4 p-4 rounded-2xl bg-[#141726] border border-purple-500/40 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-400" /> Выберите новый стиль для мгновенной адаптации:
              </span>
              <button onClick={() => setShowStyleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLES_LIST.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setShowStyleModal(false);
                    onModify('change_style', { newStyle: s.id });
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-purple-950/40 border border-white/5 hover:border-purple-500/40 text-left text-xs text-slate-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{s.emoji}</span>
                  <span className="font-semibold">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Translate Popover Modal */}
        {showTranslateModal && (
          <div className="mt-4 p-4 rounded-2xl bg-[#141726] border border-emerald-500/40 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-emerald-400" /> Выберите язык для перевода и адаптации:
              </span>
              <button onClick={() => setShowTranslateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TRANSLATE_LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setShowTranslateModal(false);
                    onModify('translate', { targetLanguage: lang.id });
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/40 text-left text-xs text-slate-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="font-semibold">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
