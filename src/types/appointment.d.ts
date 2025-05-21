type AppintmentNameInfo = {
  p_name_kor: string;
  p_name_eng: string;
  nurse1_name_kor: string;
  nurse1_name_eng: string;
  nurse2_name_kor: string;
  nurse2_name_eng: string;
  doctor1_name_kor: string;
  doctor1_name_eng: string;
  doctor2_name_kor: string;
  doctor2_name_eng: string;
  ca_doctor_name_kor: string;
  ca_doctor_name_eng: string;
};

type Appointment = Diagnosis & AppintmentNameInfo;
