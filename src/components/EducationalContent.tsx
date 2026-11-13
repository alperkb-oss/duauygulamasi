import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { EducationalRow, EducationalTopic } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/translations';

const TOPIC_LABELS: Record<EducationalTopic, TranslationKey> = {
  namaz: 'library.educationNamaz',
  abdest: 'library.educationAbdest',
};

type Block =
  | { type: 'single'; row: EducationalRow }
  | { type: 'table'; rows: EducationalRow[] };

export function EducationalContent() {
  const { t } = useI18n();
  const [rows, setRows] = useState<EducationalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [topic, setTopic] = useState<EducationalTopic>('namaz');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data, error } = await supabase
      .from('educational_content')
      .select('*')
      .order('topic', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error || !data) {
      setLoadError(true);
    } else {
      setRows(data as EducationalRow[]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-6 h-6 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-sm text-midnight-300">{t('library.loadError')}</p>
      </div>
    );
  }

  const topicRows = rows.filter((row) => row.topic === topic);

  return (
    <section className="glass-card p-4 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-gold-100">{t('library.educationTitle')}</h2>
        <p className="text-xs text-midnight-400">{t('library.educationNote')}</p>
      </div>

      <div className="flex gap-2" role="tablist">
        {(Object.keys(TOPIC_LABELS) as EducationalTopic[]).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={topic === key}
            onClick={() => setTopic(key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              topic === key
                ? 'bg-gold-400 text-midnight-950'
                : 'bg-emerald-950/40 text-midnight-300 border border-emerald-800/40'
            }`}
          >
            {t(TOPIC_LABELS[key])}
          </button>
        ))}
      </div>

      <div key={topic} className="space-y-4 animate-slide-up">
        {groupBlocks(topicRows).map((block, index) =>
          block.type === 'table' ? (
            <EducationTable key={index} rows={block.rows} />
          ) : (
            <EducationLine key={index} row={block.row} />
          )
        )}
      </div>
    </section>
  );
}

function groupBlocks(rows: EducationalRow[]): Block[] {
  const blocks: Block[] = [];
  for (const row of rows) {
    const last = blocks[blocks.length - 1];
    if (row.kind === 'table_row') {
      if (last?.type === 'table') {
        last.rows.push(row);
      } else {
        blocks.push({ type: 'table', rows: [row] });
      }
    } else {
      blocks.push({ type: 'single', row });
    }
  }
  return blocks;
}

function firstText(row: EducationalRow): string {
  return row.cells.find((cell) => cell.trim() !== '') ?? '';
}

function EducationLine({ row }: { row: EducationalRow }) {
  const text = firstText(row);
  if (row.kind === 'title') {
    return <h3 className="text-lg font-display font-bold text-gold-100 pt-2">{text}</h3>;
  }
  if (row.kind === 'heading') {
    return <h4 className="text-base font-display font-semibold text-gold-200 pt-2">{text}</h4>;
  }
  return <p className="text-sm text-midnight-200 leading-relaxed">{text}</p>;
}

function EducationTable({ rows }: { rows: EducationalRow[] }) {
  const width = Math.max(...rows.map((row) => row.cells.length));
  const columns = Array.from({ length: width }, (_, index) => index).filter((index) =>
    rows.some((row) => (row.cells[index] ?? '').trim() !== '')
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-emerald-800/40">
      <table className="w-full text-xs text-left">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-emerald-800/30 first:border-t-0">
              {columns.map((column, colIndex) => (
                <td
                  key={column}
                  className={`px-3 py-2 align-top leading-relaxed ${
                    colIndex === 0 ? 'font-medium text-gold-100 whitespace-nowrap' : 'text-midnight-200'
                  }`}
                >
                  {row.cells[column] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
