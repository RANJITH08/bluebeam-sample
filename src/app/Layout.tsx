import React, { useState, useEffect, useRef } from 'react';
import { usePdfStore } from '../pdf/usePdfStore';
import { PdfViewer } from '../pdf/PdfViewer';
import {
  FolderOpen,
  ZoomIn,
  ZoomOut,
  Square,
  FileText,
} from 'lucide-react';

const Dropdown = ({ label, items }: { label: string, items: { label: string, onClick?: () => void, disabled?: boolean }[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', padding: '0 10px', fontSize: '12px' }}
      >
        {label}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
            minWidth: '150px',
            padding: '5px 0'
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => { item.onClick?.(); setIsOpen(false); }}
              style={{
                padding: '5px 15px',
                fontSize: '12px',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                color: item.disabled ? '#999' : '#333',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => !item.disabled && (e.currentTarget.style.backgroundColor = '#eee')}
              onMouseLeave={(e) => !item.disabled && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Layout = () => {
  const {
    documents,
    activeDocId,
    setActiveDocId,
    addDocument,
    closeDocument,
    zoom,
    setZoom
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
        <div style={{ display: 'flex', gap: '0px' }}>
          <Dropdown
            label="File"
            items={[
              { label: 'Open (Ctrl+O)', onClick: handleOpenFile },
              { label: 'Close Tab', onClick: () => activeDocId && closeDocument(activeDocId) },
              { label: 'Exit', onClick: () => window.close() },
            ]}
          />
          <Dropdown
            label="Edit"
            items={[{ label: 'Coming soon...', disabled: true }]}
          />
          <Dropdown
            label="View"
            items={[
              { label: 'Zoom In', onClick: () => setZoom(zoom * 1.2) },
              { label: 'Zoom Out', onClick: () => setZoom(zoom / 1.2) },
              { label: 'Fit Page', onClick: () => setZoom(0.5) },
              { label: 'Fit Width', onClick: () => setZoom(1.0) },
              { label: 'Actual Size', onClick: () => setZoom(1.0) },
            ]}
          />
          <Dropdown
            label="Document"
            items={[{ label: 'Coming soon...', disabled: true }]}
          />
          <Dropdown
            label="Tools"
            items={[{ label: 'Coming soon...', disabled: true }]}
          />
          <Dropdown
            label="Help"
            items={[{ label: 'Coming soon...', disabled: true }]}
          />
        </div>
      </div>

      {/* Row 2: Properties Toolbar */}
      <div style={{ gridColumn: '1 / -1', background: '#fafafa', borderBottom: '1px solid #ccc', height: '40px' }}>
      </div>

      {/* Row 3: Toolbars Row */}
      <div style={{ gridColumn: '1 / -1', background: '#eee', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', padding: '0 10px', gap: '10px', fontSize: '12px' }}>
        <button onClick={handleOpenFile} title="Open" style={{ padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <FolderOpen size={16} />
        </button>
        <div style={{ width: '1px', height: '20px', background: '#ccc', margin: '0 5px' }} />
        <button onClick={() => setZoom(zoom - 0.1)} title="Zoom Out" style={{ padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ZoomOut size={16} />
        </button>
        <button onClick={() => setZoom(zoom + 0.1)} title="Zoom In" style={{ padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ZoomIn size={16} />
        </button>
        <button onClick={() => setZoom(0.5)} title="Fit Page" style={{ padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <FileText size={16} />
        </button>
        <button onClick={() => setZoom(1.0)} title="Fit Width" style={{ padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Square size={16} />
        </button>
        <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>Zoom:</span>
          <span>{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Row 4: Main Area */}
      <div style={{ gridColumn: '1', background: '#ddd', borderRight: '1px solid #ccc' }}></div>
      <div style={{ gridColumn: '2', background: '#fff', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <div style={{ padding: '10px', fontWeight: 'bold', fontSize: '12px', borderBottom: '1px solid #eee', background: '#f8f8f8' }}>Thumbnails</div>
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeDoc ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Array.from({ length: activeDoc.totalPages || 0 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: '100px',
                    height: '140px',
                    background: '#eee',
                    border: '1px solid #ccc',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}
                  onClick={() => {}}
                >
                  Page {i + 1}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#999', fontSize: '12px' }}>No document open</div>
          )}
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
                gap: '5px',
                borderBottom: 'none'
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
            <div
              onClick={handleOpenFile}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                color: '#666',
                cursor: 'pointer',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <FolderOpen size={48} color="#ccc" />
              <span style={{ fontSize: '18px' }}>Open PDF to start</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ gridColumn: '4', background: '#fff', borderLeft: '1px solid #ccc' }}></div>
      <div style={{ gridColumn: '5', background: '#ddd', borderLeft: '1px solid #ccc' }}></div>

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
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>Page {activeDoc ? '1' : 'N/A'} of {activeDoc?.totalPages || 0}</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Coords: 0, 0</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>Snap: Off</span>
        </div>
      </div>
    </div>
  );
};
