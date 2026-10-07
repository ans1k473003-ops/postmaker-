import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Eye,
  Smile,
  ThumbsUp,
  Volume2,
  Music
} from 'lucide-react';
import { PlatformType } from '../types';

interface SocialMockupProps {
  platform: PlatformType;
  headline: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  fullText: string;
  mediaPreview?: { type: 'image' | 'video'; url: string };
  userName?: string;
}

export const SocialMockup: React.FC<SocialMockupProps> = ({
  platform,
  headline,
  body,
  callToAction,
  hashtags,
  fullText,
  mediaPreview,
  userName = 'postmaker_creator',
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Render Instagram Card
  if (platform === 'instagram') {
    return (
      <div className="bg-black text-white rounded-2xl border border-neutral-800 max-w-md mx-auto overflow-hidden shadow-2xl font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between p-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold">
                {userName[0].toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight">{userName}</div>
              <div className="text-[10px] text-neutral-400">Оригинальный пост</div>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-neutral-400 cursor-pointer" />
        </div>

        {/* Media Frame */}
        {mediaPreview ? (
          <div className="relative aspect-square bg-neutral-900 overflow-hidden">
            {mediaPreview.type === 'image' ? (
              <img
                src={mediaPreview.url}
                alt="Instagram post"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={mediaPreview.url}
                className="w-full h-full object-cover"
                controls
                playsInline
              />
            )}
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gradient-to-br from-purple-950/40 via-indigo-950/40 to-neutral-900 p-6 flex flex-col items-center justify-center text-center border-b border-neutral-800">
            <span className="text-2xl mb-2">📸</span>
            <div className="text-sm font-semibold text-neutral-300">
              {headline || 'Визуальный контент публикации'}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="p-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`transition-transform active:scale-125 ${
                liked ? 'text-rose-500 fill-rose-500' : 'text-white'
              }`}
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-rose-500' : ''}`} />
            </button>
            <MessageCircle className="w-6 h-6 text-white cursor-pointer hover:opacity-80" />
            <Send className="w-6 h-6 text-white cursor-pointer hover:opacity-80" />
          </div>
          <button onClick={() => setSaved(!saved)} className="text-white">
            <Bookmark className={`w-6 h-6 ${saved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="px-3 text-xs font-semibold">
          {liked ? '1,421 отметок "Нравится"' : '1,420 отметок "Нравится"'}
        </div>

        {/* Caption */}
        <div className="p-3 pt-1 text-xs text-neutral-200 space-y-1.5 whitespace-pre-line leading-relaxed">
          <span className="font-semibold text-white mr-1.5">{userName}</span>
          <span className="font-semibold text-white block mt-0.5">{headline}</span>
          <div className="text-neutral-300">{body}</div>
          {callToAction && (
            <div className="font-medium text-pink-400 mt-2">{callToAction}</div>
          )}
          {hashtags && hashtags.length > 0 && (
            <div className="text-blue-400 font-normal pt-1">
              {hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
            </div>
          )}
        </div>

        <div className="px-3 pb-3 text-[10px] text-neutral-500 uppercase tracking-wider">
          Только что
        </div>
      </div>
    );
  }

  // Render Telegram Message
  if (platform === 'telegram') {
    return (
      <div className="bg-[#17212b] text-white rounded-2xl border border-sky-900/40 max-w-md mx-auto p-4 shadow-2xl font-sans">
        {/* Telegram Channel Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/5 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center font-bold text-sm shadow-md">
            TG
          </div>
          <div>
            <div className="text-sm font-bold text-sky-300">Канал PostMaker</div>
            <div className="text-[11px] text-slate-400">12 400 подписчиков</div>
          </div>
        </div>

        {/* Message Bubble */}
        <div className="bg-[#242f3d] rounded-2xl rounded-tl-sm p-4 space-y-3 border border-white/5">
          {mediaPreview && (
            <div className="rounded-xl overflow-hidden aspect-video bg-black/40">
              {mediaPreview.type === 'image' ? (
                <img
                  src={mediaPreview.url}
                  alt="TG media"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={mediaPreview.url}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                />
              )}
            </div>
          )}

          {headline && (
            <div className="font-bold text-sm sm:text-base text-white leading-snug">
              {headline}
            </div>
          )}

          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {body}
          </div>

          {callToAction && (
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold">
              👉 {callToAction}
            </div>
          )}

          {hashtags && hashtags.length > 0 && (
            <div className="text-xs text-sky-400 font-medium">
              {hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
            </div>
          )}

          {/* Time & Views */}
          <div className="flex items-center justify-end gap-1.5 pt-1 text-[11px] text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            <span>2.8k</span>
            <span className="ml-2">14:32</span>
          </div>
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-2 mt-2 px-1">
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs border border-white/10 flex items-center gap-1 cursor-pointer hover:bg-white/10">
            🔥 42
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs border border-white/10 flex items-center gap-1 cursor-pointer hover:bg-white/10">
            ❤️ 28
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs border border-white/10 flex items-center gap-1 cursor-pointer hover:bg-white/10">
            👏 15
          </span>
        </div>
      </div>
    );
  }

  // Render TikTok Style
  if (platform === 'tiktok') {
    return (
      <div className="relative bg-black text-white rounded-3xl border border-neutral-800 max-w-xs mx-auto aspect-[9/16] overflow-hidden shadow-2xl flex flex-col justify-between p-4">
        {/* Background media */}
        {mediaPreview ? (
          mediaPreview.type === 'image' ? (
            <img
              src={mediaPreview.url}
              alt="TikTok"
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />
          ) : (
            <video
              src={mediaPreview.url}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              controls
              playsInline
            />
          )
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-purple-950/40 to-black" />
        )}

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-center gap-4 text-xs font-bold pt-2">
          <span className="text-neutral-400">Подписки</span>
          <span className="text-white border-b-2 border-white pb-0.5">Рекомендации</span>
        </div>

        {/* Right Action Rail */}
        <div className="relative z-10 self-end flex flex-col items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-400 p-[1.5px] relative">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold">
              {userName[0].toUpperCase()}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
              +
            </div>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full bg-black/40 backdrop-blur-md ${
                liked ? 'text-rose-500 fill-rose-500' : 'text-white'
              }`}
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-rose-500' : ''}`} />
            </button>
            <span className="text-[10px] font-semibold">{liked ? '48.2k' : '48.1k'}</span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <div className="p-2 rounded-full bg-black/40 backdrop-blur-md">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-semibold">1,240</span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <div className="p-2 rounded-full bg-black/40 backdrop-blur-md">
              <Bookmark className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-semibold">3,980</span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <div className="p-2 rounded-full bg-black/40 backdrop-blur-md">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-semibold">512</span>
          </div>
        </div>

        {/* Bottom Caption */}
        <div className="relative z-10 bg-gradient-to-t from-black via-black/80 to-transparent -mx-4 -mb-4 p-4 pt-6 space-y-1.5 text-xs">
          <div className="font-bold text-white flex items-center gap-1.5">
            @{userName}
            <span className="text-[10px] px-1 py-0.2 bg-cyan-400 text-black font-extrabold rounded">
              PRO
            </span>
          </div>

          <div className="font-semibold text-sm line-clamp-1">{headline}</div>
          <div className="text-neutral-200 text-xs line-clamp-2">{body}</div>

          {hashtags && hashtags.length > 0 && (
            <div className="text-cyan-300 font-medium text-[11px] line-clamp-1">
              {hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-300">
            <Music className="w-3.5 h-3.5 animate-spin" />
            <span className="truncate">Оригинальный звук - {userName}</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: YouTube / Facebook / Universal Card
  return (
    <div className="bg-[#18191a] text-white rounded-2xl border border-neutral-800 max-w-md mx-auto p-4 shadow-2xl font-sans">
      <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800">
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">
          {userName[0].toUpperCase()}
        </div>
        <div>
          <div className="text-xs font-semibold">{userName}</div>
          <div className="text-[10px] text-neutral-400">Публикация в {platform}</div>
        </div>
      </div>

      <div className="py-3 space-y-2 text-xs text-neutral-200 leading-relaxed whitespace-pre-line">
        <div className="font-bold text-sm text-white">{headline}</div>
        <div>{body}</div>
        {callToAction && <div className="font-semibold text-indigo-400">{callToAction}</div>}
        {hashtags && (
          <div className="text-blue-400">{hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}</div>
        )}
      </div>

      {mediaPreview && (
        <div className="rounded-xl overflow-hidden aspect-video bg-black/50 my-2">
          {mediaPreview.type === 'image' ? (
            <img src={mediaPreview.url} alt="media" className="w-full h-full object-cover" />
          ) : (
            <video src={mediaPreview.url} controls className="w-full h-full object-cover" />
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs text-neutral-400">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 ${liked ? 'text-blue-400 font-semibold' : ''}`}
        >
          <ThumbsUp className="w-4 h-4" /> Нравится
        </button>
        <button className="flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4" /> Комментировать
        </button>
        <button className="flex items-center gap-1.5">
          <Share2 className="w-4 h-4" /> Поделиться
        </button>
      </div>
    </div>
  );
};
