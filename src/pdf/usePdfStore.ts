import { create } from 'zustand';

interface Document {
  id: string;
  name: string;
  path: string;
  data: Uint8Array;
  totalPages: number;
}

interface PdfState {
  documents: Document[];
  activeDocId: string | null;
  zoom: number;
  currentPage: number;

  setActiveDocId: (id: string) => void;
  addDocument: (docData: { path: string, data: Uint8Array, name: string }) => void;
  closeDocument: (id: string) => void;
  setZoom: (zoom: number) => void;
  setPage: (page: number) => void;
}

export const usePdfStore = create<PdfState>((set) => ({
  documents: [],
  activeDocId: null,
  zoom: 1.0,
  currentPage: 1,

  setActiveDocId: (id) => set({ activeDocId: id }),

  addDocument: (docData) => set((state) => {
    const id = Math.random().toString(36).substr(2, 9);
    // Note: totalPages will be set by the viewer once pdf.js loads it
    const newDoc = { ...docData, id, totalPages: 0 };
    const updatedDocs = [...state.documents, newDoc];
    return {
      documents: updatedDocs,
      activeDocId: id
    };
  }),

  closeDocument: (id) => set((state) => {
    const updatedDocs = state.documents.filter(d => d.id !== id);
    let newActiveId = state.activeDocId;
    if (state.activeDocId === id) {
      newActiveId = updatedDocs.length > 0 ? updatedDocs[0].id : null;
    }
    return {
      documents: updatedDocs,
      activeDocId: newActiveId
    };
  }),

  setZoom: (zoom) => set({ zoom }),
  setPage: (page) => set({ currentPage: page }),
}));
