import { BiomarkerData } from "@/store/biomarkerStore";
import { evaluateBiomarker, BiomarkerStatus } from "./biomarkerEvaluation";

export const calculateOverallHealth = (data: BiomarkerData | null): BiomarkerStatus | 'none' => {
  if (!data) return 'none';
  
  const results = Object.entries(data).map(([key, value]) => 
    evaluateBiomarker(key, value, 'CBC')
  ).filter(Boolean);
  
  if (results.length === 0) return 'none';
  
  // If any biomarker is critical, overall health is critical
  const hasCritical = results.some(r => r?.status === 'critical');
  if (hasCritical) return 'critical';
  
  // If any biomarker is suboptimal, overall health is suboptimal
  const hasSuboptimal = results.some(r => r?.status === 'suboptimal');
  if (hasSuboptimal) return 'suboptimal';
  
  // If all biomarkers are optimal
  return 'optimal';
};
