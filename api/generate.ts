import { GoogleGenAI, Type } from '@google/genai';

interface MediaItem {
  mimeType: string;
  data: string;
  name?: string;
}

interface GenerateRequestBody {
  description?: string;
  platform?: 'instagram' | 'tiktok' | 'facebook' | 'telegram' | 'youtube';
  style?: 'professional' | 'friendly' | 'selling' | 'engaging' | 'humorous' | 'expert';
  length?: 'short' | 'medium' | 'long';
  language?: string;
  includeEmojis?: boolean;
  includeHashtags?: boolean;
  goal?: 'ads' | 'sales' | 'informative' | 'entertainment' | 'personal_blog';
  media?: MediaItem[];
  mediaType?: 'photo' | 'video' | 'mixed' | 'none';
  action?: 'generate' | 'regenerate' | 'shorter' | 'longer' | 'change_style' | 'translate' | 'clarify';
  currentPost?: string;
  clarificationAnswer?: string;
  targetLanguage?: string;
  newStyle?: string;
}

const PLATFORM_GUIDES: Record<string, string> = {
  instagram: 'Формат Instagram: яркий цепляющий хук в первой строке (до кнопки "ещё"), структурированный читаемый текст с абзацами, уместные визуальные акценты, органичный призыв к действию (сохранить, комментировать, перейти по ссылке в шапке), 8-15 релевантных хештегов.',
  tiktok: 'Формат TikTok: ультра-короткий и динамичный текст (caption), провокационный или интригующий хук, трендовая подача, сильный фокус на действие (досмотри до конца, подпишись, делись), 4-6 вирусных хештегов (#fyp, тематические).',
  telegram: 'Формат Telegram: структурированный лонгрид или инсайт, жирные заголовки, списки через эмодзи или буллеты, доверительный экспертный тон автора канала, призыв к реакции или комментарию, 3-5 аккуратных тегов внизу.',
  facebook: 'Формат Facebook: сторителлинг, фокус на обсуждении и диалоге с аудиторией, вовлекающий вопрос в конце для активации комментариев, понятные абзацы, 3-5 хештегов.',
  youtube: 'Формат YouTube (описание к видео/Shorts): завлекающий анонс, ключевые темы/таймкоды если уместно, призыв подписаться и поставить лайк, ссылки, 5-8 SEO-хештегов.'
};

const STYLE_GUIDES: Record<string, string> = {
  professional: 'Деловой, структурированный, уверенный, корректный стиль без лишней воды.',
  friendly: 'Дружелюбный, душевный, теплый, непринужденный стиль общения на "ты" или уважительно на "вы", как с хорошим знакомым.',
  selling: 'Продающий копирайтинг (формулы AIDA/PAS), акцент на выгодах для клиента, снятие возражений, четкий и неотразимый призыв к действию.',
  engaging: 'Увлекательный, интригующий сторителлинг, эмоциональные крючки, вовлечение в диалог.',
  humorous: 'Легкий, с самоиронией и остроумным юмором, позитивный и вызывающий улыбку.',
  expert: 'Глубокий экспертный анализ, демонстрация компетенции, практическая польза, надежные советы.'
};

const LENGTH_GUIDES: Record<string, string> = {
  short: 'Короткий лаконичный текст: 1-2 коротких абзаца (примерно 200-350 символов), максимальная концентрация сути.',
  medium: 'Средний оптимальный текст: 3-4 емких абзаца (примерно 450-800 символов), сбалансированное раскрытие темы.',
  long: 'Подробный лонгрид: 5+ содержательных абзацев (примерно 900-1500 символов), глубокое погружение, списки и детали.'
};

const GOAL_GUIDES: Record<string, string> = {
  ads: 'Цель - Реклама: привлечь внимание целевой аудитории к продукту или услуге, показать уникальность.',
  sales: 'Цель - Продажи: стимулировать совершение покупки, заказа или заявки прямо сейчас.',
  informative: 'Цель - Информирование: донести новость, факт, обновление или полезную инструкцию без давления.',
  entertainment: 'Цель - Развлечение: подарить эмоции, развеселить, удивить, побудить поделиться с друзьями.',
  personal_blog: 'Цель - Личный блог: искренность, мысли автора, живой опыт, сближение с подписчиками.'
};

export async function processPostGeneration(body: GenerateRequestBody) {
  const apiKey = process.env.GEMINI_API_KEY || '';

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please check your environment configuration.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const {
    description = '',
    platform = 'instagram',
    style = 'engaging',
    length = 'medium',
    language = 'ru',
    includeEmojis = true,
    includeHashtags = true,
    goal = 'personal_blog',
    media = [],
    mediaType = 'none',
    action = 'generate',
    currentPost = '',
    clarificationAnswer = '',
    targetLanguage,
    newStyle
  } = body;

  const platformHint = PLATFORM_GUIDES[platform] || PLATFORM_GUIDES.instagram;
  const styleHint = STYLE_GUIDES[(newStyle as string) || style] || STYLE_GUIDES.engaging;
  const lengthHint = LENGTH_GUIDES[length] || LENGTH_GUIDES.medium;
  const goalHint = GOAL_GUIDES[goal] || GOAL_GUIDES.personal_blog;

  const langInstructions: Record<string, string> = {
    ru: 'Язык текста: Русский. Безупречная грамматика, орфография и пунктуация, естественная живая речь.',
    uz: 'Язык текста: O‘zbek tili (Lotin yozuvida). Grammatik jihatdan to‘g‘ri, zamonaviy va tabiiy o‘zbek tili.',
    en: 'Language of post: English. Fluent, natural, engaging native tone.',
    kk: 'Язык текста: Қазақ тілі. Сауатты, тартымды және табиғи сөйлеу тілі.',
  };
  const languageHint = langInstructions[targetLanguage || language] || `Пиши на языке: ${targetLanguage || language}.`;

  let userPromptText = `
Ты — лучший в мире AI-копирайтер и эксперт по контенту для социальных сетей (PostMaker AI).
Твоя задача — создать идеальный, готовый к публикации пост на основе предоставленных материалов (фотографий, видеокадров и/или описания).

ПАРАМЕТРЫ ПУБЛИКАЦИИ:
- Платформа: ${platform.toUpperCase()} (${platformHint})
- Стиль: ${styleHint}
- Длина: ${lengthHint}
- Язык: ${languageHint}
- Наличие эмодзи: ${includeEmojis ? 'Использовать уместные, красивые эмодзи для расстановки акцентов и настроения.' : 'НЕ использовать эмодзи вообще (строгий чистый текст).'}
- Наличие хештегов: ${includeHashtags ? 'Подобрать актуальные, работающие хештеги (на основном языке поста).' : 'НЕ добавлять хештеги.'}
- Цель публикации: ${goalHint}
`;

  if (action === 'shorter') {
    userPromptText += `
ДЕЙСТВИЕ: Сделай предыдущий пост значительно КОРОЧЕ и динамичнее, сохранив главный посыл, ключевую ценность и сильный призыв к действию.
Предыдущий пост для сокращения:
"""${currentPost}"""
`;
  } else if (action === 'longer') {
    userPromptText += `
ДЕЙСТВИЕ: Сделай предыдущий пост более РАЗВЁРНУТЫМ и глубоким, дополни интересными деталями, эмоциональными подробностями или логическими шагами.
Предыдущий пост для расширения:
"""${currentPost}"""
`;
  } else if (action === 'change_style') {
    userPromptText += `
ДЕЙСТВИЕ: Перепиши предыдущий пост в новом стиле: "${newStyle || style}".
Предыдущий пост:
"""${currentPost}"""
`;
  } else if (action === 'translate') {
    userPromptText += `
ДЕЙСТВИЕ: Переведи и адаптируй предыдущий пост на выбранный язык (${languageHint}), сделав его абсолютно естественным для носителей языка.
Предыдущий пост:
"""${currentPost}"""
`;
  } else if (action === 'clarify' && clarificationAnswer) {
    userPromptText += `
ПОЛЬЗОВАТЕЛЬ ОТВЕТИЛ НА УТОЧНЯЮЩИЙ ВОПРОС:
"${clarificationAnswer}"
Обнови и обогати пост с учетом этого ответа пользователя!
Предыдущий черновик:
"""${currentPost}"""
`;
  }

  if (description && description.trim()) {
    userPromptText += `
ОПИСАНИЕ ИЛИ ИДЕЯ ПОЛЬЗОВАТЕЛЯ:
"""${description.trim()}"""
(Внимание: исправь любые орфографические или пунктуационные ошибки из текста пользователя, сформулируй мысль красиво и органично).
`;
  }

  if (media && media.length > 0) {
    if (mediaType === 'video') {
      userPromptText += `
МАТЕРИАЛ: Пользователь загрузил ВИДЕО. Приложены последовательные ключевые кадры из этого видео.
Тщательно проанализируй, что происходит в видео: действие, обстановку, предметы, людей, эмоции, динамику. Напиши пост, который органично сопровождает и усиливает именно это видео!
`;
    } else {
      userPromptText += `
МАТЕРИАЛ: Пользователь загрузил ФОТО (всего ${media.length} шт.).
Внимательно рассмотри визуальный контент на изображениях (композиция, цвета, люди, объекты, настроение, локация). Пост должен идеально соответствовать тому, что изображено на фото!
`;
    }
  }

  userPromptText += `
ВАЖНЕЙШИЕ ПРАВИЛА:
1. НЕ ПРИДУМЫВАЙ ФАКТОВ, которых нет в описании или на фото/видео (не выдумывай несуществующие цены, адреса, скидки, вымышленные характеристики товаров или события).
2. Текст должен звучать максимально живо и по-человечески, без "роботизированных" клише (избегай штампов вроде "В современном быстро меняющемся мире...", "Не секрет, что...", "Погрузитесь в атмосферу...").
3. Если информации критически не хватает для полноценного поста (например, пост о продаже товара, но нет цены/бренда), заполни поле "clarificationQuestion" вежливым вопросом на языке поста, чтобы помочь пользователю дополнить информацию. Если данных достаточно, оставь clarificationQuestion пустой строкой.
4. Создай также 2 качественных альтернативных варианта поста (Option B и Option C) с другим углом подачи (например, один более короткий/эмоциональный, другой более вовлекающий или вопрошающий).
5. Собери "fullText" так, чтобы его можно было сразу скопировать в один клик и опубликовать!
`;

  const parts: any[] = [];

  if (media && Array.isArray(media)) {
    for (const item of media.slice(0, 6)) {
      if (item.data && item.mimeType) {
        parts.push({
          inlineData: {
            mimeType: item.mimeType,
            data: item.data
          }
        });
      }
    }
  }

  parts.push({ text: userPromptText });

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: { parts },
    config: {
      systemInstruction: 'Ты — профессиональный эксперт по Social Media Marketing и виральному копирайтингу. Создавай цепляющие, грамотные, живые тексты для соцсетей строго в формате JSON по заданной схеме.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: {
            type: Type.STRING,
            description: 'Привлекательный заголовок или первая строка (хук)'
          },
          body: {
            type: Type.STRING,
            description: 'Основной текст поста с аккуратным делением на абзацы'
          },
          callToAction: {
            type: Type.STRING,
            description: 'Призыв к действию (CTA)'
          },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Список рекомендованных хештегов (без знака # или со знаком #)'
          },
          fullText: {
            type: Type.STRING,
            description: 'Полный готовый к публикации пост, объединяющий заголовок, текст, CTA и хештеги'
          },
          mediaAnalysis: {
            type: Type.STRING,
            description: 'Краткое резюме того, что AI увидел на фото/видео (1-2 предложения)'
          },
          clarificationQuestion: {
            type: Type.STRING,
            description: 'Уточняющий вопрос пользователю, если не хватает важных фактов. Пустая строка, если всё понятно.'
          },
          alternatives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: 'Название варианта' },
                fullText: { type: Type.STRING, description: 'Полный текст альтернативного поста' },
                toneHint: { type: Type.STRING, description: 'Краткое описание особенности этого варианта' }
              },
              required: ['label', 'fullText', 'toneHint']
            },
            description: '2 альтернативных варианта поста'
          }
        },
        required: ['headline', 'body', 'callToAction', 'hashtags', 'fullText', 'mediaAnalysis', 'alternatives']
      }
    }
  });

  const rawText = response.text || '{}';
  return JSON.parse(rawText);
}

// Handler for Vercel Serverless Function and Express
export default async function handler(req: any, res: any) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await processPostGeneration(body || {});
    return res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    console.error('Error generating post:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Ошибка генерации текста через AI'
    });
  }
}
