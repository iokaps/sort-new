# Changelog

All notable changes to this project will be documented in this file.

## [0.2.3] - 2026-07-28

### Changed

- Bumped the app version from `0.2.2` to `0.2.3` for a Kokimoki redeploy after changelog updates.

## [0.2.2] - 2026-07-28

### Fixed

- Fixed deployed Kokimoki host, player, and presenter links staying on the loading screen.
- Added app bootstrap cleanup for both local `#connecting` and hosted `#km-loading` overlays.
- Added a short-lived observer so late-injected hosted loading overlays are removed during startup.

### Changed

- Bumped the app version from `0.2.1` to `0.2.2` so `kokimoki upload` would accept the redeploy.
- Redeployed the fixed build to Kokimoki.

### Verified

- Ran `npm run build` successfully for version `0.2.2`.
- Uploaded build `6a68a16f52dcbf2815fda41f` with `kokimoki upload`.
- Confirmed deployed host, player, and presenter links render with no `#connecting` or `#km-loading` overlay remaining.
