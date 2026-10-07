import React, { useState } from 'react';
import {
  Clock,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Instagram,
  Send,
  Youtube,
  Hash,
  Download,
  Filter
} from 'lucide-react';
import { GeneratedPostData, PlatformType } from '../types';

interface PostHistoryProps {
  history: GeneratedPostData[];
  onSelectPost: (post: GeneratedPostData) => void;
  onDeletePost: (id: string) => void;
  onClearHistory: () => void;
}

export const PostHistory: React.FC<PostHistoryProps> = ({
  history,
  onSelectPost,
  onDeletePost,
  onClearHistory,
}) => {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter((item) => {
    const matchesSearch =
      (item.headline && item.headline.toLowerCase().includes(search.toLowerCase())) ||
      (item.body && item.body.toLowerCase().includes(search.toLowerCase())) ||
      (item.fullText && item.fullText.toLowerCase().includes(search.toLowerCase()));

    const matchesPlatform =
      platformFilter === 'all' || item.settings.platform === platformFilter;

    return matchesSearch && matchesPlatform;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-400" />;
      case 'telegram':
        return <Send className="w-3.5 h-3.5 text-sky-400" />;
      case 'tiktok':
        return <span className="font-bold text-[10px] text-cyan-400">TT</span>;
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5 text-red-400" />;
      case 'facebook':
        return <span className="font-bold text-[10px] text-blue-400">FB</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Bar with title & controls */}
      <div className="bg-[#0f111c]/90 border border-purple-900/30 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              История публикаций
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                {history.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Все созданные посты сохраняются локально. Вы можете открыть, скопировать или отредактировать их в любой момент.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Вы уверены, что хотите удалить всю историю генераций?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 self-start sm:self-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Очистить историю
            </button>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по тексту или заголовку..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141726] border border-slate-700/80 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'instagram', 'telegram', 'tiktok', 'youtube', 'facebook'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize whitespace-nowrap ${
                  platformFilter === p
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {p === 'all' ? 'Все платформы' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#0f111c]/60 rounded-3xl border border-white/5 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-slate-500">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-slate-300 text-sm font-medium">
            {history.length === 0
              ? 'У вас пока нет сохранённых постов. Сгенерируйте первый пост в мастере создания!'
              : 'Ничего не найдено по вашему поисковому запросу.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0f111c]/90 border border-white/5 hover:border-indigo-500/40 transition-all shadow-lg flex flex-col justify-between group relative"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141726] border border-white/10 text-xs font-semibold text-slate-200">
                      {getPlatformIcon(item.settings.platform)}
                      <span className="capitalize">{item.settings.platform}</span>
                    </span>

                    <span className="text-[11px] text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeletePost(item.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Удалить из истории"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Headline & Body snippet */}
                {item.headline && (
                  <h4 className="text-sm font-bold text-white mb-1.5 line-clamp-1">
                    {item.headline}
                  </h4>
                )}

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-3">
                  {item.body}
                </p>

                {/* Hashtags snippet */}
                {item.hashtags && item.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.hashtags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded"
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                    {item.hashtags.length > 4 && (
                      <span className="text-[10px] text-slate-500">
                        +{item.hashtags.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectPost(item)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Открыть в редакторе
                </button>

                <button
                  onClick={() => handleCopy(item.id, item.fullText)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Скопировать</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
