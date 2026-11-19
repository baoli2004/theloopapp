# Project memory

## Product intent & audience

- The Loop: React web app converting to a native Android app via Capacitor
- Audience: junior high school students
- Goal: break infinite scrolling habits through intentional friction and peer accountability
- Phase 1 scope: Capacitor wrapper setup only; no native features, auth, or DB migrations yet

## Brand personality & voice

- Supportive and purposeful — emphasizes mindful intervention over punitive blocking
- Tone fits a younger teen audience; designed to feel approachable, not clinical

## Visual design & UX direction

- Existing UI is production-worthy with animations and interactions across 30+ source files — must not be redesigned or rewritten
- Web build produces ~30 KB CSS and ~453 KB JS (134 KB gzipped)
- App relies on localStorage for persistence; this must remain intact

## Decisions, constraints & rationale

- Capacitor 6.2.3 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`) chosen for compatibility with existing Node/Vite toolchain
- App name: `THE LOOP`; App ID: `com.theloop.app`; webDir: `dist`
- `capacitor.config.ts` created at project root; Android platform generated via `npx cap add android` + `npx cap sync android`
- No existing source files, components, styles, or Vite config were modified during Phase 1
- No APK/AAB built — requires Android SDK + Gradle; intentionally out of scope

## Open questions & assumptions

- Future phases planned: native usage-stats reading, app blocking, local notifications
- Auth and database migrations deferred to later phases
- npm audit vulnerabilities (25) are pre-existing from starter template transitive deps; not addressed yet
- Android SDK / Android Studio availability on the build machine not yet confirmed