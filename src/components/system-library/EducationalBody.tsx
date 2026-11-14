import type { EducationalRow } from '@/lib/supabase';

type Block =
  | { type: 'single'; row: EducationalRow }
  | { type: 'table'; rows: EducationalRow[] };

export function EducationalBody({ rows }: { rows: EducationalRow[] }) {
  return (
    <div className="space-y-4">
      {groupBlocks(rows).map((block, index) =>
        block.type === 'table' ? (
          <EducationTable key={index} rows={block.rows} />
        ) : (
          <EducationLine key={index} row={block.row} />
        )
      )}
    </div>
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
    return <h3 className="pt-4 font-display text-2xl font-bold text-gold-100">{text}</h3>;
  }
  if (row.kind === 'heading') {
    return <h4 className="pt-3 font-display text-lg font-semibold text-gold-200">{text}</h4>;
  }
  return <p className="text-sm leading-relaxed text-midnight-200">{text}</p>;
}

function EducationTable({ rows }: { rows: EducationalRow[] }) {
  const width = Math.max(...rows.map((row) => row.cells.length));
  const columns = Array.from({ length: width }, (_, index) => index).filter((index) =>
    rows.some((row) => (row.cells[index] ?? '').trim() !== '')
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-emerald-800/40">
      <table className="w-full text-left text-xs">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-emerald-800/30 first:border-t-0">
              {columns.map((column, colIndex) => (
                <td
                  key={column}
                  className={`px-3 py-2 align-top leading-relaxed ${
                    colIndex === 0 ? 'whitespace-nowrap font-medium text-gold-100' : 'text-midnight-200'
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
