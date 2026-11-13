/*
# Seed 12 purpose groups

1. New Rows
- `purpose_groups`: 12 rows with stable codes and Turkish names, ordered by sort_order 1 to 12.
  - forgiveness, gratitude, faith, protection, peace, sustenance, health, family, knowledge, trust, worship, wishes.
- English names are left empty; they were not provided.

2. Safety
- Insert uses ON CONFLICT (code) DO NOTHING, so re-running never creates duplicates and never overwrites an existing row.
- No schema, policy, or grant changes.
- No prayer records are linked to these groups.

# Notes
1. The table has no description column; Turkish descriptions are not stored by this migration.
*/

INSERT INTO purpose_groups (code, name_tr, sort_order) VALUES
  ('forgiveness', 'Af ve Tövbe', 1),
  ('gratitude', 'Şükür ve Hamd', 2),
  ('faith', 'Hidayet ve İman', 3),
  ('protection', 'Korunma ve Güven', 4),
  ('peace', 'Huzur ve Ferahlık', 5),
  ('sustenance', 'Rızık ve Bereket', 6),
  ('health', 'Sağlık ve Afiyet', 7),
  ('family', 'Aile ve Sevdiklerimiz', 8),
  ('knowledge', 'İlim ve Başarı', 9),
  ('trust', 'Tevekkül ve Hayırlı Karar', 10),
  ('worship', 'İbadet ve Manevi Kazanım', 11),
  ('wishes', 'Hayır ve Dilekler', 12)
ON CONFLICT (code) DO NOTHING;
