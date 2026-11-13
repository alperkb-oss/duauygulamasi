/*
# Restrict default grants on new library tables

1. Modified Privileges
- `purpose_groups` and `prayer_purposes`: all write privileges are removed from anon and authenticated. Read access (SELECT) is kept.
- `personal_library_entries`: anon loses all access. authenticated keeps SELECT, INSERT, UPDATE, DELETE only.

2. Security
- Client roles can only read shared reference data. Writes to it remain possible only through the database owner.
- Personal entries stay limited to their owner by the existing row policies.

# Notes
1. No data is changed. These tables were created in the previous migrations and hold no user data yet.
2. Idempotent: REVOKE and GRANT can be re-run safely.
*/

REVOKE ALL ON purpose_groups FROM anon, authenticated;
GRANT SELECT ON purpose_groups TO anon, authenticated;

REVOKE ALL ON prayer_purposes FROM anon, authenticated;
GRANT SELECT ON prayer_purposes TO anon, authenticated;

REVOKE ALL ON personal_library_entries FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON personal_library_entries TO authenticated;
