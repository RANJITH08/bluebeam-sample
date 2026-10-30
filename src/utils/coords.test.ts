import { describe, it, expect } from 'vitest';
import { pdfToScreen, screenToPdf } from './coords';

describe('Coordinate Transformations', () => {
  it('should transform PDF points to screen pixels correctly', () => {
    const pdfPt = { x: 100, y: 100 };
    const zoom = 2.0;
    const offset = { x: 10, y: 20 };
    const result = pdfToScreen(pdfPt, zoom, offset);
    expect(result).toEqual({ x: 210, y: 220 });
  });

  it('should transform screen pixels back to PDF points correctly', () => {
    const screenPt = { x: 210, y: 220 };
    const zoom = 2.0;
    const offset = { x: 10, y: 20 };
    const result = screenToPdf(screenPt, zoom, offset);
    expect(result).toEqual({ x: 100, y: 100 });
  });

  it('should handle zero offset', () => {
    const pdfPt = { x: 50, y: 50 };
    const zoom = 1.0;
    const result = pdfToScreen(pdfPt, zoom);
    expect(result).toEqual({ x: 50, y: 50 });
  });
});
