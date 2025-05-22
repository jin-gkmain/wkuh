const lang = {
  // 공용
  COUNTRY_KOREA: 'Korea',
  COUNTRY_MONGOLIA: 'Mongolia',
  ATTACHED_FILE: 'Attachments',
  ATTACHED_FILE_PLACEHOLDER:
    'Add file or drag here (20MB or less, maximum 10, jpg, png, gif, pdf, xls, ppt, hwp, doc, zuo)',
  ATTACHED_FILE_PLACEHOLDER2: 'Attach files',
  SEARCH_INPUT_PLACEHOLDER: 'Click the search button to select a manager',
  SEARCH_INPUT_BUTTON: 'Search',

  // drop down menu ( 수정, 삭제 )
  DROP_EDIT_TEXT: 'Manage',
  DROP_REMOVE_TEXT: 'Delete',
  DROP_DISABELD_TEXT: 'Disabled',
  DROP_ACTIVATE_TEXT: 'Activate',

  // search frame text
  REFRESH_BUTTON_TEXT: 'Refresh',
  SEARCH_BUTTON_TEXT: 'Search',

  // 추가 버튼
  ADD_ORG_BUTTON_TEXT: 'Add Organization',
  ADD_USER_BUTTON_TEXT: 'Add User',
  ADD_PATIENT_BUTTON_TEXT: 'Add Patient',
  ADD_CHART_BUTTON_TEXT: 'Add Chart',
  ADD_VIDEO_BUTTON_TEXT: 'Add Video Info',
  OPEN_CALENDAR_BUTTON_TEXT: 'Open Calendar',
  ADD_NOTICE_BUTTON_TEXT: 'Add Notice',

  // 로그인, 비밀번호 재설정, 비밀번호 찾기
  LOGIN_TITLE_TEXT: 'Login to Teleconsultation Services',
  LOGIN_EMAIL_LABLE_TEXT: 'Email address',
  LOGIN_PASSWORD_LABLE_TEXT: 'Password',
  LOGIN_BUTTON_TEXT: 'Login',
  LOGIN_FORGET_PASSWORD_TEXT: 'Forgot your password?',

  LOGIN_FIND_PSW_TITLE_TEXT: 'Find password',
  LOGIN_FIND_PSW_BUTTON_TEXT: 'Send password reset email',
  LOGIN_RETURN_LOGIN_TEXT: 'Back to login',

  LOGIN_CHECK_EMAIL_TITLE_TEXT: 'Please check your email',
  LOGIN_CHECK_EMAIL_DESC_TEXT1: 'Your password reset email has been sent to',
  LOGIN_CHECK_EMAIL_DESC_TEXT2: '',
  LOGIN_SEND_AGAIN_BUTTON_TEXT: 'Resend email',

  LOGIN_RESET_PSW_TITLE_TEXT: 'Enter new password',
  LOGIN_NEW_PSW_LABEL_TEXT: 'Please enter your new password',
  LOGIN_CP_RESET_PSW_BUTTON_TEXT: 'Complete password reset',
  LOGIN_FAIL_ALERT_TEXT: 'Please check your Email or password.',

  // Layout
  DROP_EDIT_PSW_TEXT: 'Change Pwd',
  DROP_LOGOUT_TEXT: 'Lougout',
  LAYOUT_MENU_1: 'Home',
  LAYOUT_MENU_2: 'Workflow',
  LAYOUT_MENU_3: 'Appointments',
  LAYOUT_MENU_4: 'Organizations',
  LAYOUT_MENU_5: 'Notice',

  // Nav
  NAV_PROFILE_DROP_TEXT: 'Profile',

  // 비밀번호 수정 모달
  EDIT_PSW_MODAL_TITLE: 'Change Password',
  EDIT_PSW_MODAL_EMAIL_LABEL_TEXT: 'Email address (ID)',
  EDIT_PSW_MODAL_NEW_PSW_TEXT: 'New password',
  EDIT_PSW_MODAL_CHECK_PSW_LABEL_TEXT: 'Confirm new password',
  EDIT_PSW_MODAL_PSW_CONSTRAINT_LABEL_TEXT: 'Only english letters and numbers',
  EDIT_PSW_MODAL_COMPLETE_BUTTON_TEXT: 'Change password',

  // 모달  버튼
  MODAL_COMPLETE_BUTTON_TEXT: '완료',
  MODAL_MANAGE_COMPLETE_BUTTON_TEXT: 'Save',
  MODAL_CANCEL_BUTTON_TEXT: 'Cancel',
  MODAL_CLOSE_BUTTON_TEXT: 'Close',
  MODAL_DELETE_BUTTON_TEXT: 'Delete',
  MODAL_CONFIRM_BUTTON_TEXT: 'Send',
  MODAL_DOWNLOAD_BUTTON_TEXT: 'Download',
  MODAL_COMPLETE_BUTTON_TEXT: 'Complete',
  MODAL_DISABLED_BUTTON_TEXT: 'Disabled',
  MODAL_ACTIVATE_BUTTON_TEXT: 'Activate',
  MODAL_LOGOUT_BUTTON_TEXT: 'Logout',

  // 기관목록
  ORG_ORG_NUMBER_TEXT: 'Organizations',
  ORG_USER_NUMBER_TEXT: 'Users',
  ORG_PATIENT_NUMBER_TEXT: 'Patients',
  ORG_COMPLETED_TELECONSULTING_NUMBER_TEXT: 'Teleconsultations',
  ORG_COMPLETED_VISIT_NUMBER_TEXT: 'Visits',
  ORG_CONTRACT_DURATION_TEXT: 'Contract term',
  ORG_ORG_CODE_TEXT: 'Org code',
  ORG_ORG_COUNTRY_TEXT: 'Country',
  ORG_ORG_NAME_TEXT: 'Org Name',
  ORG_CONTACT_EMAIL_TEXT: 'Representative email',
  ORG_TABLE_ROW_BUTTON: 'User list',
  ORG_QR_CODE_TEXT: 'QR code',

  // 기관 등록, 수정 모달
  ORG_MODAL_NEW_TITLE_TEXT: 'Add Organization',
  ORG_MODAL_MANAGE_TITLE_TEXT: 'Edit Organization information',
  ORG_MODAL_ORG_NAME_KO_TEXT: 'Organization Name (National language)',
  ORG_MODAL_ORG_NAME_EN_TEXT: 'Organization Name (English)',
  ORG_MODAL_ORG_CONTACT_EMAIL_TEXT: 'Representative email',
  ORG_MODAL_ORG_CONTACT_TEL_TEXT: 'Representative Phone number',
  ORG_MODAL_DOMAIN_FOR_MAIL: 'Representative domain',
  ORG_MODAL_ORG_CODE_TEXT: 'Organization code',
  ORG_MODAL_MANAGER_TEXT: ' Manager',
  ORG_MODAL_MEMO_TEXT: 'Note',
  ORG_MODAL_ATTACH_CONTRACT_FILE: 'Attach contract file',
  ORG_MODAL_COMPLETE_BUTTON_TEXT: 'Add Organization',

  // 사용자목록
  USER_ORG_NAME: 'Organization',
  USER_CODE_TEXT: 'User No.',
  USER_NAME_TEXT: 'Name',
  USER_PERMISSION_TEXT: 'Permissions',
  USER_JOB_TEXT: 'Jobs',
  USER_EMAIL_TEXT: 'Email (ID)',
  USER_TEL_TEXT: 'Phone Number',
  USER_REGIST_DATE_TEXT: 'Created on',
  USER_TABLE_ROW_BUTTON_TEXT: 'Manage',

  // 사용자 등록, 수정 모달
  USER_MODAL_NEW_TITLE_TEXT: 'Add User',
  USER_MODAL_MANAGE_TITLE_TEXT: 'Edit User information',
  USER_MODAL_USER_NAME_KO_TEXT: 'User Name (National language)',
  USER_MODAL_USER_NAME_EN_TEXT: 'User Name (English)',
  USER_MODAL_USER_JOB1: 'nurse',
  USER_MODAL_USER_JOB2: 'doctor',
  USER_MODAL_USER_JOB3: 'interpreter',
  USER_MODAL_USER_JOB4: 'etc',
  USER_MODAL_USER_JOB5: 'patient',
  USER_MODAL_USER_JOB6: 'admin',
  USER_MODAL_USER_PERMISSION1: 'admin',
  USER_MODAL_USER_PERMISSION2: 'general',
  USER_MODAL_COMPLETE_BUTTON_TEXT: 'Add User',

  // 담당자 선택 모달
  SEARCH_MANAGER_MODAL_TITLE_TEXT: 'Select Manager',
  SEARCH_MANAGER_MODAL_SELECT_BUTTON: 'Select',
  SEARCH_MANAGER_ORGANIZATION: 'Organization',
  SEARCH_MANAGER_USER_NAME: 'User Name',

  // 환자목록
  PATIENT_SEARCH_PT_NAME_TEXT: 'Name',
  PATIENT_SEARCH_NURSE: 'Nurse',
  PATIENT_CODE_TEXT: 'Patient No.',
  PATIENT_NAME_TEXT: 'Name',
  PATIENT_TEL_TEXT: 'Phone Number',
  PATIENT_ADDRESS_TEXT: 'Home Address',
  PATIENT_NURSE_IN_CHARGE_TEXT: 'Charge Nurse',
  PATIENT_REGIST_DATE_TEXT: 'Created on',
  PATIENT_CHART_LIST_TEXT: 'Chart list',

  // 환자 등록, 수정 모달
  PATIENT_MODAL_NEW_TITLE_TEXT: 'Add Patient',
  PATIENT_MODAL_MANAGE_TITLE_TEXT: 'Edit Patient information',
  PATIENT_MODAL_PATIENT_NAME_KO: 'Patient Name (National language)',
  PATIENT_MODAL_PATIENT_NAME_EN: 'Patient Name (English)',
  PATIENT_MODAL_SEX_TEXT: 'Gender',
  PATIENT_MODAL_BIRTH_TEXT: 'Birth Date (YYYY-MM-DD)',
  PATIENT_MODAL_WEIGHT_TEXT: 'Weight(kg)',
  PATIENT_MODAL_TALL_TEXT: 'Height(cm)',
  PATIENT_MODAL_VISIT_PATHS_TEXT: 'Visit Paths',
  PATIENT_MODAL_P_EMAIL_TEXT: 'Email address',
  PATIENT_MODAL_NURSE_IN_CHARGE_TEXT: 'Charge Nurse',
  PATIENT_MODAL_SELECT_NURSE_INPUT_PLACEHOLDER:
    'Click the Search button to select a charge nurse',
  PATIENT_MODAL_SERIAL_NUMBER_TEXT1: 'Patient Serial Number',
  PATIENT_MODAL_SERIAL_NUMBER_TEXT2: '',
  PATIENT_MODAL_GENERATE_ACCOUNT_TEXT1: 'Create a Patient Account',
  PATIENT_MODAL_GENERATE_ACCOUNT_TEXT2:
    ' *It can only be created if the patient serial number is registered. The initial ID and PW are set to the patient serial number.',
  PATIENT_SERIAL_NUMBER_INPUT_PLACEHOLDER:
    'Enter an 8-digit number and check for duplicates',
  PATIENT_CHECK_DUPLICATED_OR_NOT_BUTTON: 'Check',
  PATIENT_CREATE_PATIENT_ACCOUNT_BUTTON: 'Create',
  PATIENT_SERIAL_NUMBER_AVAILABLE_TEXT: '*Available serial numbers.',
  PATIENT_SERIAL_NUMBER_DUPLICATED_TEXT: '*Duplicate serial numbers.',
  EDIT_PATIENT_ACCOUNT_TEXT:
    '*The account has been changed according to the changed serial number.',
  PATIENT_SERIAL_NUMBER_FIRST_TEXT:
    '*Please register the patient serial number first.',
  PATIENT_PERFORM_DUPLICATE_CHECK_TEXT: '*Please perform a check.',
  PATIENT_MODAL_COMPLETE_BUTTON_TEXT: 'Add Patient',

  // 진료목록
  CHART_INFO_BOX_PT_HEIGHT: 'Height',
  CHART_INFO_BOX_PT_WEIGHT: 'Weight',
  CHART_INFO_BOX_PT_NURSE_IN_CHARGE: 'Charge Nurse',
  CHART_NUMBER_TEXT: 'Chart No.',
  CHART_NURSE_TEXT: 'Nurse',
  CHART_DOCTOR_TEXT: 'Doctor',
  CHART_RECENT_ALERT_TEXT: 'Recent Notifications',
  CHART_RECENT_UPDATE_TEXT: 'Recent updates',
  CHART_REGISTER_DATE_TEXT: 'Created on',
  CHART_TABLE_BUTTON_TEXT: 'Manage',
  CHART_VIDEO_BUTTON_TEXT: 'Download',

  // 영상정보
  VIDEO_NUM_TEXT: 'No.',
  VIDEO_SEP_TEXT: 'Sep',
  VIDEO_HOS_NAME_TEXT: 'Hospital Name',
  VIDEO_DOCTOR_TEXT: 'Doctor',
  VIDEO_MEMO_TEXT: 'Memo',
  VIDEO_SHOOTING_DATE_TEXT: 'Shooting Date',
  VIDEO_CREATED_DATE_TEXT: 'Created Date',

  // 비디오 등록 모달
  VIDEO_MODAL_TITLE_TEXT: 'Add Video Info',
  VIDEO_MODAL_ATTACH_VIDEO_FILE: 'Attach video file',
  VIDEO_MODAL_COMPLETE_BUTTON_TEXT: 'Save',

  VIDEO_MODAL_CONFIRM_ADD_VIDEO: 'Are you sure you want to add video information?',

  // 진료 워크플로우 모달
  WORKFLOW_MODAL_TITLE: 'Chart Workflow',

  WORKFLOW_MODAL_TAB_PATIENT: 'Patient',
  WORKFLOW_MODAL_TAB_OPINION: 'Opinion',
  WORKFLOW_MODAL_TAB_TELECONSULTING: 'Teleconsultation',
  WORKFLOW_MODAL_TAB_CARE_PLANS: 'Care plan',
  WORKFLOW_MODAL_TAB_VISIT_FORM: 'Visit form',
  WORKFLOW_MODAL_TAB_VISIT_INFO: 'Visit info',
  WORKFLOW_MODAL_TAB_VISIT_RESULT: 'Visit result',
  WORKFLOW_MODAL_TAB_POST_CARE: 'Post care',
  WORKFLOW_MODAL_TAB_POST_PRESCRIPTION: 'Post prescription',

  WORKFLOW_MODAL_DOWNLOAD_PT_INFO: 'Download Patient info',
  WORKFLOW_MODAL_CONFIRM_PT_INFO: 'Request confirmation',
  WORKFLOW_MODAL_PT_INFO: 'Patient demographics',
  WORKFLOW_MODAL_PT_NAME: 'Name',
  WORKFLOW_MODAL_PT_AGE: 'Age',
  WORKFLOW_MODAL_PT_BIRTH: 'Birth',
  WORKFLOW_MODAL_PT_GENDER: 'Gender',
  WORKFLOW_MODAL_PT_HEIGHT: 'Height(cm)',
  WORKFLOW_MODAL_PT_WEIGHT: 'Weight(kg)',
  WORKFLOW_MODAL_PT_TEL: 'Phone number',

  WORKFLOW_MODAL_CHART_INFO: 'Medical staff in charge',
  WORKFLOW_MODAL_CHART_INFO_NURSE1: 'Mongolian nurse',
  WORKFLOW_MODAL_CHART_INFO_NURSE2: 'Korean nurse',
  WORKFLOW_MODAL_CHART_INFO_DOCTOR1: 'Mongolian doctor',
  WORKFLOW_MODAL_CHART_INFO_DOCTOR2: 'Korean doctor',

  WORKFLOW_MODAL_PT_MEDICAL_INFO: "Patient's medical information",
  WORKFLOW_MODAL_PT_SYMTOM: 'Symptoms',
  WORKFLOW_MODAL_PT_DIAGNOSIS_NAME: 'Diagnosis',
  WORKFLOW_MODAL_PT_TREATMENT_HISTORY:
    'Treatment the patient has received so far',
  WORKFLOW_MODAL_PT_PREFER_TREATMENT:
    'Treatment the patient wants to receive in Korea',
  WORKFLOW_MODAL_PT_CASE_HISTORY: 'Medical history',
  WORKFLOW_MODAL_PT_FAMILY_CASE_HISTORY: 'Family history',
  WORKFLOW_MODAL_PT_PAST_CASE_HISTORY: 'Past history',
  WORKFLOW_MODAL_PT_HTN: 'High blood pressure',
  WORKFLOW_MODAL_PT_DM: 'Diabetes',
  WORKFLOW_MODAL_PT_TB: 'Tuberculosis',
  WORKFLOW_MODAL_PT_CANCER: 'Cancer',
  WORKFLOW_MODAL_PT_ECT: 'Others',
  WORKFLOW_MODAL_PT_SURGERY_HISTORY: 'Surgical history',
  WORKFLOW_MODAL_PT_DRUG_HISTORY: 'Medication history',
  WORKFLOW_MODAL_PT_ALLERGY_INFO: 'Allergy information',

  WORKFLOW_MODAL_CONFIRM_OPINION_BUTTON_TEXT: 'Request confirmation',
  WORKFLOW_MODAL_OPINION_DOMESTIC_HOSPITAL_OPINION: 'Second Opinion',
  WORKFLOW_MODAL_OPINION_CONTENTS: 'Contents',

  WORKFLOW_MODAL_REQUEST_SCHEDULING_BUTTON_TEXT: 'Request scheduling',
  WORKFLOW_MODAL_TELE_INFO: 'Teleconsultation info',
  WORKFLOW_MODAL_TELE_DATE: 'Reservation date',
  WORKFLOW_MODAL_TELE_DATE_META_INFO:
    '*It is automatically registered according to the Korean schedule.',
  WORKFLOW_MODAL_TELE_LINK: 'Participation link',

  WORKFLOW_MODAL_DOWNLOAD_CP: 'Download care plan',
  WORKFLOW_MODAL_CONFIRM_CP: 'Request confirmation',
  WORKFLOW_MODAL_CP_PATIENT_NATIONALITY: 'Nationality',
  WORKFLOW_MODAL_CP_PATIENT_STATUS: 'Patient Status',
  WORKFLOW_MODAL_CP_CARE_PLANS: 'Care plan',
  WORKFLOW_MODAL_CP_DOCTOR_IN_CHARGE: 'Doctor in charge',
  WORKFLOW_MODAL_CP_DEPARTMENT: 'Department',
  WORKFLOW_MODAL_CP_DIAGNOSIS_DETAILS: 'Diagnosis',
  WORKFLOW_MODAL_CP_PLAN: 'Plan',
  WORKFLOW_MODAL_CP_DURATION_COST: 'Period and expected cost',
  WORKFLOW_MODAL_CP_CAUTION: 'Caution',
  WORKFLOW_MODAL_CP_COST_DETAIL: 'Cost details',

  WORKFLOW_RQ_CONFIRMATION_OF_VI: 'Request confirmation',
  WORKFLOW_MODAL_VF_VISIT_FORM: 'Visit form',
  WORKFLOW_MODAL_VF_HOSPITALIZATION_OR_NOT: 'Hospitalization or not',
  WORKFLOW_MODAL_VF_HOSPITALIZATION: 'Inpatient',
  WORKFLOW_MODAL_VF_OUTPATIENT: 'Outpatient',
  WORKFLOW_MODAL_VF_PREFER_ROOM: 'Preferred (only when hospitalized)',
  WORKFLOW_MODAL_VF_PREMIUM_ROOM: 'Superior',
  WORKFLOW_MODAL_VF_BASIC_ROOM: 'Regular',
  WORKFLOW_MODAL_VF_VEHICLE_OR_NOT: 'Vehicle or not',
  WORKFLOW_MODAL_VF_REQUIRED: 'Required',
  WORKFLOW_MODAL_VF_UNNECESSARY: 'Unnecessary',
  WORKFLOW_MODAL_VF_COMPANION_OR_NOT: 'Companion or not',
  WORKFLOW_MODAL_VF_YES: 'Yes',
  WORKFLOW_MODAL_VF_NO: 'No',
  WORKFLOW_MODAL_VF_OTHER_PRECAUTIONS: 'Other precautions',
  WORKFLOW_MODAL_VF_HEALTH_SCREENING_PROGRAM:
    'Health Screening Programs (only when necessary)',
  WORKFLOW_MODAL_VF_HSP_PACKAGE: 'Package',
  WORKFLOW_MODAL_VF_HSP_ADDITIONAL: 'Additional',
  WORKFLOW_MODAL_VF_HSP_P_BASIC: 'Basic',
  WORKFLOW_MODAL_VF_HSP_P_DIGESTIVE: 'Digestive System',
  WORKFLOW_MODAL_VF_HSP_P_CARDIAC: 'Cardiac System',
  WORKFLOW_MODAL_VF_HSP_P_PULMONARY: 'Pulmonary System',
  WORKFLOW_MODAL_VF_HSP_P_CAREBROVASCULAR: 'Cerebrovascular Accident',
  WORKFLOW_MODAL_VF_HSP_P_GYNECOLOGICAL: 'Gynecological Cancer',
  WORKFLOW_MODAL_VF_HSP_P_PREMIUM: 'Premium',
  WORKFLOW_MODAL_VF_HSP_A_CT_BR: 'CT_Brain',
  WORKFLOW_MODAL_VF_HSP_A_CT_CH: 'CT_Chest',
  WORKFLOW_MODAL_VF_HSP_A_CT_AB_PE: 'CT_Abdomen-pelvic',
  WORKFLOW_MODAL_VF_HSP_A_CT_HR_CO: 'CT_Heart-coronary',
  WORKFLOW_MODAL_VF_HSP_A_MRI_BR: 'MRI_Brain',
  WORKFLOW_MODAL_VF_HSP_A_MRI_LU: 'MRI_Lumbar',
  WORKFLOW_MODAL_VF_HSP_A_MRI_CE: 'MRI_Cervical',
  WORKFLOW_MODAL_VF_HSP_A_MRI_MRA_BR: 'MRI/MRA_Brain',
  WORKFLOW_MODAL_VF_HSP_A_UL_PE: 'Ultrasonography_Pelvis',
  WORKFLOW_MODAL_VF_HSP_A_UL_CH: 'Ultrasonography_Breast',
  WORKFLOW_MODAL_VF_HSP_A_UL_TH: 'Ultrasonography_Thyroid gland',
  WORKFLOW_MODAL_VF_HSP_A_UL_CA: 'Ultrasonography_Carotid arterial',
  WORKFLOW_MODAL_VF_HSP_A_UL_HT: 'Ultrasonography_Echocardiography',
  WORKFLOW_MODAL_VF_HSP_A_UL_PR: 'Ultrasonography_Prostate',
  WORKFLOW_MODAL_VF_HSP_A_PET_CT_BR: 'PET-CT_Brain',
  WORKFLOW_MODAL_VF_HSP_A_PET_CT_TR: 'PET-CT_Torso',
  WORKFLOW_MODAL_VF_HSP_A_PET_CT_BR_TR: 'PET-CT_Torso with Brain',
  WORKFLOW_MODAL_VF_VISA_REQUEST: 'VISA Request (only when applicable)',
  WORKFLOW_MODAL_VF_RS_CONFIRMATION: 'Reservation confirmation',
  WORKFLOW_MODAL_VF_INVITATION: 'Invitation',
  WORKFLOW_MODAL_VF_PASSPORT: 'Passport',
  WORKFLOW_MODAL_VF_IDENTIFICATION: 'Identity verification letter',
  WORKFLOW_MODAL_VF_CERTIFICATE_OF_EMPLOYMENT: 'Certificate of Employment',

  WORKFLOW_MODAL_CONFIRM_VISIT_INFO_BUTTON_TEXT: 'Request confirmation',
  WORKFLOW_MODAL_VI_VISIT_INFO: 'Visit info',
  WORKFLOW_MODAL_VI_VISIT_DATE: 'Visit date',
  WORKFLOW_MODAL_VI_VISIT_DATE_MN_META_INFO:
    '*Appointment date and time will be auto-scheduled when booking in Korea.',
  WORKFLOW_MODAL_VI_VISIT_COST: 'Inpatient care costs',
  WORKFLOW_MODAL_VI_CHECKLIST_APPOINTMENT_DATE:
    'Checklist and appointment date',
  WORKFLOW_MODAL_VI_OUTPATIENT_CAUTION: 'Precautions during outpatient visit',
  WORKFLOW_MODAL_VI_OTHER_INFORMATION: 'Other information',
  WORKFLOW_MODAL_VI_VISIT_OR_NOT_REASIONS: 'Visit or not & reasons',
  WORKFLOW_MODAL_VI_CONCIERGE_SERVICE_INFO: 'Concierge service information',
  WORKFLOW_MODAL_VI_VEHICLE_INFO: 'Vehicle information',
  WORKFLOW_MODAL_VI_ACCOMODATION_INFO: 'Accommodation information',
  WORKFLOW_MODAL_VI_HOSPITAL_LOCATION: 'Hospital location',
  WORKFLOW_MODAL_VI_EMERGENCY_CONTACT: 'Emergency contact network',

  WORKFLOW_MODAL_CONFIRM_VISIT_RESULT_BUTTON_TEXT: 'Request confirmation',
  WORKFLOW_MODAL_VR_DIAGNOSIS_RESULT: 'Visit result',
  WORKFLOW_MODAL_VR_PRESCRIPTIONS: 'Prescriptions',
  WORKFLOW_MODAL_VR_PRIVACY_AGREEMENT: 'Privacy agreement',
  WORKFLOW_MODAL_VR_EXAMINATION_AGREEMENT: 'Examination agreement',
  WORKFLOW_MODAL_VR_PROCEDURE_AGREEMENT: 'Procedure agreement',
  WORKFLOW_MODAL_VR_HOSPITALIZATION_AGREEMENT: 'Hospitalization agreement',
  WORKFLOW_MODAL_VR_OTHER_NOTABLES: 'Other notables',

  WORKFLOW_MODAL_CONFIRM_POST_CARE_BUTTON_TEXT: 'Request confirmation',
  WORKFLOW_MODAL_CURRENT_PT_STATUS: 'Current status',
  WORKFLOW_MODAL_PROGRESSION: 'Progression',
  WORKFLOW_MODAL_MEDICATIONS_NEEDED: 'Medications needed',

  WORKFLOW_MODAL_ADD_PRESCRIPTION_RQ: 'Add Prescription request',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_INFO: 'Prescription Request list',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_NUMBER: 'No.',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_TYPE: 'Type',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_TYPE1: 'Add',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_TYPE2: 'Edit',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_CONTENTS: 'Request details',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_WRITER: 'Writer',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_STATUS: 'Processed',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_REGISTER_DATE: 'Request date',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_MANAGE_BUTTON_TEXT: 'Confirm',
  WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_ADD_BUTTON_TEXT: 'Add',

  WORKFLOW_MODAL_CHATTING_CREATED: 'Created at',
  WORKFLOW_MODAL_CHATTING_PLACEHOLDER: 'Enter comment',
  WORKFLOW_MODAL_CHATTING_OBJ_WORKFLOW: 'workflow',
  WORKFLOW_MODAL_CHATTING_OBJ_PT: "patient's information",
  WORKFLOW_MODAL_CHATTING_OBJ_OP: 'second opinion',
  WORKFLOW_MODAL_CHATTING_OBJ_TT: 'teleconsultation',
  WORKFLOW_MODAL_CHATTING_OBJ_CP: 'care plan',
  WORKFLOW_MODAL_CHATTING_OBJ_VF: 'visit form',
  WORKFLOW_MODAL_CHATTING_OBJ_VI: 'visit info',
  WORKFLOW_MODAL_CHATTING_OBJ_VR: 'visit result',
  WORKFLOW_MODAL_CHATTING_OBJ_PC: 'post care',
  WORKFLOW_MODAL_CHATTING_OBJ_PP: 'post prescription',
  WORKFLOW_MODAL_CHATTING_ALARM_TEXT1: '',

  WORKFLOW_MODAL_CHATTING_ALARM_CREATE_WF: 'created a workflow.',

  WORKFLOW_MODAL_CHATTING_ALARM_SAVE_PI: "saved the patient's information.",
  WORKFLOW_MODAL_CHATTING_ALARM_RQ_PI:
    'requested confirmation of patient information.',

  WORKFLOW_MODAL_CHATTING_ALARM_SAVE_OP: 'saved the second opinion.',
  WORKFLOW_MODAL_CHATTING_ALARM_RQ_OP:
    'requested confirmation of the second opinion.',

  WORKFLOW_MODAL_CHATTING_ALARM_RQ_TT:
    'requested to schedule a teleconsultation. ',
  WORKFLOW_MODAL_CHATTING_ALARM_SAVE_TT: 'has scheduled a teleconsultation.',
  WORKFLOW_MODAL_CHATTING_ALARM_EDIT_TT:
    'revised the teleconsultation schedule.',
  WORKFLOW_MODAL_CHATTING_ALARM_COMPLETE_TT: 'completed the teleconsultation.',

  WORKFLOW_MODAL_CHATTING_ALARM_SAVE_CP: 'saved the care plan.',
  WORKFLOW_MODAL_CHATTING_ALARM_RQ_CP:
    'requested confirmation of the care plan.',

  WORKFLOW_MODAL_CHATTING_ALARM_SAVE_VF: 'saved the visit form.',
  WORKFLOW_MODAL_CHATTING_ALARM_RQ_VF:
    'requested confirmation of the visit form.',

  WORKFLOW_MODAL_CHATTING_ALARM_SAVE_VI: 'saved the visit info.',
  WORKFLOW_MODAL_CHATTING_ALARM_RQ_VI:
    'requested confirmation of the visit info.',

  WORKFLOW_MODAL_CHATTING_ALARM_SAVE_VR: 'saved the visit result.',
  WORKFLOW_MODAL_CHATTING_ALARM_RQ_VR:
    'requested confirmation of the visit result.',

  WORKFLOW_MODAL_CHATTING_ALARM_SAVE_PC: 'saved the post care.',
  WORKFLOW_MODAL_CHATTING_ALARM_RQ_PC:
    'requested confirmation of the post care.',

  WORKFLOW_MODAL_CHATTING_ALARM_SAVE_PP: 'has registered a post prescription.',
  WORKFLOW_MODAL_CHATTING_ALARM_RQ_PP:
    'requested post prescription confirmation.',
  WORKFLOW_MODAL_CHATTING_ALARM_COMPLETE_PP:
    'has marked the post prescription request as completed.',
  WORKFLOW_MODAL_CHATTING_ALARM_POST_CHAT: 'posted a comment.',

  // 진료관리
  WORKFLOW_MENU_1: 'Medical List',
  WORKFLOW_MENU_2: 'Video Info',

  PRESCRIPTION_REQUEST_MODAL_NEW_TITLE: 'Add Prescription request',
  PRESCRIPTION_REQUEST_MODAL_MANAGE_TITLE: 'Edit Prescription request',
  PRESCRIPTION_REQUEST_MODAL_REQUEST_INFO: 'Prescription request information',
  PRESCRIPTION_REQUEST_MODAL_REQUEST_TYPE: 'Request type',
  PRESCRIPTION_REQUEST_MODAL_REQUEST_DATE: 'Request date',
  PRESCRIPTION_REQUEST_MODAL_REQUEST_DETAILS: 'Request details',
  PRESCRIPTION_REQUEST_MODAL_REQUEST_PP_CONFIRM_BUTTON_TEXT:
    'Request confirmation',
  PRESCRIPTION_REQUEST_MODAL_MARK_AS_COMPLETE_BUTTON_TEXT: 'Mark as complete',

  // 일정목록
  APPOINTMENTS_CHART_TYPE_TEXT: 'Reservation Type',
  APPOINTMENTS_PT_NAME_TEXT: 'Patient Name',
  APPOINTMENTS_DATE_TEXT: 'Reservation date',
  MN_APPOINTMENTS_DATE_TEXT: 'Mongolia time',
  KR_APPOINTMENTS_DATE_TEXT: 'Korean time',
  APPOINTMENTS_TABLE_ROW_BUTTON_TEXT: 'Entering',
  APPOINTMENTS_TABLE_ROW_BUTTON_TEXT2: 'Confirm',
  APPOINTMENTS_TABLE_ROW_BUTTON_TEXT3: 'Ended',
  APPOINTMENTS_SEARCH_CONTENT_MEDICAL_STAFF: 'Medical staff',
  APPOINTMENTS_SEARCH_CONTENT_MEDICAL_STAFF_SELECT_DEFAULT:
    'Select a medical staff',

  // 캘린더 보기 모달
  CALENDAR_MODAL_TITLE_TEXT: 'Schedule Calendar',
  CALENDAR_TAB_TELE_TEXT: 'Teleconsultation',
  CALENDAR_TAB_VISIT_TEXT: 'Visit',
  CALENDAR_ENDED_MEETING_ALERT_TEXT: 'This meeting has already ended.',

  // 공지사항
  NOTICE_NUMBER_TEXT: 'Notice No.',
  NOTICE_TITLE_TEXT: 'Title',
  NOTICE_CONTENTS_TEXT: 'Contents',
  NOTICE_WRITER_TEXT: 'Writer',
  NOTICE_TARGE_ORG_TEXT: 'Target Organization',
  NOTICE_VIEW_TEXT: 'View',

  // 공지사항 등록, 수정 모달
  NOTICE_MODAL_NEW_TITLE_TEXT: 'Add Notice',
  NOTICE_MODAL_MANAGE_TITLE_TEXT: 'Edit Notice information',
  NOTICE_MODAL_VIEW_TITLE_TEXT: 'View Notice',

  // 페이지 헤더
  PAGE_HEADER_DASHBOARD_TITLE_TEXT: 'Dashboard',
  PAGE_HEADER_DASHBOARD_DESC_TEXT: 'View and manage your dashboard',
  PAGE_HEADER_ORG_LIST_TITLE_TEXT: 'Organization list',
  PAGE_HEADER_ORG_LIST_DESC_TEXT: 'View and manage your list of organizations',
  PAGE_HEADER_USER_LIST_TITLE_TEXT: 'User list',
  PAGE_HEADER_USER_LIST_DESC_TEXT:
    'View and manage a list of users in your organization',
  PAGE_HEADER_PATIENT_LIST_TITLE_TEXT: 'Patient list',
  PAGE_HEADER_PATIENT_LIST_DESC_TEXT:
    'View and manage a list of patients in your organization',
  PAGE_HEADER_CHART_LIST_TITLE_TEXT: 'Chart list',
  PAGE_HEADER_CHART_LIST_DESC_TEXT: "View and manage your patient's chart list",
  PAGE_HEADER_SCHEDULE_LIST_TITLE_TEXT: 'Schedule list',
  PAGE_HEADER_SCHEDULE_LIST_DESC_TEXT: 'Check and view your schedule',
  PAGE_HEADER_NOTICE_LIST_TITLE_TEXT: 'Notice list',
  PAGE_HEADER_NOTICE_LIST_DESC_TEXT: 'View and manage notices',

  // 알림 모달
  LOGOUT_ALERT_MODAL_TITLE_TEXT: 'Logout',
  LOGOUT_ALERT_MODAL_TITLE_DESC: 'Click the Logout button to logout',

  ACCOUNT_CONTACT_MODAL_TITLE: 'Contact us',
  ACCOUNT_CONTACT_MODAL_ORG_NAME: 'Organization name',
  ACCOUNT_CONTACT_MODAL_ORG_NAME_VALUE: 'WONKWANG UNIVERSITY HOSPITAL',
  ACCOUNT_CONTACT_MODAL_EMAIL: 'Contact Email',
  ACCOUNT_CONTACT_MODAL_TEL: 'Contact Phone',
  ACCOUNT_CONTACT_MODAL_DESC:
    'Please contact us if you have any account inquiries.',

  RESET_PSW_ALERT_TITLE: 'Reset Password Completed',
  RESET_PSW_ALERT_DESC: 'Password reset has been completed.',

  EDIT_PSW_ALERT_TITLE: 'Password Changed',
  EDIT_PSW_ALERT_DESC: 'Password change has been completed.',
  EDIT_PSW_NOT_MATCH_ALERT_TEXT: 'Your passwords do not match.',
  EDIT_PSW_FAIL_ALERT_TEXT: 'Fail to edit password',

  ADD_ORG_ALERT_TITLE: 'Organization added',
  ADD_ORG_ALERT_DESC: 'Organization addition has been completed.',
  EDIT_ORG_ALERT_TITLE: 'Organization info changed',
  EDIT_ORG_ALERT_DESC: 'Organization information changes has been completed.',
  DELETE_ORG_ALERT_TITLE: 'Delete Organization',
  DELETE_ORG_ALERT_DESC: 'Click the Delete button to delete the organization.',
  CP_DELETE_ORG_ALERT_TITLE: 'Organization Deleted',
  CP_DELETE_ORG_ALERT_DESC: 'Organization deletion has been completed.',

  DISABLED_ORG_ALERT_TITLE: 'Disable Organization', // 기관을 비활성화 하시겠습니끼?
  DISABLED_ORG_ALERT_DESC:
    'Click the Disabled button to disable the organization.', // 확인 버튼을 클릭하시면 기관이 비활성화됩니다.
  CP_DISABLED_ORG_ALERT_TITLE: 'Organization Disabled', // 기관 비활성화 완료
  CP_DISABLED_ORG_ALERT_DESC: 'Organization disablement has been completed', // 기관 비활성화가 완료되었습니다.

  ACTIVATE_ORG_ALERT_TITLE: 'Activate Organization', // 기관을 활성화 하시겠습니까?
  ACTIVATE_ORG_ALERT_DESC:
    'Click the Activate button to disable the organization.', // 확인 버튼을 클릭하시면 기관이 활성화됩니다.
  CP_ACTIVATE_ORG_ALERT_TITLE: 'Organization Activated', // 기관 활성화 완료
  CP_ACTIVATE_ORG_ALERT_DESC: 'Organization activation has been completed', // 기관 활성화가 완료되었습니다.

  ADD_USER_ALERT_TITLE: 'User added',
  ADD_USER_ALERT_DESC: 'User addition has been completed.',
  EDIT_USER_ALERT_TITLE: 'User info changed',
  EDIT_USER_ALERT_DESC: 'User information changes has been completed.',
  DELETE_USER_ALERT_TITLE: 'Delete User',
  DELETE_USER_ALERT_DESC: 'Click the Delete button to delete the user.',
  CP_DELETE_USER_ALERT_TITLE: 'User Deleted',
  CP_DELETE_USER_ALERT_DESC: 'User deletion has been completed.',

  DISABLED_USER_ALERT_TITLE: 'Disable User', // 사용자를 비활성화 하시겠습니까?
  DISABLED_USER_ALERT_DESC: 'Click the Disabled button to disable the user.', //확인 버튼을 클릭하시면 사용자가 비활성화됩니다.
  CP_DISABLED_USER_ALERT_TITLE: 'User Disabled', // 사용자 비활성화 완료
  CP_DISABLED_USER_ALERT_DESC: 'User disablement has been completed', // 사용자 비활성화가 완료되었습니다.

  ACTIVATE_USER_ALERT_TITLE: 'Activate User', // 사용자를 활성화 하시겠습니까?
  ACTIVATE_USER_ALERT_DESC: 'Click the Activate button to disable the user.', // 확인 버튼을 클릭하시면 사용자가 활성화됩니다.
  CP_ACTIVATE_USER_ALERT_TITLE: 'User Activated', // 사용자 활성화 완료
  CP_ACTIVATE_USER_ALERT_DESC: 'User activation has been completed', // 사용자 활성화가 완료되었습니다.

  ADD_PATIENT_ALERT_TITLE: 'Patient added',
  ADD_PATIENT_ALERT_DESC: 'Patient addition has been completed.',
  EDIT_PATIENT_ALERT_TITLE: 'Patient info changed',
  EDIT_PATIENT_ALERT_DESC: 'Patient information changes has been completed.',
  DELETE_PATIENT_ALERT_TITLE: 'Delete Patient',
  DELETE_PATIENT_ALERT_DESC: 'Click the Delete button to delete the patient.',
  CP_DELETE_PATIENT_ALERT_TITLE: 'Patient Deleted',
  CP_DELETE_PATIENT_ALERT_DESC: 'Patient deletion has been completed.',

  DELETE_WORKFLOW_ALERT_TITLE: 'Delete Chart',
  DELETE_WORKFLOW_ALERT_DESC: 'Click the Delete button to delete the chart.',
  CP_DELETE_WORKFLOW_ALERT_TITLE: 'Chart Deleted',
  CP_DELETE_WORKFLOW_ALERT_DESC: 'Chart deletion has been completed.',
  SAVE_WORKFLOW_ALERT_TITLE: 'Chart info changed',
  SAVE_WORKFLOW_ALERT_DESC: 'Chart information changes has been completed.',

  DOWNLOAD_PT_INFO_ALERT_TITLE: 'Download the Patient information',
  DOWNLOAD_PT_INFO_ALERT_DESC:
    'Click the Download button to start the download.',
  CP_DOWNLOAD_PT_INFO_ALERT_TITLE: 'Download Completed',
  CP_DOWNLOAD_PT_INFO_ALERT_DESC:
    'Patient information download has been completed.',
  RQ_CONFIRM_PATIENT_INFO_ALERT_TITLE: 'Send Confirmation Request',
  RQ_CONFIRM_PATIENT_INFO_ALERT_DESC:
    'Click the Send button to request the patient info confirmation.',
  CP_RQ_CONFIRM_PATIENT_INFO_ALERT_TITLE: 'Request Sent Successfully',
  CP_RQ_CONFIRM_PATIENT_INFO_ALERT_DESC:
    'Paitent info confirmation request  has been sent.',

  RQ_CONFIRM_OPINION_ALERT_TITLE: 'Send Confirmation Request',
  RQ_CONFIRM_OPINION_ALERT_DESC:
    'Click the Send button to request the second opinion confirmation.',
  CP_RQ_CONFIRM_OPINION_ALERT_TITLE: 'Request Sent Successfully',
  CP_RQ_CONFIRM_OPINION_ALERT_DESC:
    'Second opinion confirmation request  has been sent.',

  RQ_CONFIRM_SCHEDULING_ALERT_TITLE: 'Send Scheduling Request',
  RQ_CONFIRM_SCHEDULING_ALERT_DESC:
    'Click the Send button to request to schedule a teleconsultation.',
  CP_RQ_CONFIRM_SCHEDULING_ALERT_TITLE: 'Request Sent Successfully',
  CP_RQ_CONFIRM_SCHEDULING_ALERT_DESC:
    'A teleconsultation scheduling request has been sent.',

  RQ_CONFIRM_CP_ALERT_TITLE: 'Send Confirmation Request',
  RQ_CONFIRM_CP_ALERT_DESC:
    'Click the Send button to request the care plan confirmation.',
  CP_RQ_CONFIRM_CP_ALERT_TITLE: 'Request Sent Successfully',
  CP_RQ_CONFIRM_CP_ALERT_DESC: 'Care plan confirmation request has been sent.',

  DOWNLOAD_CP_ALERT_TITLE: 'Download the Care plan?',
  DOWNLOAD_CP_ALERT_DESC: 'Click the OK button to start the download.',
  CP_DOWNLOAD_CP_ALERT_TITLE: 'Download Completed',
  CP_DOWNLOAD_CP_ALERT_DESC: 'Care plan download has been completed.',

  RQ_CONFIRM_VF_ALERT_TITLE: 'Send Confirmation Request',
  RQ_CONFIRM_VF_ALERT_DESC:
    'Click the Send button to request the visit form confirmation.',
  CP_RQ_CONFIRM_VF_ALERT_TITLE: 'Request Sent Successfully',
  CP_RQ_CONFIRM_VF_ALERT_DESC:
    'Visit form confirmation request  has been sent.',

  RQ_CONFIRM_VI_ALERT_TITLE: 'Send Confirmation Request',
  RQ_CONFIRM_VI_ALERT_DESC:
    'Click the Send button to request the visit info confirmation.',
  CP_RQ_CONFIRM_VI_ALERT_TITLE: 'Request Sent Successfully',
  CP_RQ_CONFIRM_VI_ALERT_DESC: 'Visit info confirmation request has been sent.',

  RQ_CONFIRM_VR_ALERT_TITLE: 'Send Confirmation Request',
  RQ_CONFIRM_VR_ALERT_DESC:
    'Click the Send button to request the visit result confirmation.',
  CP_RQ_CONFIRM_VR_ALERT_TITLE: 'Request Sent Successfully',
  CP_RQ_CONFIRM_VR_ALERT_DESC:
    'Visit result confirmation request has been sent.',

  RQ_CONFIRM_PC_ALERT_TITLE: 'Send Confirmation Request',
  RQ_CONFIRM_PC_ALERT_DESC:
    'Click the Send button to request the post care confirmation.',
  CP_RQ_CONFIRM_PC_ALERT_TITLE: 'Request Sent Successfully',
  CP_RQ_CONFIRM_PC_ALERT_DESC: 'Post care confirmation request has been sent.',

  CP_RQ_CONFIRM_PP_ALERT_TITLE: 'Request Sent Successfully',
  CP_RQ_CONFIRM_PP_ALERT_DESC:
    'Post prescription confirmation request has been sent.',

  CP_COMPLETE_CONFIRM_RQ_ALERT_TITLE: 'Marked as complete',
  CP_COMPLETE_CONFIRM_RQ_ALERT_DESC:
    'Post prescription request has been marked as complete.',

  ADD_PP_REQ_ALERT_TITLE: 'Post prescription added',
  ADD_PP_REQ_ALERT_DESC: 'Prescription request addition has been completed.',

  EDIT_PP_REQ_ALERT_TITLE: 'Post prescription info changed',
  EDIT_PP_REQ_ALERT_DESC:
    'Prescription request information changes has been completed.',

  DELETE_PP_REQ_ALERT_TITLE: 'Delete Post prescription',
  DELETE_PP_REQ_ALERT_DESC:
    'Click the Delete button to delete the post prescription request.',
  CP_DELETE_PP_REQ_ALERT_TITLE: 'Post prescription Deleted',
  CP_DELETE_PP_REQ_ALERT_DESC:
    'Post prescription request deletion has been completed.',

  ADD_NOTICE_ALERT_TITLE: 'Notice added',
  ADD_NOTICE_ALERT_DESC: 'Notice addition has been completed.',
  EDIT_NOTICE_ALERT_TITLE: 'Notice info changed',
  EDIT_NOTICE_ALERT_DESC: 'Notice information changes has been completed.',
  DELETE_NOTICE_ALERT_TITLE: 'Delete Notice',
  DELETE_NOTICE_ALERT_DESC: 'Click the Delete button to delete the notice.',
  CP_DELETE_NOTICE_ALERT_TITLE: 'Notice Deleted',
  CP_DELETE_NOTICE_ALERT_DESC: 'Notice deletion has been completed.',

  MODAL_WARN_TEXT_BLANK_REQUIREMENT: 'Please fill out the required fields',

  MEETING_NAME_FORM_TITLE_TEXT: 'To join the meeting, please enter your name.',
  MEETING_NAME_FORM_JOIN_BTN_TEXT: 'join',
  MEETING_ALERT_FAIL_FETCH_PATIENT_INFO:
    'Failed to fetch patient information. Please try again later.',
  MEETING_ALERT_FAIL_FETCH_WORKFLOW_INFO:
    'Failed to fetch chart information. Please try again later.',
  MEETING_ALERT_FAIL_FETCH_MEETING_INFO:
    'Failed to fetch meeting information. Please try again later.',

  DASHBOARD_TODAY_TELE_PATIENT: 'Today Teleconsulting',
  DASHBOARD_TODAY_VISIT_PATIENT: 'Today Visit Korea',
  DASHBOARD_CURRENT_TELE_USAGE_STATUS_TITLE: 'Usage Status Teleconsulting ',
  DASHBOARD_USER_STATUS_TITLE: 'User status',
  DASHBOARD_PATIENTS_SCHEDULED_FOR_TREATMENT_TITLE: 'Waiting patient',
  DASHBOARD_CURRENT_PATIENT_REGISTRATION_STATUS_TITLE: 'Registration status',
  DASHBOARD_CURRENT_PP_REGISTRATION_STATUS_TITLE: 'Prescription status',
  DASHBOARD_CURRENT_VIR_COMPLETE_STATUS_TITLE: 'Visit status',
  DASHBOARD_CURRENT_USAGE_STATUS_TITLE: 'Usage status',
  DASHBOARD_P_NAME_TEXT: 'name',
  DASHBOARD_P_DEPARTMENT_TEXT: 'department',
  DASHBOARD_P_ORG_TEXT: 'org',
  DASHBOARD_DOCTOR_TEXT: 'doctor',
  DASHBOARD_TELE_DATE_TEXT: 'Date',
  DASHBOARD_VISIT_DATE_TEXT: 'Date',
  DASHBOARD_NO_WAITING_PTS: 'No waiting patients',

  JAN: 'January',
  FEB: 'February',
  MAR: 'March',
  APR: 'April',
  MAY: 'May',
  JUN: 'June',
  JUL: 'July',
  AUG: 'August',
  SEP: 'September',
  OCT: 'October',
  NOV: 'November',
  DEC: 'December',

  FIND_PSW_FAIL_ALERT_TEXT: 'Please check your email.',
  FOOTER_ADDRESS_TEXT:
    '806-16, Pangyoyeok-ro 192beon-gil, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea',

  SIDEBAR_TE_TITLE_TEXT: 'Teleconsulting',
  SIDEBAR_VII_TITLE_TEXT: 'Visit',
  SIDEBAR_ALARM_TITLE_TEXT: 'Unread',

  SIDEBAR_TIEM_ELLAPSE_TEXT1: 'about',
  SIDEBAR_TIEM_ELLAPSE_TEXT2: 'year',
  SIDEBAR_TIEM_ELLAPSE_TEXT3: 'month',
  SIDEBAR_TIEM_ELLAPSE_TEXT4: 'day',
  SIDEBAR_TIEM_ELLAPSE_TEXT5: 'hour',
  SIDEBAR_TIEM_ELLAPSE_TEXT6: 'minute',
  SIDEBAR_TIEM_ELLAPSE_TEXT7: 'ago',
  SIDEBAR_ALL_READ_TEXT: 'Read All',

  USER_ALERT_DUPLICATED_ID: 'Email already exists.',
  WORKFLOW_SUCCESS_ALERT_LINK_CLIPBOARD: 'Link copied successfully.',
  WORKFLOW_FAIL_ALERT_LINK_CLIPBOARD: 'Failed to copy link.',
  PATIENT_ALERT_ADD_ORG_FIRST: 'You need to register an organization first.',
  WORKFLOW_CONFIRM_ADD_CHART: 'Would you like to create a new chart?',
  WORKFLOW_CONFIRM_ADD_VIDEO: 'Would you like to add video?',
  DELETE_FILE_CONFIRM_TEXT: 'Are you sure you want to delete this file?',

  MOBILE_INDEX_TITLE: "Health care, easily and smartly",
  MOBILE_INDEX_DESC: "From pre-consultation questionnaire writing to AI chatbot, receive health care and various medical information easily and smartly.",
  MOBILE_INDEX_PAPERWEIGHT_TITLE: "Write a questionnaire",
  MOBILE_INDEX_PAPERWEIGHT_DESC: "Write a simple questionnaire before the consultation to provide accurate information to the medical staff.",
  MOBILE_INDEX_PAPERWEIGHT_BUTTON: "Write",
  MOBILE_INDEX_CHATBOT_TITLE: "Chat with AI",
  MOBILE_INDEX_CHATBOT_DESC: "Ask about health, disease, nutrition information easily and smartly with AI.",
  MOBILE_INDEX_CHATBOT_BUTTON: "Chat",

  MOBILE_CHATBOT_INTRO: "Do you have any questions about your symptoms? AI will explain medical, health, and nutrition information to you kindly.",
  MOBILE_CHATBOT_INPUT_PLACEHOLDER: "Input your message...",
};

export default lang;
