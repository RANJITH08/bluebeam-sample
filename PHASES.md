# Build phases (do ONE at a time, never start the next without approval)

## Phase 1: Scaffold + viewer
Electron + React + TS + Vite. Install pdfjs-dist, react-konva, konva, pdf-lib,
zustand, lucide-react, vitest. Bundle pdf.js worker locally. Layout shell (menu bar,
toolbars, left/right/bottom panels, doc tabs, status bar). File > Open, render pages,
zoom, Fit Page/Width/Actual Size, continuous scroll. Coordinate helpers in
src/utils/coords.ts with unit tests (store everything in PDF points).

## Phase 2: Basic editing + status bar
Undo/Redo, Select, Pan, Select All, Delete, cursor coordinates, snap toggles,
Save/Save As, multi-document tabs.

## Phase 3: Markup tools
Implement ALL P0 "Markup tools" and "Properties" items. One tool per file in
src/markup/tools/ using a shared Tool interface:
{ id, label, onPointerDown, onPointerMove, onPointerUp, render(markup) }.
Add a Reuse toggle in the status bar. The Properties toolbar changes by selected
markup type (line -> endpoints/style, text -> font, measurement -> units/precision).

## Phase 4: Panels + Markups List
Dockable panels (left/right/bottom): move between regions, hide, auto-hide.
Panels: Thumbnails, Bookmarks, Markups List, Properties, Search, Layers, Flags.
Markups List columns: page, subject, type, author, date, status, comment count.
Sort, filter, status change, replies, row-click-to-jump, CSV export.

## Phase 5: Measurement / takeoff
Implement P1 TAKEOFF. Scale stored per page as unitsPerPdfPoint + unit + precision.
Set Scale: draw a line, enter real distance. Area/Volume support Polygon and Ellipse
Cutouts. Count tool increments a running label. Measurements panel groups totals by Subject and
exports CSV. Unit tests in src/utils/geometry.test.ts for area, perimeter,
angle, radius-from-3-points, scale conversion. Tests must pass.

## Phase 6: Document menu
Implement P2 DOCUMENT using pdf-lib (rotate, insert, extract, split, delete, replace,
crop, labels, headers/footers, flatten). Work on an in-memory copy, and ask before
overwriting. Page-range picker ("1-3,7"). Test each operation on a 5-page sample PDF.

## Phase 7: Tool Chest, Compare, Batch (only after P0 to P2 are ticked)
Implement Tool Chest (JSON tool sets in app data dir), Compare Documents (pixel diff -> cloud
markups), Overlay Pages (two-tone), Batch dialog (Rotate, Flatten, Stamp, Print, Summary
over a folder with a log file).

## Phase 8: Polish + ship
Apply DESIGN.md styling, keyboard shortcuts, grep for http/cdn (must be none),
`npm run dist`, test the .exe offline.
