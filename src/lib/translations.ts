export type LanguageCode = 'tr' | 'en' | 'ar' | 'de' | 'fr';

export const LANGUAGES: { code: LanguageCode; nativeName: string; flag: string }[] = [
  { code: 'tr', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'de', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', nativeName: 'Français', flag: '🇫🇷' },
];

export const RTL_LANGUAGES: LanguageCode[] = ['ar'];

export type TranslationKey =
  | 'appName'
  | 'tab.home'
  | 'tab.plans'
  | 'tab.library'
  | 'nav.myPlans'
  | 'nav.prayerLibrary'
  | 'nav.prayerTimes'
  | 'nav.tasbihCounter'
  | 'home.todayDate'
  | 'home.overallProgress'
  | 'home.currentPriority'
  | 'home.allPrayers'
  | 'home.dayXOfY'
  | 'home.morning'
  | 'home.evening'
  | 'home.prayersCompleted'
  | 'home.noPlanTitle'
  | 'home.noPlanDesc'
  | 'home.dailyQuote'
  | 'home.dailyQuotePlaceholder'
  | 'home.quickActions'
  | 'plans.title'
  | 'plans.newPlan'
  | 'plans.createPlan'
  | 'plans.noPlans'
  | 'plans.noPlansDesc'
  | 'plans.addPrayer'
  | 'plans.removePrayer'
  | 'plans.deletePlan'
  | 'plans.active'
  | 'plans.passive'
  | 'plans.makeActive'
  | 'plans.prayers'
  | 'plans.planNamePlaceholder'
  | 'plans.create'
  | 'plans.days'
  | 'plans.confirmDeletePlan'
  | 'plans.confirmDeletePrayer'
  | 'library.title'
  | 'library.registered'
  | 'library.searchPlaceholder'
  | 'library.all'
  | 'library.noResults'
  | 'library.meaning'
  | 'library.priority'
  | 'library.suggestedCount'
  | 'library.suggestedTime'
  | 'counter.session'
  | 'counter.morningSession'
  | 'counter.eveningSession'
  | 'counter.tap'
  | 'counter.tapToStart'
  | 'counter.remaining'
  | 'counter.completed'
  | 'counter.times'
  | 'counter.markAllRead'
  | 'counter.reset'
  | 'counter.confirmTitle'
  | 'counter.confirmMessage'
  | 'counter.confirmYes'
  | 'counter.confirmCancel'
  | 'common.cancel'
  | 'common.confirm'
  | 'common.delete'
  | 'common.yes'
  | 'common.close'
  | 'common.back'
  | 'settings.title'
  | 'settings.language'
  | 'settings.languageDesc'
  | 'prayerTimes.title'
  | 'prayerTimes.placeholder'
  | 'tasbih.title'
  | 'tasbih.placeholder'
  | 'tasbih.count'
  | 'tasbih.increment'
  | 'tasbih.decrement'
  | 'tasbih.reset'
  | 'tasbih.resetConfirmTitle'
  | 'tasbih.resetConfirmMessage'
  | 'tasbih.resetConfirmBtn'
  | 'tasbih.decrementLabel'
  | 'tasbih.resetLabel'
  | 'tasbih.countLabel'
  | 'prayerTimes.fajr'
  | 'prayerTimes.sunrise'
  | 'prayerTimes.dhuhr'
  | 'prayerTimes.asr'
  | 'prayerTimes.magrib'
  | 'prayerTimes.isha'
  | 'prayerTimes.nextPrayer'
  | 'prayerTimes.noLocation'
  | 'prayerTimes.useMyLocation'
  | 'prayerTimes.selectManually'
  | 'prayerTimes.changeLocation'
  | 'prayerTimes.loading'
  | 'prayerTimes.error'
  | 'prayerTimes.geoDenied'
  | 'prayerTimes.geoUnavailable'
  | 'prayerTimes.geoError'
  | 'prayerTimes.retry'
  | 'prayerTimes.cachedData'
  | 'prayerTimes.location'
  | 'prayerTimes.selectCountry'
  | 'prayerTimes.selectCity'
  | 'prayerTimes.searchCountry'
  | 'prayerTimes.searchCity'
  | 'prayerTimes.calcMethod'
  | 'prayerTimes.calcMethodDesc'
  | 'prayerTimes.method.diyanet'
  | 'prayerTimes.method.mwl'
  | 'prayerTimes.method.isna'
  | 'prayerTimes.method.egypt'
  | 'prayerTimes.method.makkah'
  | 'prayerTimes.method.karachi'
  | 'prayerTimes.method.tehran'
  | 'prayerTimes.method.jafari'
  | 'prayerTimes.method.default'
  | 'prayerTimes.updateLocation'
  | 'prayerTimes.noCitySelected'
  | 'prayerTimes.confirm'
  | 'prayerTimes.currentLocation'
  | 'prayerTimes.changeCurrentLocation'
  | 'prayerTimes.tomorrow'
  | 'prayerTimes.methodAuto'
  | 'prayerTimes.currently'
  | 'prayerTimes.selectCurrentLocationDesc'
  | 'prayerTimes.timeUnavailable';

type TranslationDict = Record<TranslationKey, string>;

const tr: TranslationDict = {
  'appName': 'Dua ve Zikir Takip',
  'tab.home': 'Ana Sayfa',
  'tab.plans': 'Planlarım',
  'tab.library': 'Dua Kütüphanesi',
  'nav.myPlans': 'Planlarım',
  'nav.prayerLibrary': 'Dua Kütüphanesi',
  'nav.prayerTimes': 'Namaz Vakitleri',
  'nav.tasbihCounter': 'Tesbihat',
  'home.todayDate': 'Bugün',
  'home.overallProgress': 'Genel İlerleme',
  'home.currentPriority': 'Şu Anki Önceliğiniz',
  'home.allPrayers': 'Tüm Dualar (Sıralı)',
  'home.dayXOfY': 'Günün',
  'home.morning': 'Sabah',
  'home.evening': 'Akşam',
  'home.prayersCompleted': 'dua tamamlandı',
  'home.noPlanTitle': 'Henüz planınız yok',
  'home.noPlanDesc': 'Okuma planınızı oluşturmak için "Planlarım" sekmesine gidin.',
  'home.dailyQuote': 'Günün Sözü',
  'home.dailyQuotePlaceholder': 'Günün sözü yakında burada görünecek.',
  'home.quickActions': 'Hızlı Erişim',
  'plans.title': 'Planlarım',
  'plans.newPlan': 'Yeni Plan Oluştur',
  'plans.createPlan': 'Yeni Plan',
  'plans.noPlans': 'Henüz planınız yok. Yeni bir plan oluşturun.',
  'plans.noPlansDesc': 'Henüz planınız yok. Yeni bir plan oluşturun.',
  'plans.addPrayer': 'Plana Dua Ekle',
  'plans.removePrayer': 'Plandan Çıkar',
  'plans.deletePlan': 'Planı Sil',
  'plans.active': 'Aktif',
  'plans.passive': 'Pasif',
  'plans.makeActive': 'Bu planı aktif yap',
  'plans.prayers': 'dua',
  'plans.planNamePlaceholder': 'Örn: Rızık İçin, Huzur İçin...',
  'plans.create': 'Oluştur',
  'plans.days': 'gün',
  'plans.confirmDeletePlan': 'Bu plan ve tüm içeriği kalıcı olarak silinecek.',
  'plans.confirmDeletePrayer': 'Bu dua plandan çıkarılacak.',
  'library.title': 'Dua Kütüphanesi',
  'library.registered': 'dua kayıtlı',
  'library.searchPlaceholder': 'Dua, anlam veya kategori ara...',
  'library.all': 'Tümü',
  'library.noResults': 'Sonuç bulunamadı.',
  'library.meaning': 'Anlamı / Amacı',
  'library.priority': 'Öncelik',
  'library.suggestedCount': 'Önerilen Tekrar',
  'library.suggestedTime': 'Önerilen Vakit',
  'counter.session': 'Seansı',
  'counter.morningSession': 'Sabah Seansı',
  'counter.eveningSession': 'Akşam Seansı',
  'counter.tap': 'Dokun',
  'counter.tapToStart': 'Başlamak için daireye dokunun',
  'counter.remaining': 'kez kaldı',
  'counter.completed': 'Tamamlandı',
  'counter.times': 'kez',
  'counter.markAllRead': 'Tümünü Okundu Say',
  'counter.reset': 'Sıfırla',
  'counter.confirmTitle': 'Emin misiniz?',
  'counter.confirmMessage': 'Kalan sayılar tamamlanmış sayılacak.',
  'counter.confirmYes': 'Evet, Tamamla',
  'counter.confirmCancel': 'İptal',
  'common.cancel': 'İptal',
  'common.confirm': 'Onayla',
  'common.delete': 'Sil',
  'common.yes': 'Evet, Sil',
  'common.close': 'Kapat',
  'common.back': 'Geri',
  'settings.title': 'Ayarlar',
  'settings.language': 'Dil',
  'settings.languageDesc': 'Uygulama dilini seçin',
  'prayerTimes.title': 'Namaz Vakitleri',
  'prayerTimes.placeholder': 'Namaz vakitleri yakında burada görünecek.',
  'tasbih.title': 'Tesbihat',
  'tasbih.placeholder': 'Tesbihat sayacı yakında burada görünecek.',
  'tasbih.count': 'Sayı',
  'tasbih.increment': 'Artır',
  'tasbih.decrement': 'Azalt',
  'tasbih.reset': 'Sıfırla',
  'tasbih.resetConfirmTitle': 'Sayacı sıfırla?',
  'tasbih.resetConfirmMessage': 'Sayacın değeri sıfırlanacak.',
  'tasbih.resetConfirmBtn': 'Sıfırla',
  'tasbih.decrementLabel': 'Bir azalt',
  'tasbih.resetLabel': 'Sayacı sıfırla',
  'tasbih.countLabel': 'Mevcut sayı',
  'prayerTimes.fajr': 'Sabah',
  'prayerTimes.sunrise': 'Güneş',
  'prayerTimes.dhuhr': 'Öğle',
  'prayerTimes.asr': 'İkindi',
  'prayerTimes.magrib': 'Akşam',
  'prayerTimes.isha': 'Yatsı',
  'prayerTimes.nextPrayer': 'Sıradaki vakit',
  'prayerTimes.noLocation': 'Konum seçilmedi',
  'prayerTimes.useMyLocation': 'Mevcut Konumumu Kullan',
  'prayerTimes.selectManually': 'Bulunduğum Yeri Manuel Seç',
  'prayerTimes.changeLocation': 'Konumu Değiştir',
  'prayerTimes.loading': 'Vakitler yükleniyor...',
  'prayerTimes.error': 'Vakitler alınamadı. Lütfen tekrar deneyin.',
  'prayerTimes.geoDenied': 'Konum izni reddedildi. Lütfen manuel olarak konum seçin.',
  'prayerTimes.geoUnavailable': 'Konum bu cihazda kullanılamıyor. Lütfen manuel olarak konum seçin.',
  'prayerTimes.geoError': 'Konum alınamadı. Lütfen tekrar deneyin veya manuel seçim yapın.',
  'prayerTimes.retry': 'Tekrar Dene',
  'prayerTimes.cachedData': 'Çevrimdışı veri gösteriliyor',
  'prayerTimes.location': 'Konum',
  'prayerTimes.currentLocation': 'Mevcut Konum',
  'prayerTimes.changeCurrentLocation': 'Bulunduğum Yeri Değiştir',
  'prayerTimes.tomorrow': 'Yarın',
  'prayerTimes.methodAuto': 'Otomatik / Önerilen',
  'prayerTimes.currently': 'Şu an',
  'prayerTimes.selectCurrentLocationDesc': 'Bulunduğunuz ülke ve şehri seçin',
  'prayerTimes.timeUnavailable': 'Vakit bilgisi yok',
  'prayerTimes.selectCountry': 'Ülke Seçin',
  'prayerTimes.selectCity': 'Şehir Seçin',
  'prayerTimes.searchCountry': 'Ülke ara...',
  'prayerTimes.searchCity': 'Şehir ara...',
  'prayerTimes.calcMethod': 'Hesaplama Yöntemi',
  'prayerTimes.calcMethodDesc': 'Namaz vakitleri hesaplama yöntemi',
  'prayerTimes.method.diyanet': 'Diyanet İşleri Başkanlığı',
  'prayerTimes.method.mwl': 'Müslüman Dünya Birliği',
  'prayerTimes.method.isna': 'Kuzey Amerika İslam Cemiyeti',
  'prayerTimes.method.egypt': 'Mısır Genel Fetva Kurulu',
  'prayerTimes.method.makkah': 'Mekke Ümmül-Kura',
  'prayerTimes.method.karachi': 'Karaçi İslam Üniversitesi',
  'prayerTimes.method.tehran': 'Tahran Jeofizik Enstitüsü',
  'prayerTimes.method.jafari': 'Şia Jafari',
  'prayerTimes.method.default': 'Varsayılan',
  'prayerTimes.updateLocation': 'Konumu Güncelle',
  'prayerTimes.noCitySelected': 'Şehir seçilmedi',
  'prayerTimes.confirm': 'Onayla',
};

const en: TranslationDict = {
  'appName': 'Prayer & Dhikr Tracker',
  'tab.home': 'Home',
  'tab.plans': 'My Plans',
  'tab.library': 'Prayer Library',
  'nav.myPlans': 'My Plans',
  'nav.prayerLibrary': 'Prayer Library',
  'nav.prayerTimes': 'Prayer Times',
  'nav.tasbihCounter': 'Tasbih Counter',
  'home.todayDate': 'Today',
  'home.overallProgress': 'Overall Progress',
  'home.currentPriority': 'Your Current Priority',
  'home.allPrayers': 'All Prayers (Sequential)',
  'home.dayXOfY': 'Day',
  'home.morning': 'Morning',
  'home.evening': 'Evening',
  'home.prayersCompleted': 'prayers completed',
  'home.noPlanTitle': 'No plan yet',
  'home.noPlanDesc': 'Go to "My Plans" to create your reading plan.',
  'home.dailyQuote': 'Daily Quote',
  'home.dailyQuotePlaceholder': 'Daily quote will appear here soon.',
  'home.quickActions': 'Quick Access',
  'plans.title': 'My Plans',
  'plans.newPlan': 'Create New Plan',
  'plans.createPlan': 'New Plan',
  'plans.noPlans': 'No plans yet. Create a new plan.',
  'plans.noPlansDesc': 'No plans yet. Create a new plan.',
  'plans.addPrayer': 'Add Prayer to Plan',
  'plans.removePrayer': 'Remove from Plan',
  'plans.deletePlan': 'Delete Plan',
  'plans.active': 'Active',
  'plans.passive': 'Inactive',
  'plans.makeActive': 'Make this plan active',
  'plans.prayers': 'prayers',
  'plans.planNamePlaceholder': 'e.g. For Sustenance, For Peace...',
  'plans.create': 'Create',
  'plans.days': 'days',
  'plans.confirmDeletePlan': 'This plan and all its content will be permanently deleted.',
  'plans.confirmDeletePrayer': 'This prayer will be removed from the plan.',
  'library.title': 'Prayer Library',
  'library.registered': 'prayers registered',
  'library.searchPlaceholder': 'Search prayer, meaning or category...',
  'library.all': 'All',
  'library.noResults': 'No results found.',
  'library.meaning': 'Meaning / Purpose',
  'library.priority': 'Priority',
  'library.suggestedCount': 'Suggested Count',
  'library.suggestedTime': 'Suggested Time',
  'counter.session': 'Session',
  'counter.morningSession': 'Morning Session',
  'counter.eveningSession': 'Evening Session',
  'counter.tap': 'Tap',
  'counter.tapToStart': 'Tap the circle to begin',
  'counter.remaining': 'remaining',
  'counter.completed': 'Completed',
  'counter.times': 'times',
  'counter.markAllRead': 'Mark All as Read',
  'counter.reset': 'Reset',
  'counter.confirmTitle': 'Are you sure?',
  'counter.confirmMessage': 'Remaining counts will be marked as completed.',
  'counter.confirmYes': 'Yes, Complete',
  'counter.confirmCancel': 'Cancel',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.delete': 'Delete',
  'common.yes': 'Yes, Delete',
  'common.close': 'Close',
  'common.back': 'Back',
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.languageDesc': 'Select app language',
  'prayerTimes.title': 'Prayer Times',
  'prayerTimes.placeholder': 'Prayer times will appear here soon.',
  'tasbih.title': 'Tasbih Counter',
  'tasbih.placeholder': 'Tasbih counter will appear here soon.',
  'tasbih.count': 'Count',
  'tasbih.increment': 'Increment',
  'tasbih.decrement': 'Decrement',
  'tasbih.reset': 'Reset',
  'tasbih.resetConfirmTitle': 'Reset counter?',
  'tasbih.resetConfirmMessage': 'The counter value will be reset to zero.',
  'tasbih.resetConfirmBtn': 'Reset',
  'tasbih.decrementLabel': 'Decrement by one',
  'tasbih.resetLabel': 'Reset counter',
  'tasbih.countLabel': 'Current count',
  'prayerTimes.fajr': 'Fajr',
  'prayerTimes.sunrise': 'Sunrise',
  'prayerTimes.dhuhr': 'Dhuhr',
  'prayerTimes.asr': 'Asr',
  'prayerTimes.magrib': 'Maghrib',
  'prayerTimes.isha': 'Isha',
  'prayerTimes.nextPrayer': 'Next prayer',
  'prayerTimes.noLocation': 'No location selected',
  'prayerTimes.useMyLocation': 'Use My Current Location',
  'prayerTimes.selectManually': 'Select My Current Location Manually',
  'prayerTimes.changeLocation': 'Change Location',
  'prayerTimes.loading': 'Loading prayer times...',
  'prayerTimes.error': 'Could not fetch prayer times. Please try again.',
  'prayerTimes.geoDenied': 'Location permission denied. Please select a location manually.',
  'prayerTimes.geoUnavailable': 'Location is not available on this device. Please select a location manually.',
  'prayerTimes.geoError': 'Could not get your location. Please try again or select manually.',
  'prayerTimes.retry': 'Retry',
  'prayerTimes.cachedData': 'Showing offline data',
  'prayerTimes.location': 'Location',
  'prayerTimes.currentLocation': 'Current Location',
  'prayerTimes.changeCurrentLocation': 'Change Current Location',
  'prayerTimes.tomorrow': 'Tomorrow',
  'prayerTimes.methodAuto': 'Automatic / Recommended',
  'prayerTimes.currently': 'Currently',
  'prayerTimes.selectCurrentLocationDesc': 'Select the country and city where you are currently located',
  'prayerTimes.timeUnavailable': 'Time unavailable',
  'prayerTimes.selectCountry': 'Select Country',
  'prayerTimes.selectCity': 'Select City',
  'prayerTimes.searchCountry': 'Search country...',
  'prayerTimes.searchCity': 'Search city...',
  'prayerTimes.calcMethod': 'Calculation Method',
  'prayerTimes.calcMethodDesc': 'Prayer times calculation method',
  'prayerTimes.method.diyanet': 'Diyanet (Turkey)',
  'prayerTimes.method.mwl': 'Muslim World League',
  'prayerTimes.method.isna': 'Islamic Society of North America',
  'prayerTimes.method.egypt': 'Egyptian General Authority',
  'prayerTimes.method.makkah': 'Umm al-Qura, Makkah',
  'prayerTimes.method.karachi': 'University of Karachi',
  'prayerTimes.method.tehran': 'Institute of Geophysics, Tehran',
  'prayerTimes.method.jafari': 'Shia Ithna-Ashari (Jafari)',
  'prayerTimes.method.default': 'Default',
  'prayerTimes.updateLocation': 'Update Location',
  'prayerTimes.noCitySelected': 'No city selected',
  'prayerTimes.confirm': 'Confirm',
};

const ar: TranslationDict = {
  'appName': 'متتبع الدعاء والذكر',
  'tab.home': 'الرئيسية',
  'tab.plans': 'خططي',
  'tab.library': 'مكتبة الأدعية',
  'nav.myPlans': 'خططي',
  'nav.prayerLibrary': 'مكتبة الأدعية',
  'nav.prayerTimes': 'مواقيت الصلاة',
  'nav.tasbihCounter': 'عداد التسبيح',
  'home.todayDate': 'اليوم',
  'home.overallProgress': 'التقدم العام',
  'home.currentPriority': 'أولويتك الحالية',
  'home.allPrayers': 'جميع الأدعية (بالترتيب)',
  'home.dayXOfY': 'يوم',
  'home.morning': 'صباح',
  'home.evening': 'مساء',
  'home.prayersCompleted': 'دعاء مكتمل',
  'home.noPlanTitle': 'لا توجد خطة بعد',
  'home.noPlanDesc': 'اذهب إلى "خططي" لإنشاء خطة القراءة الخاصة بك.',
  'home.dailyQuote': 'اقتباس اليوم',
  'home.dailyQuotePlaceholder': 'سيظهر اقتباس اليوم هنا قريباً.',
  'home.quickActions': 'وصول سريع',
  'plans.title': 'خططي',
  'plans.newPlan': 'إنشاء خطة جديدة',
  'plans.createPlan': 'خطة جديدة',
  'plans.noPlans': 'لا توجد خطط بعد. أنشئ خطة جديدة.',
  'plans.noPlansDesc': 'لا توجد خطط بعد. أنشئ خطة جديدة.',
  'plans.addPrayer': 'إضافة دعاء للخطة',
  'plans.removePrayer': 'إزالة من الخطة',
  'plans.deletePlan': 'حذف الخطة',
  'plans.active': 'نشط',
  'plans.passive': 'غير نشط',
  'plans.makeActive': 'اجعل هذه الخطة نشطة',
  'plans.prayers': 'أدعية',
  'plans.planNamePlaceholder': 'مثال: للرزق، للسلام...',
  'plans.create': 'إنشاء',
  'plans.days': 'أيام',
  'plans.confirmDeletePlan': 'سيتم حذف هذه الخطة ومحتوياتها نهائياً.',
  'plans.confirmDeletePrayer': 'سيتم إزالة هذا الدعاء من الخطة.',
  'library.title': 'مكتبة الأدعية',
  'library.registered': 'دعاء مسجل',
  'library.searchPlaceholder': 'ابحث عن دعاء أو معنى أو فئة...',
  'library.all': 'الكل',
  'library.noResults': 'لا توجد نتائج.',
  'library.meaning': 'المعنى / الغرض',
  'library.priority': 'الأولوية',
  'library.suggestedCount': 'العدد الموصى به',
  'library.suggestedTime': 'الوقت الموصى به',
  'counter.session': 'جلسة',
  'counter.morningSession': 'جلسة الصباح',
  'counter.eveningSession': 'جلسة المساء',
  'counter.tap': 'انقر',
  'counter.tapToStart': 'انقر على الدائرة للبدء',
  'counter.remaining': 'متبقي',
  'counter.completed': 'مكتمل',
  'counter.times': 'مرة',
  'counter.markAllRead': 'تعليم الكل كمقروء',
  'counter.reset': 'إعادة تعيين',
  'counter.confirmTitle': 'هل أنت متأكد؟',
  'counter.confirmMessage': 'سيتم تعليم الأعداد المتبقية كمكتملة.',
  'counter.confirmYes': 'نعم، أكمل',
  'counter.confirmCancel': 'إلغاء',
  'common.cancel': 'إلغاء',
  'common.confirm': 'تأكيد',
  'common.delete': 'حذف',
  'common.yes': 'نعم، احذف',
  'common.close': 'إغلاق',
  'common.back': 'رجوع',
  'settings.title': 'الإعدادات',
  'settings.language': 'اللغة',
  'settings.languageDesc': 'اختر لغة التطبيق',
  'prayerTimes.title': 'مواقيت الصلاة',
  'prayerTimes.placeholder': 'ستظهر مواقيت الصلاة هنا قريباً.',
  'tasbih.title': 'عداد التسبيح',
  'tasbih.placeholder': 'سيظهر عداد التسبيح هنا قريباً.',
  'tasbih.count': 'العدد',
  'tasbih.increment': 'زيادة',
  'tasbih.decrement': 'إنقاص',
  'tasbih.reset': 'إعادة تعيين',
  'tasbih.resetConfirmTitle': 'إعادة تعيين العداد؟',
  'tasbih.resetConfirmMessage': 'سيتم إعادة قيمة العداد إلى الصفر.',
  'tasbih.resetConfirmBtn': 'إعادة تعيين',
  'tasbih.decrementLabel': 'إنقاص واحد',
  'tasbih.resetLabel': 'إعادة تعيين العداد',
  'tasbih.countLabel': 'العدد الحالي',
  'prayerTimes.fajr': 'الفجر',
  'prayerTimes.sunrise': 'الشروق',
  'prayerTimes.dhuhr': 'الظهر',
  'prayerTimes.asr': 'العصر',
  'prayerTimes.magrib': 'المغرب',
  'prayerTimes.isha': 'العشاء',
  'prayerTimes.nextPrayer': 'الصلاة التالية',
  'prayerTimes.noLocation': 'لم يتم اختيار الموقع',
  'prayerTimes.useMyLocation': 'استخدم موقعي الحالي',
  'prayerTimes.selectManually': 'اختر موقعي الحالي يدوياً',
  'prayerTimes.changeLocation': 'تغيير الموقع',
  'prayerTimes.loading': 'جاري تحميل مواقيت الصلاة...',
  'prayerTimes.error': 'تعذر الحصول على مواقيت الصلاة. حاول مرة أخرى.',
  'prayerTimes.geoDenied': 'تم رفض إذن الموقع. يرجى اختيار الموقع يدوياً.',
  'prayerTimes.geoUnavailable': 'الموقع غير متاح على هذا الجهاز. يرجى اختيار الموقع يدوياً.',
  'prayerTimes.geoError': 'تعذر الحصول على موقعك. حاول مرة أخرى أو اختر يدوياً.',
  'prayerTimes.retry': 'إعادة المحاولة',
  'prayerTimes.cachedData': 'عرض البيانات دون اتصال',
  'prayerTimes.location': 'الموقع',
  'prayerTimes.currentLocation': 'الموقع الحالي',
  'prayerTimes.changeCurrentLocation': 'تغيير الموقع الحالي',
  'prayerTimes.tomorrow': 'غداً',
  'prayerTimes.methodAuto': 'تلقائي / موصى به',
  'prayerTimes.currently': 'حالياً',
  'prayerTimes.selectCurrentLocationDesc': 'اختر الدولة والمدينة التي تتواجد فيها حالياً',
  'prayerTimes.timeUnavailable': 'الوقت غير متاح',
  'prayerTimes.selectCountry': 'اختر الدولة',
  'prayerTimes.selectCity': 'اختر المدينة',
  'prayerTimes.searchCountry': 'ابحث عن دولة...',
  'prayerTimes.searchCity': 'ابحث عن مدينة...',
  'prayerTimes.calcMethod': 'طريقة الحساب',
  'prayerTimes.calcMethodDesc': 'طريقة حساب مواقيت الصلاة',
  'prayerTimes.method.diyanet': 'رئاسة الشؤون الدينية (تركيا)',
  'prayerTimes.method.mwl': 'رابطة العالم الإسلامي',
  'prayerTimes.method.isna': 'الجمعية الإسلامية لأمريكا الشمالية',
  'prayerTimes.method.egypt': 'الهيئة المصرية العامة',
  'prayerTimes.method.makkah': 'أم القرى، مكة',
  'prayerTimes.method.karachi': 'جامعة كراتشي',
  'prayerTimes.method.tehran': 'معهد الجيوفيزياء، طهران',
  'prayerTimes.method.jafari': 'الشيعة الجعفري',
  'prayerTimes.method.default': 'افتراضي',
  'prayerTimes.updateLocation': 'تحديث الموقع',
  'prayerTimes.noCitySelected': 'لم يتم اختيار المدينة',
  'prayerTimes.confirm': 'تأكيد',
};

const de: TranslationDict = {
  'appName': 'Gebet & Dhikr Tracker',
  'tab.home': 'Startseite',
  'tab.plans': 'Meine Pläne',
  'tab.library': 'Gebetbibliothek',
  'nav.myPlans': 'Meine Pläne',
  'nav.prayerLibrary': 'Gebetbibliothek',
  'nav.prayerTimes': 'Gebetszeiten',
  'nav.tasbihCounter': 'Tasbih Zähler',
  'home.todayDate': 'Heute',
  'home.overallProgress': 'Gesamtfortschritt',
  'home.currentPriority': 'Ihre aktuelle Priorität',
  'home.allPrayers': 'Alle Gebete (Reihenfolge)',
  'home.dayXOfY': 'Tag',
  'home.morning': 'Morgen',
  'home.evening': 'Abend',
  'home.prayersCompleted': 'Gebete abgeschlossen',
  'home.noPlanTitle': 'Noch kein Plan',
  'home.noPlanDesc': 'Gehen Sie zu "Meine Pläne", um Ihren Leseplan zu erstellen.',
  'home.dailyQuote': 'Tageszitat',
  'home.dailyQuotePlaceholder': 'Das Tageszitat erscheint hier bald.',
  'home.quickActions': 'Schnellzugriff',
  'plans.title': 'Meine Pläne',
  'plans.newPlan': 'Neuen Plan erstellen',
  'plans.createPlan': 'Neuer Plan',
  'plans.noPlans': 'Noch keine Pläne. Erstellen Sie einen neuen Plan.',
  'plans.noPlansDesc': 'Noch keine Pläne. Erstellen Sie einen neuen Plan.',
  'plans.addPrayer': 'Gebet zum Plan hinzufügen',
  'plans.removePrayer': 'Aus Plan entfernen',
  'plans.deletePlan': 'Plan löschen',
  'plans.active': 'Aktiv',
  'plans.passive': 'Inaktiv',
  'plans.makeActive': 'Diesen Plan aktiv machen',
  'plans.prayers': 'Gebete',
  'plans.planNamePlaceholder': 'z.B. Für Versorgung, Für Frieden...',
  'plans.create': 'Erstellen',
  'plans.days': 'Tage',
  'plans.confirmDeletePlan': 'Dieser Plan und alle Inhalte werden dauerhaft gelöscht.',
  'plans.confirmDeletePrayer': 'Dieses Gebet wird aus dem Plan entfernt.',
  'library.title': 'Gebetbibliothek',
  'library.registered': 'Gebete registriert',
  'library.searchPlaceholder': 'Gebet, Bedeutung oder Kategorie suchen...',
  'library.all': 'Alle',
  'library.noResults': 'Keine Ergebnisse gefunden.',
  'library.meaning': 'Bedeutung / Zweck',
  'library.priority': 'Priorität',
  'library.suggestedCount': 'Empfohlene Anzahl',
  'library.suggestedTime': 'Empfohlene Zeit',
  'counter.session': 'Sitzung',
  'counter.morningSession': 'Morgensitzung',
  'counter.eveningSession': 'Abendsitzung',
  'counter.tap': 'Tippen',
  'counter.tapToStart': 'Tippen Sie auf den Kreis, um zu beginnen',
  'counter.remaining': 'verbleibend',
  'counter.completed': 'Abgeschlossen',
  'counter.times': 'mal',
  'counter.markAllRead': 'Alle als gelesen markieren',
  'counter.reset': 'Zurücksetzen',
  'counter.confirmTitle': 'Sind Sie sicher?',
  'counter.confirmMessage': 'Verbleibende Zählungen werden als abgeschlossen markiert.',
  'counter.confirmYes': 'Ja, Abschließen',
  'counter.confirmCancel': 'Abbrechen',
  'common.cancel': 'Abbrechen',
  'common.confirm': 'Bestätigen',
  'common.delete': 'Löschen',
  'common.yes': 'Ja, Löschen',
  'common.close': 'Schließen',
  'common.back': 'Zurück',
  'settings.title': 'Einstellungen',
  'settings.language': 'Sprache',
  'settings.languageDesc': 'App-Sprache wählen',
  'prayerTimes.title': 'Gebetszeiten',
  'prayerTimes.placeholder': 'Gebetszeiten werden hier bald erscheinen.',
  'tasbih.title': 'Tasbih Zähler',
  'tasbih.placeholder': 'Tasbih Zähler wird hier bald erscheinen.',
  'tasbih.count': 'Zähler',
  'tasbih.increment': 'Erhöhen',
  'tasbih.decrement': 'Verringern',
  'tasbih.reset': 'Zurücksetzen',
  'tasbih.resetConfirmTitle': 'Zähler zurücksetzen?',
  'tasbih.resetConfirmMessage': 'Der Zähler wird auf null zurückgesetzt.',
  'tasbih.resetConfirmBtn': 'Zurücksetzen',
  'tasbih.decrementLabel': 'Eins verringern',
  'tasbih.resetLabel': 'Zähler zurücksetzen',
  'tasbih.countLabel': 'Aktueller Zählerstand',
  'prayerTimes.fajr': 'Fadschr',
  'prayerTimes.sunrise': 'Sonnenaufgang',
  'prayerTimes.dhuhr': 'Zuhr',
  'prayerTimes.asr': 'Asr',
  'prayerTimes.magrib': 'Maghrib',
  'prayerTimes.isha': 'Ischa',
  'prayerTimes.nextPrayer': 'Nächstes Gebet',
  'prayerTimes.noLocation': 'Kein Standort ausgewählt',
  'prayerTimes.useMyLocation': 'Meinen aktuellen Standort verwenden',
  'prayerTimes.selectManually': 'Meinen aktuellen Standort manuell auswählen',
  'prayerTimes.changeLocation': 'Standort ändern',
  'prayerTimes.loading': 'Gebetszeiten werden geladen...',
  'prayerTimes.error': 'Gebetszeiten konnten nicht abgerufen werden. Bitte erneut versuchen.',
  'prayerTimes.geoDenied': 'Standortberechtigung verweigert. Bitte Standort manuell auswählen.',
  'prayerTimes.geoUnavailable': 'Standort auf diesem Gerät nicht verfügbar. Bitte manuell auswählen.',
  'prayerTimes.geoError': 'Standort konnte nicht ermittelt werden. Bitte erneut versuchen oder manuell auswählen.',
  'prayerTimes.retry': 'Erneut versuchen',
  'prayerTimes.cachedData': 'Offline-Daten werden angezeigt',
  'prayerTimes.location': 'Standort',
  'prayerTimes.currentLocation': 'Aktueller Standort',
  'prayerTimes.changeCurrentLocation': 'Aktuellen Standort ändern',
  'prayerTimes.tomorrow': 'Morgen',
  'prayerTimes.methodAuto': 'Automatisch / Empfohlen',
  'prayerTimes.currently': 'Aktuell',
  'prayerTimes.selectCurrentLocationDesc': 'Wählen Sie das Land und die Stadt, in der Sie sich aktuell befinden',
  'prayerTimes.timeUnavailable': 'Zeit nicht verfügbar',
  'prayerTimes.selectCountry': 'Land auswählen',
  'prayerTimes.selectCity': 'Stadt auswählen',
  'prayerTimes.searchCountry': 'Land suchen...',
  'prayerTimes.searchCity': 'Stadt suchen...',
  'prayerTimes.calcMethod': 'Berechnungsmethode',
  'prayerTimes.calcMethodDesc': 'Methode zur Berechnung der Gebetszeiten',
  'prayerTimes.method.diyanet': 'Diyanet (Türkei)',
  'prayerTimes.method.mwl': 'Muslim World League',
  'prayerTimes.method.isna': 'Islamic Society of North America',
  'prayerTimes.method.egypt': 'Egyptian General Authority',
  'prayerTimes.method.makkah': 'Umm al-Qura, Makkah',
  'prayerTimes.method.karachi': 'Universität Karachi',
  'prayerTimes.method.tehran': 'Institut für Geophysik, Teheran',
  'prayerTimes.method.jafari': 'Schiitisch Jafari',
  'prayerTimes.method.default': 'Standard',
  'prayerTimes.updateLocation': 'Standort aktualisieren',
  'prayerTimes.noCitySelected': 'Keine Stadt ausgewählt',
  'prayerTimes.confirm': 'Bestätigen',
};

const fr: TranslationDict = {
  'appName': 'Suivi des Prières et Dhikr',
  'tab.home': 'Accueil',
  'tab.plans': 'Mes Plans',
  'tab.library': 'Bibliothèque de Prières',
  'nav.myPlans': 'Mes Plans',
  'nav.prayerLibrary': 'Bibliothèque de Prières',
  'nav.prayerTimes': 'Heures de Prière',
  'nav.tasbihCounter': 'Compteur Tasbih',
  'home.todayDate': 'Aujourd\'hui',
  'home.overallProgress': 'Progrès Général',
  'home.currentPriority': 'Votre Priorité Actuelle',
  'home.allPrayers': 'Toutes les Prières (Ordre)',
  'home.dayXOfY': 'Jour',
  'home.morning': 'Matin',
  'home.evening': 'Soir',
  'home.prayersCompleted': 'prières terminées',
  'home.noPlanTitle': 'Aucun plan pour le moment',
  'home.noPlanDesc': 'Allez dans "Mes Plans" pour créer votre plan de lecture.',
  'home.dailyQuote': 'Citation du Jour',
  'home.dailyQuotePlaceholder': 'La citation du jour apparaîtra bientôt ici.',
  'home.quickActions': 'Accès Rapide',
  'plans.title': 'Mes Plans',
  'plans.newPlan': 'Créer un Nouveau Plan',
  'plans.createPlan': 'Nouveau Plan',
  'plans.noPlans': 'Aucun plan pour le moment. Créez un nouveau plan.',
  'plans.noPlansDesc': 'Aucun plan pour le moment. Créez un nouveau plan.',
  'plans.addPrayer': 'Ajouter une Prière au Plan',
  'plans.removePrayer': 'Retirer du Plan',
  'plans.deletePlan': 'Supprimer le Plan',
  'plans.active': 'Actif',
  'plans.passive': 'Inactif',
  'plans.makeActive': 'Activer ce plan',
  'plans.prayers': 'prières',
  'plans.planNamePlaceholder': 'ex: Pour la Subsistance, Pour la Paix...',
  'plans.create': 'Créer',
  'plans.days': 'jours',
  'plans.confirmDeletePlan': 'Ce plan et tout son contenu seront définitivement supprimés.',
  'plans.confirmDeletePrayer': 'Cette prière sera retirée du plan.',
  'library.title': 'Bibliothèque de Prières',
  'library.registered': 'prières enregistrées',
  'library.searchPlaceholder': 'Rechercher prière, signification ou catégorie...',
  'library.all': 'Tous',
  'library.noResults': 'Aucun résultat trouvé.',
  'library.meaning': 'Signification / But',
  'library.priority': 'Priorité',
  'library.suggestedCount': 'Nombre Recommandé',
  'library.suggestedTime': 'Temps Recommandé',
  'counter.session': 'Session',
  'counter.morningSession': 'Session du Matin',
  'counter.eveningSession': 'Session du Soir',
  'counter.tap': 'Toucher',
  'counter.tapToStart': 'Touchez le cercle pour commencer',
  'counter.remaining': 'restant',
  'counter.completed': 'Terminé',
  'counter.times': 'fois',
  'counter.markAllRead': 'Tout Marquer comme Lu',
  'counter.reset': 'Réinitialiser',
  'counter.confirmTitle': 'Êtes-vous sûr?',
  'counter.confirmMessage': 'Les comptes restants seront marqués comme terminés.',
  'counter.confirmYes': 'Oui, Terminer',
  'counter.confirmCancel': 'Annuler',
  'common.cancel': 'Annuler',
  'common.confirm': 'Confirmer',
  'common.delete': 'Supprimer',
  'common.yes': 'Oui, Supprimer',
  'common.close': 'Fermer',
  'common.back': 'Retour',
  'settings.title': 'Paramètres',
  'settings.language': 'Langue',
  'settings.languageDesc': 'Choisir la langue de l\'application',
  'prayerTimes.title': 'Heures de Prière',
  'prayerTimes.placeholder': 'Les heures de prière apparaîtront bientôt ici.',
  'tasbih.title': 'Compteur Tasbih',
  'tasbih.placeholder': 'Le compteur Tasbih apparaîtra bientôt ici.',
  'tasbih.count': 'Compteur',
  'tasbih.increment': 'Incrémenter',
  'tasbih.decrement': 'Décrémenter',
  'tasbih.reset': 'Réinitialiser',
  'tasbih.resetConfirmTitle': 'Réinitialiser le compteur?',
  'tasbih.resetConfirmMessage': 'Le compteur sera remis à zéro.',
  'tasbih.resetConfirmBtn': 'Réinitialiser',
  'tasbih.decrementLabel': 'Décrémenter de un',
  'tasbih.resetLabel': 'Réinitialiser le compteur',
  'tasbih.countLabel': 'Compteur actuel',
  'prayerTimes.fajr': 'Fajr',
  'prayerTimes.sunrise': 'Lever du soleil',
  'prayerTimes.dhuhr': 'Dhuhr',
  'prayerTimes.asr': 'Asr',
  'prayerTimes.magrib': 'Maghrib',
  'prayerTimes.isha': 'Isha',
  'prayerTimes.nextPrayer': 'Prochaine prière',
  'prayerTimes.noLocation': 'Aucun lieu sélectionné',
  'prayerTimes.useMyLocation': 'Utiliser ma position actuelle',
  'prayerTimes.selectManually': 'Sélectionner mon lieu actuel manuellement',
  'prayerTimes.changeLocation': 'Changer le lieu',
  'prayerTimes.loading': 'Chargement des heures de prière...',
  'prayerTimes.error': 'Impossible de récupérer les heures de prière. Veuillez réessayer.',
  'prayerTimes.geoDenied': 'Autorisation de localisation refusée. Veuillez sélectionner un lieu manuellement.',
  'prayerTimes.geoUnavailable': 'La localisation n\'est pas disponible sur cet appareil. Veuillez sélectionner manuellement.',
  'prayerTimes.geoError': 'Impossible d\'obtenir votre position. Veuillez réessayer ou sélectionner manuellement.',
  'prayerTimes.retry': 'Réessayer',
  'prayerTimes.cachedData': 'Affichage des données hors ligne',
  'prayerTimes.location': 'Lieu',
  'prayerTimes.currentLocation': 'Lieu actuel',
  'prayerTimes.changeCurrentLocation': 'Changer le lieu actuel',
  'prayerTimes.tomorrow': 'Demain',
  'prayerTimes.methodAuto': 'Automatique / Recommandé',
  'prayerTimes.currently': 'Actuellement',
  'prayerTimes.selectCurrentLocationDesc': 'Sélectionnez le pays et la ville où vous vous trouvez actuellement',
  'prayerTimes.timeUnavailable': 'Heure non disponible',
  'prayerTimes.selectCountry': 'Sélectionner un pays',
  'prayerTimes.selectCity': 'Sélectionner une ville',
  'prayerTimes.searchCountry': 'Rechercher un pays...',
  'prayerTimes.searchCity': 'Rechercher une ville...',
  'prayerTimes.calcMethod': 'Méthode de calcul',
  'prayerTimes.calcMethodDesc': 'Méthode de calcul des heures de prière',
  'prayerTimes.method.diyanet': 'Diyanet (Turquie)',
  'prayerTimes.method.mwl': 'Ligue Islamique Mondiale',
  'prayerTimes.method.isna': 'Société Islamique d\'Amérique du Nord',
  'prayerTimes.method.egypt': 'Autorité Générale Égyptienne',
  'prayerTimes.method.makkah': 'Umm al-Qura, La Mecque',
  'prayerTimes.method.karachi': 'Université de Karachi',
  'prayerTimes.method.tehran': 'Institut de Géophysique, Téhéran',
  'prayerTimes.method.jafari': 'Chiite Jafari',
  'prayerTimes.method.default': 'Par défaut',
  'prayerTimes.updateLocation': 'Mettre à jour le lieu',
  'prayerTimes.noCitySelected': 'Aucune ville sélectionnée',
  'prayerTimes.confirm': 'Confirmer',
};

export const translations: Record<LanguageCode, TranslationDict> = { tr, en, ar, de, fr };

export function detectLanguage(): LanguageCode {
  const stored = localStorage.getItem('app-language') as LanguageCode | null;
  if (stored && stored in translations) return stored;

  const browser = navigator.language.split('-')[0] as LanguageCode;
  if (browser in translations) return browser;

  return 'en';
}
