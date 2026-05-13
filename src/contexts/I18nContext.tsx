import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  home: { en: 'Home', ar: 'الرئيسية' },
  scenarios: { en: 'Scenarios', ar: 'السيناريوهات' },
  topRated: { en: 'Top Rated', ar: 'الأعلى تقييماً' },
  trending: { en: 'Trending', ar: 'الشائع' },
  characters: { en: 'Characters', ar: 'الشخصيات' },
  episodes: { en: 'Episodes', ar: 'الحلقات' },
  search: { en: 'Search MTDb', ar: 'ابحث في MTDb' },
  menu: { en: 'Menu', ar: 'القائمة' },
  watchlist: { en: 'Watchlist', ar: 'قائمة المشاهدة' },
  watchlistEmpty: { en: 'Your watchlist is empty', ar: 'قائمة المشاهدة فارغة' },
  watchlistAdd: { en: 'Add to Watchlist', ar: 'إضافة للقائمة' },
  watchlistRemove: { en: 'In Watchlist', ar: 'في القائمة' },
  edits: { en: 'Edits', ar: 'التصاميم' },
  all: { en: 'All', ar: 'الكل' },
  images: { en: 'Images', ar: 'صور' },
  videos: { en: 'Videos', ar: 'مقاطع فيديو' },
  similarScenarios: { en: 'Similar Scenarios', ar: 'سيناريوهات مشابهة' },
  noSimilarScenarios: { en: 'No similar scenarios found', ar: 'لا توجد سيناريوهات مشابهة' },
  download: { en: 'Download', ar: 'تحميل' },
  downloadVideo: { en: 'Download Video', ar: 'تحميل الفيديو' },
  downloadImage: { en: 'Download Image', ar: 'تحميل الصورة' },
  downloadProject: { en: 'Download Project', ar: 'تحميل ملف المشروع' },
  startWatching: { en: 'Start Watching', ar: 'ابدأ المشاهدة' },
  noEpisodes: { en: 'No episodes available yet', ar: 'لا توجد حلقات متاحة بعد' },
  castClassified: { en: 'Cast Information Classified', ar: 'معلومات الممثلين سرية' },
  moreInfo: { en: 'More Info', ar: 'مزيد من المعلومات' },
  featured: { en: 'Featured', ar: 'مميز' },
  exploreScenario: { en: 'Explore', ar: 'استكشف' },
  noScenarios: { en: 'No scenarios found', ar: 'لا توجد سيناريوهات' },
  cast: { en: 'Characters', ar: 'الشخصيات' },
  confirmedCast: { en: 'Confirmed Characters', ar: 'الشخصيات المؤكدة' },
  unknown: { en: 'Unknown', ar: 'مجهول' },
  totalVotes: { en: 'total votes', ar: 'إجمالي الأصوات' },
  topCharacters: { en: 'Top Characters', ar: 'أبرز الشخصيات' },
  likes: { en: 'Likes', ar: 'إعجابات' },
  like: { en: 'Like', ar: 'أعجبني' },
  ratingDistribution: { en: 'Rating Distribution', ar: 'توزيع التقييمات' },
  rating: { en: 'Rating', ar: 'التقييم' },
  userReviews: { en: 'User Reviews', ar: 'مراجعات المستخدمين' },
  synopsis: { en: 'Synopsis', ar: 'ملخص القصة' },
  releaseDate: { en: 'Release Date', ar: 'تاريخ الإصدار' },
  director: { en: 'Director', ar: 'المخرج' },
  writer: { en: 'Writer', ar: 'الكاتب' },
  genre: { en: 'Genre', ar: 'النوع' },
  popular: { en: 'Popular', ar: 'مشهور' },
  newReleases: { en: 'New Releases', ar: 'إصدارات جديدة' },
  topPicks: { en: 'Top Picks', ar: 'اختياراتنا لك' },
  viewAll: { en: 'View All', ar: 'عرض الكل' },
  roleplayDatabase: { en: 'Roleplay Scenario Database', ar: 'قاعدة بيانات سيناريوهات تمثيل الأدوار' },
  duration: { en: 'Duration', ar: 'المدة' },
  featuredPreview: { en: 'Featured Preview', ar: 'معاينة مميزة' },
  newContentDrops: { en: 'New Content Drops', ar: 'محتوى جديد مضاف' },
  hallOfFame: { en: 'Hall of Fame', ar: 'قاعة المشاهير' },
  legendaryScenarios: { en: 'The Most Legendary Scenarios', ar: 'السيناريوهات الأكثر أسطورية' },
  tip: { en: 'Tip', ar: 'نصيحة' },
  scenarioNotFound: { en: 'Scenario not found', ar: 'السيناريو غير موجود' },
  returnHome: { en: 'Return Home', ar: 'العودة للرئيسية' },
  watchPromo: { en: 'Watch Trailer', ar: 'شاهد التريلر' },
  searchTip: { en: 'Search by title, tag, or description...', ar: 'ابحث بالعنوان، العلامة، أو الوصف...' },
  quickLinks: { en: 'Quick Links', ar: 'روابط سريعة' },
  emptyFavorites: { en: 'Your favorites list is empty', ar: 'قائمة المفضلة لديك فارغة' },
  searchPlaceholder: { en: 'Search MTDb', ar: 'ابحث في MTDb' },
  backToTop: { en: 'Back to top', ar: 'العودة للأعلى' },
  crime: { en: 'Crime', ar: 'جريمة' },
  mystery: { en: 'Mystery', ar: 'غموض' },
  action: { en: 'Action', ar: 'أكشن' },
  drama: { en: 'Drama', ar: 'دراما' },
  scifi: { en: 'Sci-Fi', ar: 'خيال علمي' },
  comedy: { en: 'Comedy', ar: 'كوميديا' },
  racing: { en: 'Racing', ar: 'سباق' },
  horror: { en: 'Horror', ar: 'رعب' },
  survival: { en: 'Survival', ar: 'بقاء' },
  heist: { en: 'Heist', ar: 'سرقة' },
  thriller: { en: 'Thriller', ar: 'إثارة' },
  fantasy: { en: 'Fantasy', ar: 'فانتازيا' },
  political: { en: 'Political', ar: 'سياسي' },
  war: { en: 'War', ar: 'حرب' },
  unlimitedStories: { en: 'Unlimited Stories', ar: 'قصص بلا حدود' },
  discoverUniverse: { en: 'Discover a universe of endless possibilities. Immerse yourself in the most legendary roleplay scenarios.', ar: 'اكتشف عالماً من الاحتمالات اللانهائية. انغمس في أروع سيناريوهات تقمص الأدوار.' },
  upNext: { en: 'Up next', ar: 'التالي' },
  fanFavorites: { en: 'Fan Favorites', ar: 'مفضلة المتابعين' },
  fanFavoritesDesc: { en: "This week's top scenarios", ar: 'أفضل سيناريوهات هذا الأسبوع' },
  seeMore: { en: 'See more', ar: 'عرض المزيد' },
  mostPopularScenarios: { en: 'Most Popular Scenarios', ar: 'السيناريوهات الأكثر شهرة' },
  comingSoon: { en: 'Coming Soon', ar: 'قريباً' },
  trailersUpcoming: { en: 'Trailers for upcoming scenarios', ar: 'عروض تشويقية للسيناريوهات القادمة' },
  popularCelebrities: { en: 'Most Popular Celebrities', ar: 'أشهر النجوم' },
  recentlyViewed: { en: 'Recently Viewed', ar: 'شوهد مؤخراً' },
  clearAll: { en: 'Clear all', ar: 'مسح الكل' },
  highestRated: { en: 'Highest Rated', ar: 'الأعلى تقييماً' },
  viewDetails: { en: 'View Details', ar: 'عرض التفاصيل' },
  allScenarios: { en: 'Scenarios', ar: 'السيناريوهات' },
  scenario: { en: 'Scenario', ar: 'السيناريو' },
  startExploring: { en: 'Start exploring to add scenarios here', ar: 'ابدأ الاستكشاف لإضافة السيناريوهات هنا' },
  noCharacters: { en: 'No Characters', ar: 'لا يوجد شخصيات' },
  unknownActor: { en: 'Unknown Actor', ar: 'ممثل مجهول' },
  watchPromoSub: { en: 'Watch the cinematic trailer for {title}', ar: 'شاهد التريلر السينمائي لـ {title}' },
  copyright: { en: '© {year} by MTDb.com, Inc.', ar: '© {year} بواسطة MTDb.com, Inc.' },
  noResults: { en: 'No results found', ar: 'لم يتم العثور على نتائج' },
  liveSyncSuccess: { en: 'Ratings synchronized with live servers!', ar: 'تمت مزامنة التقييمات مع الخوادم المباشرة!' },
  liveSyncError: { en: 'Error syncing live ratings', ar: 'خطأ في مزامنة التقييمات' },
  loadDataError: { en: 'Failed to load scenario data.', ar: 'فشل تحميل بيانات السيناريو.' },
  addedToWatchlist: { en: 'Added to watchlist', ar: 'تمت الإضافة إلى قائمتك' },
  removedFromWatchlist: { en: 'Removed from watchlist', ar: 'تمت الإزالة من قائمتك' },
  featuredToday: { en: 'Featured today', ar: 'مميز اليوم' },
  starWarsDay: { en: 'Star Wars Day', ar: 'يوم حرب النجوم' },
  aapiHeritageMonth: { en: 'AAPI Heritage Month', ar: 'شهر تراث AAPI' },
  cannesFestival: { en: 'Cannes Film Festival', ar: 'مهرجان كان السينمائي' },
  baftaTVAwards: { en: 'BAFTA TV Awards', ar: 'جوائز BAFTA للتلفزيون' },
  topRising: { en: 'TOP RISING', ar: 'الأبرز صعوداً' },
  byRanking: { en: 'BY RANKING', ar: 'حسب الترتيب' },
  whatToWatch: { en: 'What to watch', ar: 'ماذا تشاهد' },
  moreRecommendations: { en: 'Get more recommendations', ar: 'الحصول على المزيد من التوصيات' },
  fromWatchlist: { en: 'From your Watchlist', ar: 'من قائمة مشاهدتك' },
  top10ThisWeek: { en: 'Top 10 on MTDb this week', ar: 'أفضل 10 على MTDb هذا الأسبوع' },
  moreToExplore: { en: 'More to explore', ar: 'المزيد للاستكشاف' },
  topNews: { en: 'Top news', ar: 'أهم الأخبار' },
  topBoxOffice: { en: 'Top box office (US)', ar: 'شباك التذاكر (أمريكا)' },
  inTheaters: { en: 'In theaters', ar: 'في السينما' },
  useApp: { en: 'Use app', ar: 'استخدم التطبيق' },
  browseTrailers: { en: 'Browse trailers', ar: 'تصفح العروض الترويجية' },
  list: { en: 'List', ar: 'قائمة' },
  ourSummerGuide: { en: 'Our Summer Watch Guide', ar: 'دليل مشاهدة الصيف' },
  browseGuide: { en: 'Browse the guide', ar: 'تصفح الدليل' },
  top25Adaptations: { en: 'The Top 25 Movie Adaptations', ar: 'أفضل 25 اقتباساً سينمائياً' },
  seeRankings: { en: 'See the rankings', ar: 'عرض الترتيب' },
  markAsWatched: { en: 'Mark as watched', ar: 'تمت المشاهدة' },
  seeAll: { en: 'See all', ar: 'عرض الكل' },
  rate: { en: 'Rate', ar: 'تقييم' },
  fiveStarRatings: { en: '{count} 5-star ratings', ar: '{count} تقييم 5 نجوم' },
  trailers: { en: 'Trailers', ar: 'التريلرات' },
  watchTheTrailer: { en: 'Watch the Trailer', ar: 'شاهد التريلر' },
  news: { en: 'NEWS', ar: 'أخبار' },
  variety: { en: 'VARIETY', ar: 'منوعات' },
  season: { en: 'S', ar: 'الموسم' },
  episode: { en: 'E', ar: 'الحلقة' },
  perFive: { en: '/ 5', ar: '/ 5' },
  ratings: { en: 'Ratings', ar: 'التقييمات' },
  characterNotFound: { en: 'Character not found', ar: 'الشخصية غير موجودة' },
  filmography: { en: 'Filmography', ar: 'الأعمال السينمائية' },
  totalLikes: { en: 'Total Likes', ar: 'إجمالي الإعجابات' },
  return: { en: 'Return', ar: 'عودة' },
  rateThis: { en: 'Rate This', ar: 'تقييمك' },
  systemError: { en: 'System Error', ar: 'خطأ في النظام' },
  unexpectedAnomaly: { en: 'Our systems encountered an unexpected anomoly. The development team has been notified.', ar: 'واجهت أنظمتنا خللاً غير متوقع. تم إخطار فريق التطوير.' },
  rebootSystem: { en: 'Reboot System', ar: 'إعادة تشغيل النظام' },
  unknownError: { en: 'Unknown Error', ar: 'خطأ غير معروف' },
  storyDetailsRevealed: { en: 'New story details revealed', ar: 'تم الكشف عن تفاصيل جديدة للقصة' },
  latestIndustryInsights: { en: 'Latest industry insights: Roleplay scenarios reach record popularity.', ar: 'آخر رؤى الصناعة: سيناريوهات تمثيل الأدوار تحقق شعبية قياسية.' },
  completeVerification: { en: 'Please complete the bot verification first.', ar: 'يرجى إكمال التحقق من الروبوت أولاً.' },
  ratingSuccess: { en: 'Rating submitted successfully!', ar: 'تم إرسال التقييم بنجاح!' },
  ratingFailed: { en: 'Failed to submit rating', ar: 'فشل إرسال التقييم' },
  connectionFailed: { en: 'Connection failed', ar: 'فشل الاتصال' },
  freeForPersonalUse: { en: 'Free to use for personal projects', ar: 'مجاني للاستخدام في المشاريع الشخصية' },
  offline: { en: 'Offline', ar: 'غير متصل' },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key?: string): string => {
    if (!key) return '';
    const normalizedKey = key.replace('-', '').toLowerCase();
    
    // Exact match
    if (translations[key]) return translations[key]?.[language] || key;
    // Case-insensitive match
    const foundKey = Object.keys(translations).find(k => k.toLowerCase() === key.toLowerCase() || k.toLowerCase() === normalizedKey);
    if (foundKey) return translations[foundKey]?.[language] || key;

    return key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
