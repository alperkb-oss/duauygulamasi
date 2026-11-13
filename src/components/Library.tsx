import { useState } from 'react';
import { Library as LibraryIcon, User } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { SystemLibrary } from '@/components/SystemLibrary';
import { PersonalLibrary } from '@/components/PersonalLibrary';

type LibraryTab = 'system' | 'personal';

export function Library() {
  const { t } = useI18n();
  const [tab, setTab] = useState<LibraryTab>('system');

  const tabs: { key: LibraryTab; label: string; icon: typeof LibraryIcon }[] = [
    { key: 'system', label: t('library.tabSystem'), icon: LibraryIcon },
    { key: 'personal', label: t('library.tabPersonal'), icon: User },
  ];

  return (
    <div className="px-4 pt-6 pb-24 space-y-4 animate-fade-in">
      <h1 className="text-2xl font-display font-bold text-gold-100">{t('library.title')}</h1>

      <div className="flex gap-1 bg-midnight-900/60 rounded-xl p-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === key ? 'bg-gold-400 text-midnight-950' : 'text-midnight-300 hover:text-midnight-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'system' ? <SystemLibrary /> : <PersonalLibrary />}
    </div>
  );
}
