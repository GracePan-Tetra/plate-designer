import type { Condition, Modality } from '../types';

export const MODALITIES: Modality[] = [
  {
    id: '96-well-scale',
    name: '96 Well Scale',
    conditions: [
      { id: 'fc-001', name: 'Untreated',   factor1: 'Control',    factor2: '0 nM',    factor3: 'DMSO' },
      { id: 'fc-002', name: 'DMSO',        factor1: 'Vehicle',    factor2: '0.1%',    factor3: 'DMSO' },
      { id: 'fc-003', name: 'Compound A',  factor1: 'Inhibitor',  factor2: '10 nM',   factor3: 'DMSO' },
      { id: 'fc-004', name: 'Compound B',  factor1: 'Inhibitor',  factor2: '100 nM',  factor3: 'DMSO' },
      { id: 'fc-005', name: 'Compound C',  factor1: 'Activator',  factor2: '10 nM',   factor3: 'PBS'  },
      { id: 'fc-006', name: 'Compound D',  factor1: 'Activator',  factor2: '100 nM',  factor3: 'PBS'  },
      { id: 'fc-007', name: 'Compound E',  factor1: 'Inhibitor',  factor2: '1 µM',    factor3: 'PBS'  },
      { id: 'fc-008', name: 'Compound F',  factor1: 'Activator',  factor2: '1 µM',    factor3: 'PBS'  },
      { id: 'fc-009', name: 'Staurosporin',factor1: 'Positive',   factor2: '1 µM',    factor3: 'DMSO' },
      { id: 'fc-010', name: 'LPS',         factor1: 'Cytokine',   factor2: '1 µg/mL', factor3: 'PBS'  },
      { id: 'fc-011', name: 'IL-6',        factor1: 'Cytokine',   factor2: '10 ng/mL',factor3: 'PBS'  },
      { id: 'fc-012', name: 'TNF-α',       factor1: 'Cytokine',   factor2: '50 ng/mL',factor3: 'PBS'  },
    ],
  },
  {
    id: 'robocolumn',
    name: 'Robocolumn',
    conditions: [
      { id: 'el-001', name: 'Ab 1:100',    factor1: 'Primary Ab', factor2: '1:100',   factor3: 'BSA'  },
      { id: 'el-002', name: 'Ab 1:500',    factor1: 'Primary Ab', factor2: '1:500',   factor3: 'BSA'  },
      { id: 'el-003', name: 'Ab 1:1000',   factor1: 'Primary Ab', factor2: '1:1000',  factor3: 'BSA'  },
      { id: 'el-004', name: 'Ab 1:2000',   factor1: 'Primary Ab', factor2: '1:2000',  factor3: 'BSA'  },
      { id: 'el-005', name: 'Ab 1:5000',   factor1: 'Primary Ab', factor2: '1:5000',  factor3: 'BSA'  },
      { id: 'el-006', name: 'No Primary',  factor1: 'Control',    factor2: 'None',    factor3: 'BSA'  },
      { id: 'el-007', name: 'Pos Control', factor1: 'Positive',   factor2: '1:100',   factor3: 'BSA'  },
      { id: 'el-008', name: 'Neg Control', factor1: 'Negative',   factor2: 'None',    factor3: 'BSA'  },
      { id: 'el-009', name: 'Standard 1',  factor1: 'Standard',   factor2: '1000 pg/mL', factor3: 'PBS' },
      { id: 'el-010', name: 'Standard 2',  factor1: 'Standard',   factor2: '500 pg/mL',  factor3: 'PBS' },
      { id: 'el-011', name: 'Standard 3',  factor1: 'Standard',   factor2: '250 pg/mL',  factor3: 'PBS' },
      { id: 'el-012', name: 'Standard 4',  factor1: 'Standard',   factor2: '125 pg/mL',  factor3: 'PBS' },
    ],
  },
  {
    id: 'akta',
    name: 'AKTA',
    conditions: [
      { id: 'wb-001', name: 'Lysate A',    factor1: 'Cell Line',  factor2: 'HEK293',  factor3: '20 µg' },
      { id: 'wb-002', name: 'Lysate B',    factor1: 'Cell Line',  factor2: 'HeLa',    factor3: '20 µg' },
      { id: 'wb-003', name: 'Lysate C',    factor1: 'Cell Line',  factor2: 'Jurkat',  factor3: '20 µg' },
      { id: 'wb-004', name: 'Treated A',   factor1: 'Treatment',  factor2: 'Drug X',  factor3: '50 nM' },
      { id: 'wb-005', name: 'Treated B',   factor1: 'Treatment',  factor2: 'Drug Y',  factor3: '50 nM' },
      { id: 'wb-006', name: 'Vehicle',     factor1: 'Control',    factor2: 'DMSO',    factor3: '0.1%'  },
    ],
  },
];

export const ALL_CONDITIONS: Condition[] = MODALITIES.flatMap((m) => m.conditions);
