import React, { useState } from 'react';
import { usePdfStore } from '../pdf/usePdfStore';
import { PdfViewer } from '../pdf/PdfViewer';

export const Layout = () => {
  const {
    documents,
    activeDocId,
    setActiveDocId,
    addDocument,
    closeDocument
  } = usePdfStore();

  const activeDoc = documents.find(d => d.id === activeDocId);

  const handleOpenFile = async () => {
    const result = await (window as any).electronAPI.openFile();
    if (result) {
      addDocument(result);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '40px 250px 1fr 250px 40px',
      gridTemplateRows: '30px 40px 40px 1fr 200px 30px 25px',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#f0f0f0',
      color: '#333',
      fontFamily: 'sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* Row 1: Menu Bar */}
      <div style={{ gridColumn: '1 / -1', background: '#fff', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '12px', userSelect: 'none' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleOpenFile}>File</div>
          <div style={{ cursor: 'pointer' }}>Edit</div>
          <div style={{ cursor: 'pointer' }}>View</div>
          <div style={{ cursor: 'pointer' }}>Document</div>
          <div style={{ cursor: 'pointer' }}>Tools</div>
          <div style={{ cursor: 'pointer' }}>Help</div>
        </div>
      </div>

      {/* Row 2: Properties Toolbar */}
      <div style={{ gridColumn: '1 / -1', background: '#fafafa', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '12px' }}>
        Properties Toolbar
      </div>

      {/* Row 3: Toolbars Row */}
      <div style={{ gridColumn: '1 / -1', background: '#eee', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '12px' }}>
        Toolbars Row
      </div>

      {/* Row 4: Main Area */}
      <div style={{ gridColumn: '1', background: '#ddd', borderRight: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>L</div>
      <div style={{ gridColumn: '2', background: '#fff', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <div style={{ padding: '10px', fontWeight: 'bold', fontSize: '12px', borderBottom: '1px solid #eee' }}>Thumbnails</div>
        <div style={{ padding: '10px', fontSize: '12px' }}>
          {activeDoc ? `Pages: ${activeDoc.totalPages}` : 'No document open'}
        </div>
      </div>
      <div style={{ gridColumn: '3', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ height: '30px', background: '#eee', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '12px', gap: '5px' }}>
          {documents.map(doc => (
            <div
              key={doc.id}
              style={{
                padding: '2px 10px',
                background: doc.id === activeDocId ? '#fff' : '#ddd',
                border: '1px solid #ccc',
                cursor: 'pointer',
                borderRadius: '3px 3px 0 0',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() => setActiveDocId(doc.id)}
            >
              {doc.name}
              <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={(e) => { e.stopPropagation(); closeDocument(doc.id); }}>×</span>
            </div>
          ))}
        </div>
        <div style={{ height: 'calc(100% - 30px)', width: '100%', overflow: 'hidden' }}>
          {activeDoc ? <PdfViewer docId={activeDoc.id} /> : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#999' }}>
              Open a PDF to start
            </div>
          )}
        </div>
      </div>
      <div style={{ gridColumn: '4', background: '#fff', borderLeft: '1px solid #ccc' }}>Right Panel</div>
      <div style={{ gridColumn: '5', background: '#ddd', borderLeft: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>R</div>

      {/* Row 5: Bottom Panel */}
      <div style={{ gridColumn: '1 / -1', background: '#fff', borderTop: '1px solid #ccc', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '12px' }}>
        Markups List
      </div>

      {/* Row 6: Navigation Bar */}
      <div style={{ gridColumn: '1 / -1', background: '#eee', borderTop: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '12px' }}>
        <button onClick={() => {}}>Prev</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          Page <input type="text" style={{ width: '30px', textAlign: 'center' }} readOnly /> of {activeDoc?.totalPages || 0}
        </div>
        <button onClick={() => {}}>Next</button>
      </div>

      {/* Row 7: Status Bar */}
      <div style={{ gridColumn: '1 / -1', background: '#ddd', borderTop: '1px solid #ccc', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '11px', justifyContent: 'space-between' }}>
        <div>Scale: {activeDoc ? '100%' : 'N/A'} | Coords: 0, 0</div>
        <div>Snap: Off</div>
      </div>
    </div>
  );
};
