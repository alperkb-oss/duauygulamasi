import { useState } from 'react';
import { ChevronLeft, Search, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/translations';

export type CountryCity = {
  country: string;
  city: string;
};

type LocationPickerProps = {
  onSelect: (country: string, city: string) => void;
  onCancel: () => void;
};

type SelectionStep = 'country' | 'city';

const COUNTRIES: string[] = [
  'Turkey', 'Germany', 'France', 'United States', 'United Kingdom', 'Saudi Arabia',
  'Egypt', 'United Arab Emirates', 'Morocco', 'Algeria', 'Tunisia', 'Libya',
  'Jordan', 'Syria', 'Lebanon', 'Iraq', 'Iran', 'Pakistan', 'India', 'Bangladesh',
  'Indonesia', 'Malaysia', 'Nigeria', 'Senegal', 'Mali', 'Niger', 'Chad',
  'Sudan', 'Ethiopia', 'Somalia', 'Kenya', 'Tanzania', 'South Africa',
  'Russia', 'Ukraine', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan',
  'Turkmenistan', 'Azerbaijan', 'China', 'Japan', 'South Korea', 'Australia',
  'New Zealand', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile',
  'Colombia', 'Peru', 'Spain', 'Italy', 'Portugal', 'Netherlands', 'Belgium',
  'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Poland', 'Czech Republic', 'Greece', 'Bulgaria', 'Romania', 'Serbia',
  'Bosnia and Herzegovina', 'Croatia', 'Slovenia', 'Slovakia', 'Hungary',
  'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Yemen', 'Afghanistan',
  'Palestine', 'Cyprus', 'Malta', 'Ireland',
];

const CITIES: Record<string, string[]> = {
  'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır', 'Kayseri', 'Eskisehir', 'Samsun', 'Trabzon', 'Denizli', 'Sanliurfa', 'Malatya', 'Erzurum', 'Van', 'Batum'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston'],
  'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow', 'Liverpool', 'Newcastle', 'Sheffield', 'Bristol', 'Edinburgh', 'Cardiff', 'Belfast', 'Leicester', 'Coventry', 'Bradford', 'Nottingham', 'Hull', 'Plymouth', 'Stoke-on-Trent', 'Wolverhampton'],
  'Saudi Arabia': ['Mecca', 'Medina', 'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Taif', 'Tabuk', 'Abha', 'Khamis Mushait', 'Buraidah', 'Khobar', 'Hail', 'Najran', 'Jubail', 'Yanbu', 'Arar', 'Sakaka', 'Jizan', 'Bahrah'],
  'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Port Said', 'Suez', 'Mansoura', 'Tanta', 'Asyut', 'Ismailia', 'Fayyum', 'Zagazig', 'Damietta', 'Sohag', 'Minya', 'Beni Suef', 'Qena', 'Hurghada', 'Sharm El Sheikh'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Khor Fakkan', 'Dibba Al-Fujairah'],
  'Morocco': ['Casablanca', 'Rabat', 'Marrakesh', 'Fes', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Beni Mellal', 'Nador', 'Taza', 'Settat', 'Berrechid', 'Khemisset'],
  'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi', 'Denpasar', 'Yogyakarta', 'Malang', 'Padang', 'Pekanbaru', 'Manado', 'Balikpapan', 'Pontianak', 'Cirebon', 'Bogor'],
  'Pakistan': ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Peshawar', 'Quetta', 'Islamabad', 'Hyderabad', 'Sukkur', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sahiwal', 'Mardan', 'Gujrat', 'Larkana', 'Kasur', 'Sheikhupura'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra'],
  'Iran': ['Tehran', 'Mashhad', 'Isfahan', 'Karaj', 'Shiraz', 'Tabriz', 'Qom', 'Ahvaz', 'Kermanshah', 'Urmia', 'Rasht', 'Kerman', 'Zahedan', 'Arak', 'Hamadan', 'Yazd', 'Ardabil', 'Bandar Abbas', 'Eslamshahr', 'Zanjan'],
  'Russia': ['Moscow', 'Saint Petersburg', 'Kazan', 'Novosibirsk', 'Yekaterinburg', 'Nizhny Novgorod', 'Samara', 'Omsk', 'Rostov-on-Don', 'Ufa', 'Chelyabinsk', 'Krasnoyarsk', 'Voronezh', 'Perm', 'Volgograd'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Halifax', 'Victoria', 'Saskatoon', 'Regina', 'London', 'Kingston', 'Windsor', 'Burnaby', 'Mississauga', 'Brampton', 'Surrey'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Hobart', 'Darwin', 'Cairns', 'Geelong', 'Wollongong', 'Townsville', 'Ballarat'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Malaga', 'Murcia', 'Palma', 'Bilbao', 'Alicante', 'Cordoba', 'Valladolid', 'Vigo', 'Gijon', 'Granada', 'Vitoria', 'La Coruna', 'Santander'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Messina', 'Padua', 'Trieste', 'Brescia', 'Parma', 'Prato', 'Taranto', 'Modena'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen', 'Enschede', 'Apeldoorn', 'Haarlem', 'Arnhem', 'Amersfoort', 'Zaanstad', 's-Hertogenbosch', 'Haarlemmermeer', 'Zwolle', 'Zoetermeer'],
  'Belgium': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst', 'Mechelen', 'La Louvière', 'Kortrijk', 'Ostend', 'Tournai', 'Seraing', 'Roeselare', 'Verviers', 'Mouscron', 'Beveren'],
  'Austria': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn', 'Steyr', 'Wiener Neustadt', 'Feldkirch', 'Bregenz', 'Leonding'],
  'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel', 'Thun', 'Köniz', 'Bellefontaine', 'Frauenfeld', 'Chur'],
};

function getCitiesForCountry(country: string): string[] {
  return CITIES[country] || [];
}

export function LocationPicker({ onSelect, onCancel }: LocationPickerProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<SelectionStep>('country');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [search, setSearch] = useState('');

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setStep('city');
    setSearch('');
  };

  const handleCitySelect = (city: string) => {
    onSelect(selectedCountry, city);
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  ).sort((a, b) => a.localeCompare(b));

  const cities = getCitiesForCountry(selectedCountry);
  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  const placeholderKey: TranslationKey = step === 'country' ? 'prayerTimes.searchCountry' : 'prayerTimes.searchCity';
  const titleKey: TranslationKey = step === 'country' ? 'prayerTimes.selectCountry' : 'prayerTimes.selectCity';

  const subtitleKey: TranslationKey = 'prayerTimes.selectCurrentLocationDesc';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-emerald-950/95 backdrop-blur-xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-emerald-800/30">
        <button
          onClick={() => (step === 'city' ? setStep('country') : onCancel())}
          className="w-10 h-10 rounded-full bg-emerald-900/60 flex items-center justify-center text-midnight-300 hover:text-gold-400 transition-colors border border-emerald-800/40"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-display font-bold text-gold-100">{t(titleKey)}</h2>
      </div>

      {/* Subtitle */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs text-midnight-400 text-center">{t(subtitleKey)}</p>
      </div>

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-500 rtl:left-auto rtl:right-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(placeholderKey)}
            className="w-full bg-emerald-950/40 border border-emerald-800/40 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-3 text-sm text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-gold-400/50 transition-colors"
            autoFocus
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-1">
        {step === 'country' &&
          filteredCountries.map((country) => (
            <button
              key={country}
              onClick={() => handleCountrySelect(country)}
              className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left bg-emerald-950/30 border border-emerald-800/20 hover:border-gold-400/30 transition-colors active:scale-95"
            >
              <span className="text-sm font-medium text-midnight-100">{country}</span>
              <ChevronLeft className="w-4 h-4 text-midnight-500 rtl:rotate-180" />
            </button>
          ))}

        {step === 'city' &&
          filteredCities.map((city) => (
            <button
              key={city}
              onClick={() => handleCitySelect(city)}
              className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left bg-emerald-950/30 border border-emerald-800/20 hover:border-gold-400/30 transition-colors active:scale-95"
            >
              <span className="text-sm font-medium text-midnight-100">{city}</span>
              <Check className="w-4 h-4 text-gold-400/50" />
            </button>
          ))}

        {step === 'city' && filteredCities.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-12 text-center">
            <p className="text-sm text-midnight-400">{t('prayerTimes.noCitySelected')}</p>
            <button
              onClick={() => handleCitySelect(search.trim() || selectedCountry)}
              className="mt-4 btn-primary flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {t('prayerTimes.confirm')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
