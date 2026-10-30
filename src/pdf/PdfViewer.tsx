import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import * as pdfjsLib from 'pdfjs-dist';
import { usePdfStore } from './usePdfStore';

import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PageContainerProps {
  pdfDoc: any;
  pageNumber: number;
  zoom: number;
  onRendered: (pageNumber: number, height: number) => void;
}

const PageContainer = ({ pdfDoc, pageNumber, zoom, onRendered }: PageContainerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: zoom });
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        setIsRendered(true);
        onRendered(pageNumber, viewport.height);
      } catch (err) {
        console.error(`Error rendering page ${pageNumber}:`, err);
      }
    };

    renderPage();
  }, [pdfDoc, pageNumber, zoom]);

  return (
    <div style={{
      position: 'relative',
      marginBottom: '10px',
      display: 'inline-block',
      boxShadow: '0 0 5px rgba(0,0,0,0.2)',
      backgroundColor: '#fff'
    }}>
      <canvas ref={canvasRef} />
      <Stage
        width={0}
        height={0}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <Layer />
      </Stage>
    </div>
  );
};

export const PdfViewer = ({ docId }: { docId: string }) => {
  const { documents, zoom, setZoom, currentPage, setPage } = usePdfStore();
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageHeights, setPageHeights] = useState<Record<number, number>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const doc = documents.find(d => d.id === docId);

  useEffect(() => {
    if (!doc) return;

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          data: doc.data,
          verbosity: 0
        });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);

        // Update document totalPages in store if needed
        // (Assuming we update usePdfStore.ts to support this)
      } catch (err) {
        console.error('Error loading PDF data:', err);
      }
    };

    loadPdf();
  }, [docId, doc]);

  const handlePageRendered = (pageNumber: number, height: number) => {
    setPageHeights(prev => ({ ...prev, [pageNumber]: height }));
  };

  // Zoom handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1.1 : 0.9;
        setZoom(Math.max(0.1, Math.min(5, zoom * delta)));
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoom, setZoom]);

  return (
    <div
      ref={scrollContainerRef}
      style={{
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#525659',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      {pdfDoc && Array.from({ length: pdfDoc.numPages }, (_, i) => (
        <PageContainer
          key={i}
          pdfDoc={pdfDoc}
          pageNumber={i + 1}
          zoom={zoom}
          onRendered={handlePageRendered}
        />
      ))}
    </div>
  );
};
