// ============================================
// Oman MOH - Doctor Consultation Module Types
// ============================================

// ---------- Patient ----------
export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  civilId: string; // Oman Civil ID
  firstName: string;
  lastName: string;
  firstNameAr?: string;
  lastNameAr?: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  age: number;
  bloodType?: string;
  nationality: string;
  phone: string;
  email?: string;
  address?: string;
  wilayat?: string; // Oman administrative division
  governorate?: string;
  photoUrl?: string;
  insuranceProvider?: string;
  insurancePolicyNo?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

// ---------- Allergy ----------
export interface Allergy {
  id: string;
  allergen: string;
  type: 'Drug' | 'Food' | 'Environmental' | 'Other';
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Life-threatening';
  reaction: string;
  status: 'Active' | 'Inactive';
  recordedDate: string;
}

// ---------- Appointment ----------
export type AppointmentStatus =
  | 'Scheduled'
  | 'Checked-in'
  | 'In Visit'
  | 'Completed'
  | 'No Show'
  | 'Cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  scheduledTime: string;
  endTime?: string;
  status: AppointmentStatus;
  visitType: 'Initial' | 'Follow-up';
  visitReason: string;
  department: string;
  clinicName: string;
  priority: 'Normal' | 'Urgent';
  notes?: string;
}

// ---------- Vital Signs ----------
export interface VitalSigns {
  id: string;
  patientId: string;
  recordedAt: string;
  temperature?: number; // °C
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number; // %
  weight?: number; // kg
  height?: number; // cm
  bmi?: number;
  painLevel?: number; // 0-10
  bloodGlucose?: number;
  recordedBy: string;
}

// ---------- Medication ----------
export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  route: 'Oral' | 'IV' | 'IM' | 'SC' | 'Topical' | 'Inhaled' | 'Rectal' | 'Other';
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Discontinued' | 'Completed';
  prescribedBy: string;
  instructions?: string;
}

// ---------- Lab Result ----------
export interface LabResult {
  id: string;
  testName: string;
  category: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  orderedDate: string;
  resultDate: string;
  orderedBy: string;
}

// ---------- Imaging ----------
export interface ImagingResult {
  id: string;
  type: 'X-Ray' | 'CT' | 'MRI' | 'Ultrasound' | 'Other';
  bodyPart: string;
  findings: string;
  impression: string;
  orderedDate: string;
  resultDate: string;
  orderedBy: string;
  status: 'Ordered' | 'In Progress' | 'Completed';
}

// ---------- Medical History ----------
export interface MedicalHistory {
  id: string;
  condition: string;
  icdCode: string;
  diagnosedDate: string;
  status: 'Active' | 'Resolved' | 'Chronic';
  notes?: string;
}

export interface SurgicalHistory {
  id: string;
  procedure: string;
  date: string;
  hospital: string;
  notes?: string;
}

export interface FamilyHistory {
  id: string;
  relation: string;
  condition: string;
  ageOfOnset?: number;
  notes?: string;
}

// ---------- Consultation / Visit Note ----------
export type DocumentationMode = 'SOAPE' | 'APSO';

export type ConsultationStatus =
  | 'In Progress'
  | 'Completed'
  | 'Signed'
  | 'Amended';

// ROS (Review of Systems)
export interface ReviewOfSystems {
  general?: string;
  heent?: string;
  cardiovascular?: string;
  respiratory?: string;
  gastrointestinal?: string;
  genitourinary?: string;
  musculoskeletal?: string;
  neurological?: string;
  psychiatric?: string;
  skin?: string;
  endocrine?: string;
  hematologic?: string;
}

// Physical Examination
export interface PhysicalExam {
  generalAppearance?: string;
  heent?: string;
  neck?: string;
  chest?: string;
  cardiovascular?: string;
  abdomen?: string;
  extremities?: string;
  neurological?: string;
  skin?: string;
  musculoskeletal?: string;
  other?: string;
}

// Diagnosis
export interface Diagnosis {
  id: string;
  icdCode: string;
  description: string;
  type: 'Primary' | 'Secondary';
  status: 'Preliminary' | 'Final' | 'Working';
  notes?: string;
}

// Orders
export type OrderType = 'Lab' | 'Imaging' | 'Procedure' | 'Referral' | 'Other';
export type OrderPriority = 'Routine' | 'Urgent' | 'STAT';

export interface Order {
  id: string;
  type: OrderType;
  name: string;
  priority: OrderPriority;
  instructions?: string;
  status: 'Ordered' | 'In Progress' | 'Completed' | 'Cancelled';
  orderedAt: string;
}

// Prescription
export interface Prescription {
  id: string;
  medicationName: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  quantity: number;
  refills: number;
  instructions: string;
  substitutionAllowed: boolean;
}

// Referral
export interface Referral {
  id: string;
  specialty: string;
  physician?: string;
  facility?: string;
  reason: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  notes?: string;
}

// Follow-up
export interface FollowUp {
  recommended: boolean;
  interval?: string; // e.g., "2 weeks", "1 month"
  instructions?: string;
}

// Full Consultation Record
export interface ConsultationRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  visitType: 'Initial' | 'Follow-up';
  documentationMode: DocumentationMode;
  status: ConsultationStatus;
  startTime: string;
  endTime?: string;

  // Subjective
  chiefComplaint: string;
  historyOfPresentIllness: string;
  reviewOfSystems: ReviewOfSystems;

  // Objective
  vitalSigns?: VitalSigns;
  physicalExam: PhysicalExam;

  // Assessment
  diagnoses: Diagnosis[];
  clinicalImpression: string;

  // Plan
  orders: Order[];
  prescriptions: Prescription[];
  referrals: Referral[];
  patientEducation: string;
  treatmentGoals: string;
  followUp: FollowUp;

  // Evaluation (for follow-up visits)
  evaluationNotes?: string;
  progressNotes?: string;
  planAdjustment?: string;

  // Signatures
  doctorSignature?: string;
  signedAt?: string;
}

// ---------- Doctor ----------
export interface Doctor {
  id: string;
  name: string;
  nameAr?: string;
  specialty: string;
  department: string;
  licenseNo: string;
  facility: string;
}

// ---------- ICD-10 Code ----------
export interface ICDCode {
  code: string;
  description: string;
  category: string;
}
