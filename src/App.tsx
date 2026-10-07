import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PostCreator } from './components/PostCreator';
import { PostResult } from './components/PostResult';
import { PostHistory } from './components/PostHistory';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { GeneratedPostData, PostSettings, UploadedMedia, UserAccount } from './types';
import { Sparkles, ShieldCheck, Heart, Zap, Instagram, Send, Youtube } from 'lucide-react';

const INITIAL_USER: UserAccount = {
  id: 'guest',
  name: 'Пользователь',
  email: 'guest@postmaker.ai',
  plan: 'free',
  generationsLeft: 10,
  totalGenerations: 0,
  joinedDate: new Date().toISOString(),
};

const SAMPLE_POSTS: GeneratedPostData[] = [
  {
    id: 'sample-1',
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
    headline: 'Готовы к обновлению своего гардероба? Новая коллекция уже здесь! 🌿',
    body: 'Мы создали эту капсулу для тех, кто ценит минимализм, натуральные ткани и безупречный крой.\n\nКаждая деталь продумана до мелочей: от посадки до мягких дышащих текстур, в которых комфортно с утра до самого вечера.\n\nКоличество изделий первой партии строго ограничено — успейте забрать свои любимые позиции.',
    callToAction: 'Переходите по ссылке в профиле или пишите нам в Direct, чтобы оформить заказ с бесплатной примеркой!',
    hashtags: ['#новаяколлекция', '#стильнаяодежда', '#модныйгардероб', '#капсула2026', '#базовыйгардероб'],
    fullText: 'Готовы к обновлению своего гардероба? Новая коллекция уже здесь! 🌿\n\nМы создали эту капсулу для тех, кто ценит минимализм, натуральные ткани и безупречный крой.\n\nКаждая деталь продумана до мелочей: от посадки до мягких дышащих текстур, в которых комфортно с утра до самого вечера.\n\nКоличество изделий первой партии строго ограничено — успейте забрать свои любимые позиции.\n\n👉 Переходите по ссылке в профиле или пишите нам в Direct, чтобы оформить заказ с бесплатной примеркой!\n\n#новаяколлекция #стильнаяодежда #модныйгардероб #капсула2026 #базовыйгардероб',
    mediaAnalysis: 'На фото продемонстрирован элегантный минималистичный лук в бежево-льняных тонах в светлой студии.',
    settings: {
      platform: 'instagram',
      style: 'selling',
      length: 'medium',
      language: 'ru',
      includeEmojis: true,
      includeHashtags: true,
      goal: 'sales',
    },
    alternatives: [
      {
        label: 'Динамичный Reels',
        fullText: 'Твой идеальный весенний образ найден! 🔥 Минимализм, посадка по фигуре и премиальный лён. Пиши "ХОЧУ" в комментариях — вышлем персональную скидку 15% на первый заказ прямо сейчас! #лукдня #тренды2026',
        toneHint: 'Короткий, продающий, с фокусом на комментирование',
      },
      {
        label: 'Экспертный отзыв',
        fullText: 'Как собрать капсульный гардероб из 5 вещей? Начните с базового кроя и природных оттенков. Наша новая линейка создана именно для тех, кто ценит универсальность и комфорт. Ссылка в шапке профиля!',
        toneHint: 'Полезный совет с мягкой интеграцией продукта',
      },
    ],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'history' | 'pricing'>('generator');

  // User state
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('postmaker_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.plan === 'free') {
          // Grant 10 free generations
          parsed.generationsLeft = Math.max(parsed.generationsLeft ?? 0, 10);
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USER;
  });

  // History state
  const [history, setHistory] = useState<GeneratedPostData[]>(() => {
    const saved = localStorage.getItem('postmaker_history');
    return saved ? JSON.parse(saved) : SAMPLE_POSTS;
  });

  // Active generated post
  const [currentPost, setCurrentPost] = useState<GeneratedPostData | null>(null);

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  // Modals
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('postmaker_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('postmaker_history', JSON.stringify(history));
  }, [history]);

  // Handle plan upgrade
  const handleUpgradePlan = (plan: 'free' | 'pro' | 'agency') => {
    setUser((prev) => ({
      ...prev,
      plan,
      generationsLeft: plan === 'free' ? 10 : 9999,
    }));
    showToast(
      plan === 'pro'
        ? '🎉 Тариф PRO успешно активирован! Безлимитные генерации открыты.'
        : plan === 'agency'
        ? '🚀 Тариф Agency успешно активирован!'
        : 'Переключено на базовый тариф'
    );
  };

  // Main Generation Handler
  const handleGenerate = async ({
    description,
    settings,
    media,
  }: {
    description: string;
    settings: PostSettings;
    media: UploadedMedia[];
  }) => {
    if (user.plan === 'free' && user.generationsLeft <= 0) {
      setIsPricingOpen(true);
      return;
    }

    setIsGenerating(true);

    try {
      // Assemble multimodal payload
      const mediaPayload: { mimeType: string; data: string; name?: string }[] = [];
      let mediaType: 'photo' | 'video' | 'mixed' | 'none' = 'none';

      const hasImages = media.some((m) => m.type === 'image');
      const hasVideos = media.some((m) => m.type === 'video');

      if (hasImages && hasVideos) mediaType = 'mixed';
      else if (hasVideos) mediaType = 'video';
      else if (hasImages) mediaType = 'photo';

      for (const item of media) {
        if (item.type === 'image' && item.base64Data) {
          mediaPayload.push({
            mimeType: item.mimeType,
            data: item.base64Data,
            name: item.name,
          });
        } else if (item.type === 'video') {
          // If video has extracted keyframes, push them
          if (item.extractedFrames && item.extractedFrames.length > 0) {
            for (const frame of item.extractedFrames) {
              mediaPayload.push({
                mimeType: frame.mimeType,
                data: frame.base64Data,
                name: `${item.name} (кадр на ${frame.timestamp}s)`,
              });
            }
          }
        }
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          platform: settings.platform,
          style: settings.style,
          length: settings.length,
          language: settings.language,
          includeEmojis: settings.includeEmojis,
          includeHashtags: settings.includeHashtags,
          goal: settings.goal,
          media: mediaPayload,
          mediaType,
          action: 'generate',
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Ошибка при генерации публикации');
      }

      const data = resData.data;

      const newPost: GeneratedPostData = {
        id: 'post_' + Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        headline: data.headline || '',
        body: data.body || '',
        callToAction: data.callToAction || '',
        hashtags: Array.isArray(data.hashtags) ? data.hashtags : [],
        fullText: data.fullText || `${data.headline}\n\n${data.body}\n\n${data.callToAction}`,
        mediaAnalysis: data.mediaAnalysis || '',
        clarificationQuestion: data.clarificationQuestion || '',
        alternatives: Array.isArray(data.alternatives) ? data.alternatives : [],
        settings,
        mediaPreviews: media.map((m) => ({ type: m.type, url: m.previewUrl })),
        descriptionPrompt: description,
      };

      setCurrentPost(newPost);

      // Decrement credits if free
      setUser((prev) => ({
        ...prev,
        generationsLeft: prev.plan === 'free' ? Math.max(0, prev.generationsLeft - 1) : prev.generationsLeft,
        totalGenerations: prev.totalGenerations + 1,
      }));

      // Automatically prepend to history
      setHistory((prev) => [newPost, ...prev]);

      showToast('✨ Пост успешно сгенерирован!');

      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      alert('Ошибка при генерации: ' + (err.message || 'Попробуйте ещё раз'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick Post Modification Handler (shorter, longer, change style, translate, clarify)
  const handleModify = async (
    action: 'shorter' | 'longer' | 'change_style' | 'translate' | 'clarify',
    options?: any
  ) => {
    if (!currentPost) return;
    setIsModifying(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: currentPost.descriptionPrompt || '',
          platform: currentPost.settings.platform,
          style: currentPost.settings.style,
          length: currentPost.settings.length,
          language: currentPost.settings.language,
          includeEmojis: currentPost.settings.includeEmojis,
          includeHashtags: currentPost.settings.includeHashtags,
          goal: currentPost.settings.goal,
          action,
          currentPost: currentPost.fullText,
          newStyle: options?.newStyle,
          targetLanguage: options?.targetLanguage,
          clarificationAnswer: options?.clarificationAnswer,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Ошибка модификации поста');
      }

      const data = resData.data;

      const updatedPost: GeneratedPostData = {
        ...currentPost,
        headline: data.headline || currentPost.headline,
        body: data.body || currentPost.body,
        callToAction: data.callToAction || currentPost.callToAction,
        hashtags: Array.isArray(data.hashtags) ? data.hashtags : currentPost.hashtags,
        fullText: data.fullText || `${data.headline}\n\n${data.body}\n\n${data.callToAction}`,
        clarificationQuestion: data.clarificationQuestion || '',
        alternatives: Array.isArray(data.alternatives) && data.alternatives.length > 0 ? data.alternatives : currentPost.alternatives,
      };

      setCurrentPost(updatedPost);

      // Also update in history
      setHistory((prev) =>
        prev.map((item) => (item.id === currentPost.id ? updatedPost : item))
      );

      const actionLabels: Record<string, string> = {
        shorter: 'Пост сделан короче',
        longer: 'Пост развернут и дополнен',
        change_style: 'Стиль поста успешно изменен',
        translate: 'Пост переведен и адаптирован',
        clarify: 'Пост обновлен с учетом ваших уточнений',
      };

      showToast(actionLabels[action] || 'Пост обновлен!');
    } catch (err: any) {
      console.error(err);
      alert('Ошибка при обновлении: ' + (err.message || 'Попробуйте ещё раз'));
    } finally {
      setIsModifying(false);
    }
  };

  const handleUpdateCurrentPost = (updatedData: Partial<GeneratedPostData>) => {
    if (!currentPost) return;
    const updated = { ...currentPost, ...updatedData };
    setCurrentPost(updated);
    setHistory((prev) =>
      prev.map((item) => (item.id === currentPost.id ? updated : item))
    );
    showToast('Изменения сохранены');
  };

  const handleSaveToHistory = () => {
    if (!currentPost) return;
    const exists = history.some((h) => h.id === currentPost.id);
    if (!exists) {
      setHistory((prev) => [currentPost, ...prev]);
    }
    showToast('Публикация сохранена в истории!');
  };

  return (
    <div className="min-h-screen bg-[#08090E] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-950/90 border border-indigo-500/40 text-white text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Header */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {activeTab === 'generator' && (
          <>
            {/* Hero Banner */}
            <Hero
              onStartCreating={() => {
                document.getElementById('creator-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Post Creator Form */}
            <PostCreator
              onGenerate={handleGenerate}
              isLoading={isGenerating}
              userCredits={user.generationsLeft}
              userPlan={user.plan}
              onOpenPricing={() => setIsPricingOpen(true)}
            />

            {/* Result Display Section */}
            {currentPost && (
              <div id="result-section" className="scroll-mt-20 pt-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Готовая публикация</h3>
                    <p className="text-xs text-slate-400">
                      Вы можете сразу скопировать текст, быстро изменить стиль или отредактировать детали
                    </p>
                  </div>
                </div>

                <PostResult
                  post={currentPost}
                  onRegenerate={() => {
                    handleGenerate({
                      description: currentPost.descriptionPrompt || '',
                      settings: currentPost.settings,
                      media: [],
                    });
                  }}
                  onModify={handleModify}
                  onUpdatePost={handleUpdateCurrentPost}
                  isModifying={isModifying}
                  onSaveToHistory={handleSaveToHistory}
                  isSaved={history.some((h) => h.id === currentPost.id)}
                />
              </div>
            )}
          </>
        )}

        {/* Publications History Tab */}
        {activeTab === 'history' && (
          <PostHistory
            history={history}
            onSelectPost={(post) => {
              setCurrentPost(post);
              setActiveTab('generator');
              setTimeout(() => {
                document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onDeletePost={(id) => {
              setHistory((prev) => prev.filter((item) => item.id !== id));
              showToast('Пост удален из истории');
            }}
            onClearHistory={() => {
              setHistory([]);
              showToast('История очищена');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-purple-900/20 bg-[#06070a]/90 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-200">
              PostMaker AI
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-xs">
              Интеллектуальный генератор виральных постов
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button
              onClick={() => setActiveTab('generator')}
              className="hover:text-white transition-colors"
            >
              Создать пост
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="hover:text-white transition-colors"
            >
              История публикаций
            </button>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="hover:text-white transition-colors"
            >
              Тарифы
            </button>
          </div>

          <div className="text-slate-500 text-xs">
            © 2026 PostMaker AI. Все права защищены.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        user={user}
        onUpgradePlan={handleUpgradePlan}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(loggedInUser) => {
          setUser((prev) => ({
            ...prev,
            ...loggedInUser,
          }));
          showToast(`Добро пожаловать, ${loggedInUser.name || 'Создатель'}!`);
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onLogout={() => {
          setUser(INITIAL_USER);
          showToast('Вы вышли из аккаунта');
        }}
        onOpenPricing={() => setIsPricingOpen(true)}
      />
    </div>
  );
}
