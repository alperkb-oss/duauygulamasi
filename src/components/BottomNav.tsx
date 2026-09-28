import { Home, BookOpen, Library } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/translations';

export type TabKey = 'dashboard' | 'plans' | 'library';

type BottomNavProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

const TABS: { key: TabKey; labelKey: TranslationKey; icon: typeof Home }[] = [
  { key: 'dashboard', labelKey: 'tab.home', icon: Home },
  { key: 'plans', labelKey: 'tab.plans', icon: BookOpen },
  { key: 'library', labelKey: 'tab.library', icon: Library },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-emerald-950/90 backdrop-blur-xl border-t border-gold-400/15 safe-bottom">
      <div className="flex items-center justify-around px-2 pt-2 pb-2">
        {TABS.map(({ key, labelKey, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-gold-400'
                  : 'text-midnight-400 hover:text-midnight-200'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  active ? 'scale-110' : 'scale-100'
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                {t(labelKey)}
              </span>
              {active && (
                <div className="absolute -mt-1 w-1 h-1 rounded-full bg-gold-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
