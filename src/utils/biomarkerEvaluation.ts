export type BiomarkerStatus = 'optimal' | 'suboptimal' | 'critical';

export interface BiomarkerResult {
  name: string;
  value: number;
  unit: string;
  status: BiomarkerStatus;
  range: string;
  category: 'CBC' | 'CMP' | 'Lipid Panel';
}

export const evaluateBiomarker = (
  name: string,
  value: number | undefined,
  category: 'CBC' | 'CMP' | 'Lipid Panel'
): BiomarkerResult | null => {
  if (value === undefined || value === null || isNaN(value)) return null;

  const evaluations: Record<string, any> = {
    wbc: {
      name: 'WBC',
      unit: '×10⁹/L',
      range: '4.0-8.0',
      optimal: (v: number) => v >= 4.0 && v <= 8.0,
      suboptimal: (v: number) => (v >= 3.0 && v < 4.0) || (v > 8.0 && v <= 10.0),
      category: 'CBC'
    },
    rbc: {
      name: 'RBC',
      unit: '×10¹²/L',
      range: '4.2-5.5',
      optimal: (v: number) => v >= 4.2 && v <= 5.5,
      suboptimal: (v: number) => (v >= 3.8 && v < 4.2) || (v > 5.5 && v <= 6.0),
      category: 'CBC'
    },
    hemoglobin: {
      name: 'Hemoglobin',
      unit: 'g/dL',
      range: '12-16.5',
      optimal: (v: number) => v >= 12 && v <= 16.5,
      suboptimal: (v: number) => (v >= 11 && v < 12) || (v > 16.5 && v <= 18),
      category: 'CBC'
    },
    hematocrit: {
      name: 'Hematocrit',
      unit: '%',
      range: '36-50',
      optimal: (v: number) => v >= 36 && v <= 50,
      suboptimal: (v: number) => (v >= 30 && v < 36) || (v > 50 && v <= 55),
      category: 'CBC'
    },
    platelets: {
      name: 'Platelets',
      unit: '×10⁹/L',
      range: '150-350',
      optimal: (v: number) => v >= 150 && v <= 350,
      suboptimal: (v: number) => (v >= 120 && v < 150) || (v > 350 && v <= 450),
      category: 'CBC'
    },
    glucose: {
      name: 'Glucose (fasting)',
      unit: 'mg/dL',
      range: '75-90',
      optimal: (v: number) => v >= 75 && v <= 90,
      suboptimal: (v: number) => (v >= 65 && v < 75) || (v > 90 && v < 100),
      category: 'CMP'
    },
    creatinine: {
      name: 'Creatinine',
      unit: 'mg/dL',
      range: '0.6-1.1',
      optimal: (v: number) => v >= 0.6 && v <= 1.1,
      suboptimal: (v: number) => v > 1.1 && v <= 1.3,
      category: 'CMP'
    },
    egfr: {
      name: 'eGFR',
      unit: 'mL/min',
      range: '>90',
      optimal: (v: number) => v > 90,
      suboptimal: (v: number) => v >= 60 && v <= 90,
      category: 'CMP'
    },
    sodium: {
      name: 'Sodium',
      unit: 'mmol/L',
      range: '137-142',
      optimal: (v: number) => v >= 137 && v <= 142,
      suboptimal: (v: number) => (v >= 133 && v < 137) || (v > 142 && v <= 145),
      category: 'CMP'
    },
    potassium: {
      name: 'Potassium',
      unit: 'mmol/L',
      range: '4.0-4.8',
      optimal: (v: number) => v >= 4.0 && v <= 4.8,
      suboptimal: (v: number) => (v >= 3.6 && v < 4.0) || (v > 4.8 && v <= 5.1),
      category: 'CMP'
    },
    calcium: {
      name: 'Calcium',
      unit: 'mg/dL',
      range: '9.2-10.0',
      optimal: (v: number) => v >= 9.2 && v <= 10.0,
      suboptimal: (v: number) => (v >= 8.8 && v < 9.2) || (v > 10.0 && v <= 10.4),
      category: 'CMP'
    },
    alt: {
      name: 'ALT',
      unit: 'U/L',
      range: '<25',
      optimal: (v: number) => v < 25,
      suboptimal: (v: number) => v >= 25 && v <= 40,
      category: 'CMP'
    },
    albumin: {
      name: 'Albumin',
      unit: 'g/dL',
      range: '4.2-5.0',
      optimal: (v: number) => v >= 4.2 && v <= 5.0,
      suboptimal: (v: number) => v >= 3.8 && v < 4.2,
      category: 'CMP'
    },
    totalCholesterol: {
      name: 'Total Cholesterol',
      unit: 'mg/dL',
      range: '150-180',
      optimal: (v: number) => v >= 150 && v <= 180,
      suboptimal: (v: number) => v > 180 && v < 200,
      category: 'Lipid Panel'
    },
    ldl: {
      name: 'LDL',
      unit: 'mg/dL',
      range: '<100',
      optimal: (v: number) => v < 100,
      suboptimal: (v: number) => v >= 100 && v < 130,
      category: 'Lipid Panel'
    },
    hdl: {
      name: 'HDL',
      unit: 'mg/dL',
      range: '>60',
      optimal: (v: number) => v > 60,
      suboptimal: (v: number) => v >= 45 && v <= 60,
      category: 'Lipid Panel'
    },
    triglycerides: {
      name: 'Triglycerides',
      unit: 'mg/dL',
      range: '<90',
      optimal: (v: number) => v < 90,
      suboptimal: (v: number) => v >= 90 && v <= 130,
      category: 'Lipid Panel'
    },
  };

  const config = evaluations[name];
  if (!config) return null;

  let status: BiomarkerStatus = 'critical';
  if (config.optimal(value)) {
    status = 'optimal';
  } else if (config.suboptimal(value)) {
    status = 'suboptimal';
  }

  return {
    name: config.name,
    value,
    unit: config.unit,
    status,
    range: config.range,
    category: config.category,
  };
};
