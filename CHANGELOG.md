# Footage Organiser Changelog

## Unreleased

Feature:

- Inform when a drive format is not compatible with the OS.

- More information to user on which paths cant be found.

Fixes:

- Ignore hidden files and folders on Mac.

- Storing drive format - correcting it for Mac.

## 1.2.0

Fixes:

- Fixed non-existent folder bug to make the Mac version work.

- Fixed the Mac menu bar icon.

- Fixed the Mac opening / closing functionality.

- Add a setDev script to automatically reset the logging to dev mode.

- Removed many unnecessary settings in electron-builder.

- Automatically create action logs directory on program start.

## 1.1.1

Tooling:

- Changed to use pnpm rather than yarn.

Fixes:

- Many dependency bumps (Including zod v4 major bump) - 5 months of updates.

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
