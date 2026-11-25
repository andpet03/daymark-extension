# Publication audit — Daymark

Date: 25 November 2026. Scope: local version 0.1.1 source and documentation package intended for https://github.com/andpet03/daymark-extension.

## Method and boundaries

Read-only review phases inspected source/configuration, test definitions, file inventory, exclusion rules, README and linked evidence. Static inspection scripts read files and checked references; they did not import or execute project code. No extension, tests, server, database operation, commit or push was run during this audit. Documentation corrections and packaging were separate authorised preparation steps, followed by a static recheck.

The local folder is not a Git checkout: `git status` reported that no repository was present. Tracked files, ignored-file behaviour against a real index, branches, remote commits and Git history could not be inspected. The GitHub URL could not be fetched from this environment. This report does not certify the remote repository or its final upload.

## Checks

- Reviewed manifest permissions, CSP, worker message routing, blocking rules, local storage, audio implementation, task handling, image uploads, music URL validation and backup import/export.
- Inspected tests as source only. Historical development result: nine Node tests passed; these were not rerun during the audit.
- Inspected source/configuration and searched for common private-key and credential patterns. No real credentials were identified. Test strings such as a sample URL containing `user:pass` are validation fixtures, not service credentials.
- No `.env`, private backup JSON, dependency folder, browser profile, user database or runtime cache is included. Runtime user state lives in Chrome storage, outside the repository.
- `.gitignore` excludes environment files, dependencies, logs, coverage and default-named Daymark backups. Renamed private backups still require deliberate exclusion; browser uploads do not automatically enforce Git ignore rules.
- User-entered task text is rendered using `textContent`; music links are restricted to HTTPS Spotify/Apple Music hosts. Scripts are local. Optional remote landscape images and their privacy implications are documented.
- README covers purpose, collection, persistence, interaction, installation, development lessons, limitations and AI assistance. Local Markdown/image references were checked after the report was added.
- Ten owner-supplied screenshots document the interface and backup check. They contain demonstration tasks, an example blocked domain and a first name, supplied for README use. No credentials or private JSON backups are included.

## Confirmed findings and resolution

| ID | Finding | Resolution |
| --- | --- | --- |
| D01 — low | `README.md` and `docs/TESTING.md` still described browser checks and screenshot evidence as wholly pending despite later owner confirmations. | Updated the status, separated owner-reported checks from automated tests, added screenshots and retained a specific list of unverified browser scenarios. Static recheck completed. |
| D02 — low | README installation assumed the extracted directory was always named `daymark`, which would confuse users downloading `daymark-extension-main` from GitHub. | Installation now identifies the directory by `manifest.json`, lists both possible names, and explains why the picker shows only folders. Static recheck completed. |
| D03 — low | No repository audit record was present. | Added this sanitised report after the read-only review. The initially unresolved README link to this report was checked again after creation. |

No confirmed credential leak or unresolved publication-blocking issue was identified in this local package. This is not proof of safety or a complete security assessment.

## Remaining limitations and recommended improvements

1. **Broader browser checks:** restart recovery, optional handling of existing tabs, automatic audio stop at expiry, every photo preset, scene round trips, music links and keyboard/zoom coverage are not independently established. Follow `docs/TESTING.md` and record actual results rather than extrapolating from screenshots.
2. **Concurrent edits:** whole-list settings patches can overwrite simultaneous edits in another dashboard. Use one editing tab for now; future work should use item-level operations or revisions.
3. **Import robustness:** `core.js` bounds and validates important values, but malformed nested backup entries can produce a generic caught error and duplicate imported task IDs are not rejected. Add stricter structure/uniqueness checks and adversarial import tests in future. No backup content is executed as code.
4. **Attribution:** landscape provider URLs and the Unsplash licence are recorded, but specific photographer identities/original photo pages remain unverified. Add verified credits when available; do not guess. No downloaded landscape files are bundled.
5. **Blocking scope:** top-level network navigation blocking is a voluntary aid, not a security boundary. Cached content, other profiles/browsers and already-loaded pages have limitations documented in the README.
6. **Readable source:** several source files contain long compact lines. Reformatting would improve future review and maintenance; runtime behaviour was left unchanged during this documentation update.
7. **Repository verification:** after upload, check root paths, the rendered README/images and public accessibility while logged out. Review tracked files and Git history when a checkout is available. Do not upload personal backup files.

## Evidence and follow-through

The earlier Add task overflow and unclear task workflow were corrected in v0.1.1 before this audit. The owner confirmed the improvement and supplied screenshots. Later confirmations covered ending focus early, natural expiry, sound continuity and stopping, persistence, and backup restoration. The before/after backup screenshots show the temporary task disappearing while original tasks remain. These are owner reports; audio and persistence cannot be proven by a still screenshot alone.

The publication preparation changes documentation and adds screenshots/report only. Source and manifest remain identical to the previously delivered v0.1.1 package. Static recheck verifies source equality, document/image links, inventory and selected credential patterns. No commits or push were performed. A separate course audit-evidence PDF remains to be prepared for submission.
