# Footage Organiser Changelog

## Unreleased

## 1.1.1

Tooling:

- Changed to use pnpm rather than yarn.

Fixes:

- Many dependency bumps (Including zod v4 major bump).

## 1.1.0

Features:

- Automatically reevaluates when connected drives change.

Fixes:

- Constant checking of drives. (Startup goes from 11 seconds to 1 second)

- No more annoying upcoming rules / lying about current state. Now using a method of awaiting changes and greying out buttons when awaitng changes.

- Crashing when execution fails - Awaits the execution failure handler now

## 1.0.0

Features:

- Copy File rules (With customisable target sub-path and other paths to delete).

- Mirror rules (With ability to delete under target path).

- Filters for copying and deleteing files / folders.

- Modifiable settings.

- Logs of all executed actions
