type Preliminary = {
  pl_idx?: number;
  p_idx: number;
  w_idx?: number;
  p_serial_no: string;
  p_birthday: string;
  pl_data: PreliminaryData;
};

type PreliminaryData = {
  symptoms: string[];
  pain_degree: string;
  diagnosis: string;
  treatment: string;
  specific: string;
  past_history: string[];
  family_history: string[];
  smoke: string;
  drink: string;
  past_surgeries: string[];
  medical_history: string;
  allergy: string[];
  todoc: string;
};
