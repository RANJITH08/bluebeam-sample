export interface Coords {
  x: number;
  y: number;
}

/**
 * Transforms PDF points (canonical 72 DPI) to screen pixels.
 * @param pdfPt Point in PDF points.
 * @param zoom Current zoom scale.
 * @param offset Viewport offset (pan).
 */
export function pdfToScreen(pdfPt: Coords, zoom: number, offset: Coords = { x: 0, y: 0 }): Coords {
  return {
    x: pdfPt.x * zoom + offset.x,
    y: pdfPt.y * zoom + offset.y,
  };
}

/**
 * Transforms screen pixels back to PDF points.
 * @param screenPt Point in screen pixels.
 * @param zoom Current zoom scale.
 * @param offset Viewport offset (pan).
 */
export function screenToPdf(screenPt: Coords, zoom: number, offset: Coords = { x: 0, y: 0 }): Coords {
  return {
    x: (screenPt.x - offset.x) / zoom,
    y: (screenPt.y - offset.y) / zoom,
  };
}
