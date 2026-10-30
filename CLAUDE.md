# OpenMark – offline PDF markup & takeoff app (Windows .exe)
Stack Electron + React + TypeScript + Vite + pdfjs-dist + react-konva + pdf-lib + zustand.
Goal all features unlocked, no login/licensing/network at runtime, ships as .exe.

## Working rules
1. 1. Read FEATURES.md, PHASES.md, and PROGRESS.md at the start of every session.
   Work only on the phase PROGRESS.md says is next.
2. Work on ONE phase at a time. Don't start the next until I say so.
3. After each change run `npm run build` and `npm test`. Fix errors before reporting.
4. Keep files  250 lines, one responsibility each, comments explaining WHY.
5. Never invent library APIs. If unsure, check node_modules typings or docs first.
6. Update FEATURES.md checkboxes and PROGRESS.md after each step, then `git commit`.
7. No third-party branding, icons, or stamps. Use Lucide icons and original names.
8. No CDNnetwork assets. Bundle pdf.js worker, fonts, and icons locally.

## Layout (implement as regions, own styling)
Menu bar - Properties toolbar (context-sensitive) - Toolbars row -
[left panel access bar  left panel  MAIN WORKSPACE with doc tabs 
right panel  right access bar] - bottom panel (Markups List) - navigation
bar - status bar (page, scale, cursor, snap toggles).
Panels are dockable left/right/bottom, hideable, auto-hide.

## Architecture
src/app, src/pdf, src/markup (types, store, tools), src/measure,
src/panels, src/document (pdf-lib ops), src/export, src/utils.
