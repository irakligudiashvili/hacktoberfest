import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BiomarkerData {
  // CBC
  wbc?: number;
  rbc?: number;
  hemoglobin?: number;
  hematocrit?: number;
  platelets?: number;
  
  // CMP
  glucose?: number;
  creatinine?: number;
  egfr?: number;
  sodium?: number;
  potassium?: number;
  calcium?: number;
  alt?: number;
  albumin?: number;
  
  // Lipid Panel
  totalCholesterol?: number;
  ldl?: number;
  hdl?: number;
  triglycerides?: number;
}

interface BiomarkerStore {
  biomarkerData: BiomarkerData | null;
  setBiomarkerData: (data: BiomarkerData) => void;
  clearBiomarkerData: () => void;
}

export const useBiomarkerStore = create<BiomarkerStore>()(
  persist(
    (set) => ({
      biomarkerData: null,
      setBiomarkerData: (data) => set({ biomarkerData: data }),
      clearBiomarkerData: () => set({ biomarkerData: null }),
    }),
    {
      name: 'biomarker-storage',
    }
  )
);
